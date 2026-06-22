from sqlalchemy.orm import Session

from app.schemas.shopping_list_schema import ShoppingListItemResponse
from app.services import meal_plan_service, pantry_service


def generate_shopping_list(db: Session) -> list[ShoppingListItemResponse]:
    entries = meal_plan_service.list_meal_plan_entries_with_recipe_ingredients(db)

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
                    available_quantity=0,
                    final_quantity_to_buy=0,
                )

            grouped_items[ingredient.id].required_quantity += required_quantity

    available_quantities = pantry_service.get_available_quantities_by_ingredient(db)
    for item in grouped_items.values():
        item.available_quantity = available_quantities.get(item.ingredient_id, 0)
        # Pantry can exceed the plan; the shopping list should never go negative.
        item.final_quantity_to_buy = max(
            item.required_quantity - item.available_quantity,
            0,
        )

    return sorted(grouped_items.values(), key=lambda item: item.ingredient_id)
