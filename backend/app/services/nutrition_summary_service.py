from sqlalchemy.orm import Session

from app.models.household_member import HouseholdMember
from app.schemas.nutrition_summary_schema import (
    DailyNutritionSummaryResponse,
    MemberNutritionSummaryResponse,
    WeeklyNutritionSummaryResponse,
)
from app.services import meal_plan_service
from app.services.nutrition_service import (
    NUTRITION_FIELDS,
    NutritionValues,
    calculate_planned_recipe_nutrition,
    empty_nutrition_values,
)


DAY_ORDER = {
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
}


def add_nutrition_values(
    totals: NutritionValues,
    values: NutritionValues,
) -> None:
    for field in NUTRITION_FIELDS:
        totals[field] += values[field]


def build_daily_summary(
    member: HouseholdMember,
    day: str,
    totals: NutritionValues,
) -> DailyNutritionSummaryResponse:
    return DailyNutritionSummaryResponse(
        day=day,
        **totals,
        # Include goals per day so the frontend can compare planned vs target values.
        calorie_goal=member.daily_calorie_goal,
        protein_goal=member.daily_protein_goal,
        fiber_goal=member.daily_fiber_goal,
    )


def build_weekly_summary(
    daily_totals: dict[str, NutritionValues],
) -> WeeklyNutritionSummaryResponse:
    weekly_totals = empty_nutrition_values()
    for totals in daily_totals.values():
        add_nutrition_values(weekly_totals, totals)

    return WeeklyNutritionSummaryResponse(
        **{
            f"total_{field}": weekly_totals[field]
            for field in NUTRITION_FIELDS
        },
    )


def calculate_planned_nutrition_by_member(
    db: Session,
) -> list[MemberNutritionSummaryResponse]:
    entries = meal_plan_service.list_meal_plan_entries_with_recipe_ingredients(db)

    grouped: dict[int, tuple[HouseholdMember, dict[str, NutritionValues]]] = {}
    for entry in entries:
        if entry.member is None or entry.recipe is None:
            continue

        member, daily_totals = grouped.setdefault(
            entry.member_id,
            (entry.member, {}),
        )
        day_totals = daily_totals.setdefault(entry.day, empty_nutrition_values())
        planned_nutrition = calculate_planned_recipe_nutrition(
            entry.recipe,
            entry.portion_multiplier,
        )
        add_nutrition_values(day_totals, planned_nutrition)

    summaries: list[MemberNutritionSummaryResponse] = []
    for member_id, (member, daily_totals) in sorted(grouped.items()):
        daily_summary = [
            build_daily_summary(member, day, daily_totals[day])
            for day in sorted(
                daily_totals,
                key=lambda day: DAY_ORDER.get(day, len(DAY_ORDER)),
            )
        ]
        summaries.append(
            MemberNutritionSummaryResponse(
                member_id=member_id,
                member_name=member.name,
                daily_summary=daily_summary,
                weekly_summary=build_weekly_summary(daily_totals),
            ),
        )

    return summaries
