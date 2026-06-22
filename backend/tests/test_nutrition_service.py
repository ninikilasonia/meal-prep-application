from types import SimpleNamespace

import pytest

from app.services.nutrition_service import (
    calculate_planned_recipe_nutrition,
    calculate_recipe_nutrition,
)


def make_ingredient(
    calories: float,
    protein: float,
    carbohydrates: float,
    fat: float,
    fiber: float,
) -> SimpleNamespace:
    return SimpleNamespace(
        calories=calories,
        protein=protein,
        carbohydrates=carbohydrates,
        fat=fat,
        fiber=fiber,
    )


def make_recipe_ingredient(
    ingredient: SimpleNamespace,
    quantity: float,
) -> SimpleNamespace:
    return SimpleNamespace(ingredient=ingredient, quantity=quantity)


def test_calculate_recipe_nutrition_totals_and_per_serving() -> None:
    chicken = make_ingredient(1.5, 0.3, 0.0, 0.05, 0.0)
    rice = make_ingredient(1.0, 0.05, 0.25, 0.01, 0.02)
    recipe = SimpleNamespace(
        base_servings=2,
        ingredients=[
            make_recipe_ingredient(chicken, 100),
            make_recipe_ingredient(rice, 200),
        ],
    )

    nutrition = calculate_recipe_nutrition(recipe)

    assert nutrition["total_calories"] == pytest.approx(350)
    assert nutrition["total_protein"] == pytest.approx(40)
    assert nutrition["total_carbohydrates"] == pytest.approx(50)
    assert nutrition["total_fat"] == pytest.approx(7)
    assert nutrition["total_fiber"] == pytest.approx(4)
    assert nutrition["calories_per_serving"] == pytest.approx(175)
    assert nutrition["protein_per_serving"] == pytest.approx(20)
    assert nutrition["carbohydrates_per_serving"] == pytest.approx(25)
    assert nutrition["fat_per_serving"] == pytest.approx(3.5)
    assert nutrition["fiber_per_serving"] == pytest.approx(2)


def test_calculate_planned_recipe_nutrition_uses_portion_multiplier() -> None:
    ingredient = make_ingredient(2, 1, 0.5, 0.25, 0.1)
    recipe = SimpleNamespace(
        base_servings=4,
        ingredients=[make_recipe_ingredient(ingredient, 100)],
    )

    planned_nutrition = calculate_planned_recipe_nutrition(
        recipe,
        portion_multiplier=1.5,
    )

    assert planned_nutrition == pytest.approx(
        {
            "calories": 75,
            "protein": 37.5,
            "carbohydrates": 18.75,
            "fat": 9.375,
            "fiber": 3.75,
        },
    )
