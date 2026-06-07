from app.models.household_member import HouseholdMember


ACTIVITY_FACTORS = {
    "low": 1.2,
    "medium": 1.45,
    "high": 1.7,
}
GOAL_CALORIE_ADJUSTMENTS = {
    "lose": -300,
    "maintain": 0,
    "gain": 300,
}
PROTEIN_FACTORS = {
    "lose": 1.8,
    "maintain": 1.4,
    "gain": 1.8,
}
SEX_BMR_ADJUSTMENTS = {
    "male": 5,
    "female": -161,
    "other": -78,
}


def estimate_bmr(member: HouseholdMember) -> float:
    # Simplified estimates for planning purposes only; this is not medical advice.
    return (
        10 * member.weight
        + 6.25 * member.height
        - 5 * member.age
        + SEX_BMR_ADJUSTMENTS[member.sex]
    )


def estimate_daily_calorie_goal(member: HouseholdMember) -> float:
    maintenance_calories = estimate_bmr(member) * ACTIVITY_FACTORS[member.activity_level]
    return maintenance_calories + GOAL_CALORIE_ADJUSTMENTS[member.goal]


def estimate_daily_protein_goal(member: HouseholdMember) -> float:
    return member.weight * PROTEIN_FACTORS[member.goal]


def estimate_daily_fiber_goal(member: HouseholdMember) -> float:
    if member.age < 18:
        return 25.0

    return 30.0


def calculate_goal_estimates(member: HouseholdMember) -> dict[str, float]:
    return {
        "daily_calorie_goal": round(estimate_daily_calorie_goal(member), 2),
        "daily_protein_goal": round(estimate_daily_protein_goal(member), 2),
        "daily_fiber_goal": round(estimate_daily_fiber_goal(member), 2),
    }


def apply_goal_estimates(member: HouseholdMember) -> None:
    for field, value in calculate_goal_estimates(member).items():
        setattr(member, field, value)
