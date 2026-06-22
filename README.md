# Meal Prep Application

A web-based meal prep platform that helps users create recipes, plan meals, calculate nutrition values, suggest personalized portions, and generate shopping lists.

## Team Members

- Nino Kilasonia — Backend
- Luka Zukhbaia — Frontend

## Technology Stack

- Backend: Python 3, FastAPI, SQLAlchemy, SQLite, Uvicorn, Pytest
- Frontend: React
- Version Control: GitHub

## Project Structure

```text
meal-prep-application/
├── backend/
├── frontend/
├── .gitignore
└── README.md
```

## Backend

The backend is a Python FastAPI API that stores meal prep data in a local SQLite database through SQLAlchemy models and services. FastAPI creates the database tables automatically when the app starts. The generated database file is `backend/meal_prep.db` and is ignored by Git.

### Backend Setup

Run these commands from the `backend` folder:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Run the Backend

From the `backend` folder, start the local API server:

```powershell
uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`. FastAPI documentation is available at `http://127.0.0.1:8000/docs` while the server is running.

### Seed Demo Data

From the `backend` folder, run:

```powershell
python seed_data.py
```

The seed script adds demo ingredients, recipes, household members, and meal plan entries. It is safe to run more than once because it reuses existing demo records by name and avoids duplicate meal plan entries.

### API Routes

- `GET /` and `GET /health` for basic API and health checks.
- `/household-members` supports listing, creating, reading, updating, and deleting household members.
- `/ingredients` supports listing, creating, reading, updating, and deleting ingredients.
- `/recipes` supports listing, creating, reading, updating, and deleting recipes with ingredient quantities.
- `/meal-plan` supports listing, creating, reading, updating, and deleting meal plan entries.
- `POST /meal-plan/suggest-portion` suggests a portion multiplier for a member and recipe.
- `GET /nutrition-summary` returns daily and weekly planned nutrition totals by household member.
- `/pantry` supports listing, creating, updating, and deleting pantry item quantities.
- `GET /shopping-list` generates a combined shopping list from planned meals and pantry quantities.

### Calculation Features

- Recipe nutrition totals and per-serving values for calories, protein, carbohydrates, fat, and fiber.
- Planned meal nutrition based on recipe per-serving values and meal plan portion multipliers.
- Household member goal estimates for daily calories, protein, and fiber using age, sex, weight, height, activity level, and goal.
- Portion suggestions that account for age group, nutrition goal, activity level, recipe calories, and clamp results between `0.4` and `1.5`.
- Daily and weekly nutrition summaries grouped by household member.
- Shopping list totals that combine planned recipe ingredients and subtract available pantry quantities without returning negative buy amounts.

### Known Limitations

- The backend uses local SQLite storage and does not include user accounts, authentication, or authorization.
- Database tables are created automatically, but there is no migration system yet.
- Nutrition, calorie goal, and portion calculations are simplified planning estimates, not medical or dietary advice.
- Ingredient quantities are calculated in their stored units; the backend does not convert between units.
- The shopping list is generated from all current meal plan entries and does not filter by date range yet.

## Project Description

Meal Prep Application is a web-based platform designed to help users organize meal preparation in a simple and personalized way. The application allows users to create an ingredient library, build recipes, calculate nutritional values, plan meals for the week or half-week, and generate shopping lists based on selected recipes.

Each ingredient stores important nutritional information such as calories, protein, carbohydrates, fat, and fiber. When users create a recipe, the system automatically calculates the total nutritional value of the recipe and the nutritional value per serving.

The platform also supports household-based meal planning. Users can add multiple household members with personal information such as age, height, weight, activity level, dietary restrictions, and nutrition goals. Based on this information, the system can suggest personalized portion sizes for each person.

After meals are added to the meal plan calendar, the application calculates daily and weekly nutrition progress. It also generates a shopping list by combining all required ingredients from the planned meals. Users can adjust the shopping list by subtracting ingredients they already have at home.

The goal of the project is to create a useful, organized, and user-friendly meal planning system that reduces manual calculations, supports healthier planning, and simplifies grocery preparation.
