from app.routes.household_routes import router as household_router
from app.routes.ingredient_routes import router as ingredient_router
from app.routes.recipe_routes import router as recipe_router


__all__ = ["household_router", "ingredient_router", "recipe_router"]
