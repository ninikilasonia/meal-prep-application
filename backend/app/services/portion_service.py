from app.models.household_member import HouseholdMember
from app.models.recipe import Recipe
from app.schemas.meal_plan_schema import PortionSuggestionResponse
from app.services.nutrition_service import calculate_recipe_nutrition


MIN_PORTION_MULTIPLIER = 0.4
MAX_PORTION_MULTIPLIER = 1.5


def clamp_portion_multiplier(value: float) -> float:
    return min(max(value, MIN_PORTION_MULTIPLIER), MAX_PORTION_MULTIPLIER)


def get_age_base_portion(member: HouseholdMember) -> tuple[float, str]:
    if member.age < 13:
        return 0.6, "child base portion 0.6"

    if member.age <= 18:
        return 0.8, "teen base portion 0.8"

    return 1.0, "adult base portion 1.0"


def get_goal_adjustment(member: HouseholdMember) -> tuple[float, str | None]:
    if member.goal == "lose":
        return -0.1, "lose goal decreases portion by 0.1"

    if member.goal == "gain":
        return 0.2, "gain goal increases portion by 0.2"

    return 0.0, None


def get_activity_adjustment(member: HouseholdMember) -> tuple[float, str | None]:
    if member.activity_level == "high":
        return 0.1, "high activity increases portion by 0.1"

    return 0.0, None


def get_recipe_calorie_adjustment(
    member: HouseholdMember,
    recipe: Recipe,
) -> tuple[float, str | None]:
    nutrition = calculate_recipe_nutrition(recipe)
    calories_per_serving = nutrition["calories_per_serving"]
    if calories_per_serving <= 0 or member.daily_calorie_goal <= 0:
        return 0.0, None

    calorie_share = calories_per_serving / member.daily_calorie_goal
    if calorie_share > 0.45:
        return -0.1, "high-calorie recipe decreases portion by 0.1"

    return 0.0, None


def suggest_portion_multiplier(
    member: HouseholdMember,
    recipe: Recipe,
) -> PortionSuggestionResponse:
    portion_multiplier, base_reason = get_age_base_portion(member)
    explanation_parts = [base_reason]

    for adjustment, reason in (
        get_goal_adjustment(member),
        get_activity_adjustment(member),
        get_recipe_calorie_adjustment(member, recipe),
    ):
        portion_multiplier += adjustment
        if reason is not None:
            explanation_parts.append(reason)

    portion_multiplier = round(clamp_portion_multiplier(portion_multiplier), 2)
    explanation_parts.append(
        f"final suggestion clamped between {MIN_PORTION_MULTIPLIER} and "
        f"{MAX_PORTION_MULTIPLIER}",
    )

    return PortionSuggestionResponse(
        suggested_portion_multiplier=portion_multiplier,
        explanation="; ".join(explanation_parts),
    )
