from app.models.recipe import Recipe


NUTRITION_FIELDS = (
    "calories",
    "protein",
    "carbohydrates",
    "fat",
    "fiber",
)
NutritionValues = dict[str, float]


def empty_nutrition_values() -> NutritionValues:
    return {field: 0.0 for field in NUTRITION_FIELDS}


def calculate_total_nutrition(recipe: Recipe) -> NutritionValues:
    totals = empty_nutrition_values()

    for recipe_ingredient in recipe.ingredients:
        ingredient = recipe_ingredient.ingredient
        if ingredient is None:
            continue

        for field in NUTRITION_FIELDS:
            totals[field] += getattr(ingredient, field) * recipe_ingredient.quantity

    return totals


def calculate_nutrition_per_serving(
    total_nutrition: NutritionValues,
    base_servings: float,
) -> NutritionValues:
    return {
        field: total_nutrition[field] / base_servings
        for field in NUTRITION_FIELDS
    }


def calculate_recipe_nutrition(recipe: Recipe) -> dict[str, float]:
    total_nutrition = calculate_total_nutrition(recipe)
    per_serving_nutrition = calculate_nutrition_per_serving(
        total_nutrition,
        recipe.base_servings,
    )

    nutrition: dict[str, float] = {}
    for field in NUTRITION_FIELDS:
        nutrition[f"total_{field}"] = total_nutrition[field]
        nutrition[f"{field}_per_serving"] = per_serving_nutrition[field]

    return nutrition
