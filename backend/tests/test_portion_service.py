from types import SimpleNamespace

from app.services.portion_service import suggest_portion_multiplier


def make_member(**overrides) -> SimpleNamespace:
    values = {
        "age": 30,
        "goal": "maintain",
        "activity_level": "medium",
        "daily_calorie_goal": 2000,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def make_recipe(calories_per_serving: float) -> SimpleNamespace:
    ingredient = SimpleNamespace(
        calories=calories_per_serving,
        protein=0,
        carbohydrates=0,
        fat=0,
        fiber=0,
    )
    recipe_ingredient = SimpleNamespace(ingredient=ingredient, quantity=1)
    return SimpleNamespace(base_servings=1, ingredients=[recipe_ingredient])


def test_suggest_portion_multiplier_for_adult_maintain_member() -> None:
    suggestion = suggest_portion_multiplier(
        make_member(),
        make_recipe(calories_per_serving=500),
    )

    assert suggestion.suggested_portion_multiplier == 1.0
    assert "adult base portion 1.0" in suggestion.explanation


def test_suggest_portion_multiplier_combines_age_goal_and_activity() -> None:
    suggestion = suggest_portion_multiplier(
        make_member(age=16, goal="gain", activity_level="high"),
        make_recipe(calories_per_serving=500),
    )

    assert suggestion.suggested_portion_multiplier == 1.1
    assert "teen base portion 0.8" in suggestion.explanation
    assert "gain goal increases portion by 0.2" in suggestion.explanation
    assert "high activity increases portion by 0.1" in suggestion.explanation


def test_suggest_portion_multiplier_reduces_high_calorie_recipe() -> None:
    suggestion = suggest_portion_multiplier(
        make_member(age=30, goal="lose", activity_level="medium"),
        make_recipe(calories_per_serving=1000),
    )

    assert suggestion.suggested_portion_multiplier == 0.8
    assert "lose goal decreases portion by 0.1" in suggestion.explanation
    assert "high-calorie recipe decreases portion by 0.1" in suggestion.explanation
