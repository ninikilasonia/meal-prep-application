# Meal Prep Backend

FastAPI backend for the Web-Based Meal Prep Platform.

## Setup

Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Run the local development server:

```powershell
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Endpoints

- `GET /` returns the API welcome message.
- `GET /health` returns backend health status.
- `GET /household-members` returns all household members.
- `GET /household-members/{member_id}` returns one household member.
- `POST /household-members` creates a household member.
- `PUT /household-members/{member_id}` updates a household member.
- `DELETE /household-members/{member_id}` deletes a household member.
- `GET /ingredients` returns all ingredients.
- `GET /ingredients/{ingredient_id}` returns one ingredient.
- `POST /ingredients` creates an ingredient.
- `PUT /ingredients/{ingredient_id}` updates an ingredient.
- `DELETE /ingredients/{ingredient_id}` deletes an ingredient.
- `GET /meal-plan` returns all meal plan entries.
- `GET /meal-plan/{entry_id}` returns one meal plan entry.
- `POST /meal-plan` creates a meal plan entry.
- `PUT /meal-plan/{entry_id}` updates a meal plan entry.
- `DELETE /meal-plan/{entry_id}` deletes a meal plan entry.
- `GET /recipes` returns all recipes with recipe ingredients.
- `GET /recipes/{recipe_id}` returns one recipe with recipe ingredients.
- `POST /recipes` creates a recipe and its ingredient quantities.
- `PUT /recipes/{recipe_id}` updates a recipe and optionally replaces its ingredient list.
- `DELETE /recipes/{recipe_id}` deletes a recipe.
