# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Web-based meal prep platform: ingredient library → recipes (with auto-calculated nutrition) → household members → weekly meal plan → nutrition progress and shopping lists. See `README.md` for the full product vision.

The repo is split into `backend/` (FastAPI + SQLAlchemy, owned by Nino) and `frontend/` (React + Vite, owned by Luka). This is a student final project — keep solutions practical and avoid unnecessary complexity.

## Backend commands

All commands run from `backend/` (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload   # serves at http://127.0.0.1:8000
```

There is no test suite, linter config, or migration tooling yet. `requirements.txt` lists only `fastapi`, `SQLAlchemy`, and `uvicorn[standard]`; Pydantic is used in schemas but is pulled in transitively via FastAPI.

## Frontend commands

All commands run from `frontend/` (PowerShell):

```powershell
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

The backend base URL comes from `VITE_API_BASE_URL` (see `frontend/.env`, defaulting to `http://localhost:8000`). Copy `.env.example` to `.env` on a fresh checkout — `.env` is gitignored.

## Backend architecture

Request flow is **route → service → model/schema**. `app/main.py` registers the routers and exposes `/` and `/health`.

### Database (`app/database.py`)
- SQLite file `backend/meal_prep.db` (gitignored), accessed synchronously.
- `Base` is the declarative base every model inherits from.
- `create_db_tables()` runs on app startup via the FastAPI `lifespan` handler — it imports `app.models` (registering all models) then runs `Base.metadata.create_all`. **Schema changes are applied by recreating tables, not migrations.** Any new model must be importable through `app/models/__init__.py` or its table won't be created.
- `get_db()` is the session-per-request dependency used in routes.

### Models (`app/models/`)
SQLAlchemy 2.0 typed style (`Mapped` / `mapped_column`). The domain graph:
- **Ingredient** — name, unit, and per-unit nutrition (calories, protein, carbohydrates, fat, fiber).
- **Recipe** + **RecipeIngredient** — a recipe has many `RecipeIngredient` rows (cascade delete-orphan), each linking an `Ingredient` with a `quantity`. `base_servings` drives per-serving nutrition math.
- **HouseholdMember** — demographics (age, sex, height, weight, activity_level, goal, dietary_restrictions) plus daily nutrition goals.
- **MealPlanEntry** — assigns a `Recipe` to a `HouseholdMember` on a `day` + `meal_type`, scaled by `portion_multiplier`.
- **PantryItem** — `available_quantity` of an `Ingredient` on hand; used to subtract from generated shopping lists.

### Routes & services (`app/routes/`, `app/services/`)
Implemented routers (registered in `main.py`): `ingredients`, `recipes`, `household-members` — full CRUD each. Routers stay thin; business logic lives in the matching service module. `nutrition_service` computes recipe nutrition totals and per-serving values, which `RecipeResponse` returns alongside the recipe.

**Not yet implemented** (models/schemas may exist, but no routers): meal-plan, pantry, shopping-list, nutrition-summary, and `suggest-portion`. The frontend treats these endpoints as "not ready" — see below.

### Schemas (`app/schemas/`)
Pydantic v2. Each domain has a consistent `Base` / `Create` / `Update` / `Response` set, re-exported from `app/schemas/__init__.py`. Conventions when extending:
- `Response` models set `model_config = ConfigDict(from_attributes=True)` to read from ORM objects.
- `Update` models make every field optional.
- Validation lives in `@field_validator`s — e.g. recipe `meal_type` is normalized to lowercase and constrained to `ALLOWED_MEAL_TYPES` (`breakfast`, `lunch`, `dinner`, `snack`); names are stripped and rejected if empty.

## Frontend architecture & conventions (Luka's part)

The frontend is a Vite + React app using **JavaScript/JSX** (not TypeScript) and **CSS Modules** for all styling. Hard rules for frontend work:

- **Do not edit backend files**, do not implement backend logic, do not add authentication.
- **No UI frameworks** (no Tailwind, Material UI, Bootstrap). Style with CSS Modules (`*.module.css`) only.
- **No new dependencies** beyond what a task needs; `react-router-dom` is the expected router once routing is added.

Directory conventions under `frontend/src/`:
- `api/` — all backend calls. A shared `apiClient.js` wraps fetch + `VITE_API_BASE_URL`; per-domain helpers (`ingredientsApi.js`, `recipesApi.js`, etc.) build on it. Never hardcode backend URLs in components.
- `components/` — reusable components, grouped by area (`layout/`, `forms/`, `common/`, `recipes/`, `household/`, `meal-plan/`, `shopping-list/`, `nutrition/`). Each component has a colocated `*.module.css`.
- `pages/` — page-level screens (`DashboardPage`, `IngredientsPage`, `RecipesPage`, `HouseholdPage`, `MealPlanPage`, `ShoppingListPage`).
- `utils/` — shared formatting/validation helpers.

UX expectations on every data-backed page: loading state, error state, empty state, and visible form validation messages. **If the backend is unavailable, show a clear message — never fake success.** For endpoints not yet implemented by the backend, keep the structure backend-compatible and use clearly isolated placeholder/mock data, removed once the real endpoint lands.

Design direction: clean meal-planning dashboard, light background with green & cream accents, white cards, rounded corners, simple progress bars, friendly empty states. Design tokens live as CSS variables in `src/index.css` (`--color-primary` green, `--color-accent` cream, etc.).

### Backend API contract (for the frontend)

Base URL `VITE_API_BASE_URL`. List/create endpoints have **no trailing slash** (e.g. `GET /ingredients`, `POST /ingredients`). Live now: `/ingredients`, `/recipes`, `/household-members` (CRUD). Recipe responses include computed `total_*` and `*_per_serving` nutrition fields. Planned (not live): `GET /meal-plan` + CRUD, `POST /meal-plan/suggest-portion`, `GET/POST/PUT/DELETE /pantry`, `GET /shopping-list`, `GET /nutrition-summary`. Allowed enum values: `meal_type` ∈ {breakfast, lunch, dinner, snack}; `sex` ∈ {male, female, other}; `activity_level` ∈ {low, medium, high}; `goal` ∈ {lose, maintain, gain}; `day` ∈ monday…sunday. When the backend omits optional fields like `recipe_name`/`member_name`, fall back to IDs.

## Git / collaboration

- `main` integrates both halves; Nino's backend work arrives via PRs from `nini-branch-*`. Luka's frontend work lives on `feature/frontend`. Pull `origin/main` into `feature/frontend` to pick up new backend endpoints before wiring them up.
- Do not commit or push unless explicitly asked.
