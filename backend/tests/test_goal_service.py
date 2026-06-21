from types import SimpleNamespace

import pytest

from app.services.goal_service import (
    apply_goal_estimates,
    calculate_goal_estimates,
    estimate_daily_calorie_goal,
    estimate_daily_fiber_goal,
    estimate_daily_protein_goal,
)


def make_member(**overrides) -> SimpleNamespace:
    values = {
        "age": 30,
        "sex": "male",
        "height": 180,
        "weight": 80,
        "activity_level": "medium",
        "goal": "maintain",
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def test_goal_estimation_calculates_calories_protein_and_fiber() -> None:
    member = make_member()

    assert estimate_daily_calorie_goal(member) == pytest.approx(2581)
    assert estimate_daily_protein_goal(member) == pytest.approx(112)
    assert estimate_daily_fiber_goal(member) == pytest.approx(30)
    assert calculate_goal_estimates(member) == {
        "daily_calorie_goal": 2581,
        "daily_protein_goal": 112,
        "daily_fiber_goal": 30,
    }


def test_goal_estimation_applies_goal_and_age_adjustments() -> None:
    child = make_member(
        age=12,
        sex="female",
        height=150,
        weight=45,
        activity_level="low",
        goal="lose",
    )

    assert calculate_goal_estimates(child) == {
        "daily_calorie_goal": 1099.8,
        "daily_protein_goal": 81,
        "daily_fiber_goal": 25,
    }


def test_apply_goal_estimates_sets_member_goal_fields() -> None:
    member = make_member(goal="gain", activity_level="high")

    apply_goal_estimates(member)

    assert member.daily_calorie_goal == 3326
    assert member.daily_protein_goal == 144
    assert member.daily_fiber_goal == 30
