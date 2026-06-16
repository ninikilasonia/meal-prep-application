from app.routes.household_routes import router as household_router
from app.routes.ingredient_routes import router as ingredient_router
from app.routes.meal_plan_routes import router as meal_plan_router
from app.routes.nutrition_summary_routes import router as nutrition_summary_router
from app.routes.pantry_routes import router as pantry_router
from app.routes.recipe_routes import router as recipe_router
from app.routes.shopping_list_routes import router as shopping_list_router


__all__ = [
    "household_router",
    "ingredient_router",
    "meal_plan_router",
    "nutrition_summary_router",
    "pantry_router",
    "recipe_router",
    "shopping_list_router",
]
