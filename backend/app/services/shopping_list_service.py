from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.meal_plan import MealPlanEntry
from app.models.recipe import Recipe, RecipeIngredient
from app.schemas.shopping_list_schema import ShoppingListItemResponse


def generate_shopping_list(db: Session) -> list[ShoppingListItemResponse]:
    entries = db.scalars(
        select(MealPlanEntry).options(
            selectinload(MealPlanEntry.recipe)
            .selectinload(Recipe.ingredients)
            .selectinload(RecipeIngredient.ingredient),
        ),
    ).all()

    grouped_items: dict[int, ShoppingListItemResponse] = {}
    for entry in entries:
        for recipe_ingredient in entry.recipe.ingredients:
            ingredient = recipe_ingredient.ingredient
            required_quantity = recipe_ingredient.quantity * entry.portion_multiplier

            if ingredient.id not in grouped_items:
                grouped_items[ingredient.id] = ShoppingListItemResponse(
                    ingredient_id=ingredient.id,
                    ingredient_name=ingredient.name,
                    unit=ingredient.unit,
                    required_quantity=0,
                )

            grouped_items[ingredient.id].required_quantity += required_quantity

    return sorted(grouped_items.values(), key=lambda item: item.ingredient_id)
