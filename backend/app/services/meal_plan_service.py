from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.household_member import HouseholdMember
from app.models.meal_plan import MealPlanEntry
from app.models.recipe import Recipe
from app.schemas.meal_plan_schema import (
    MealPlanEntryCreate,
    MealPlanEntryResponse,
    MealPlanEntryUpdate,
)


def meal_plan_query():
    return select(MealPlanEntry).options(
        selectinload(MealPlanEntry.recipe),
        selectinload(MealPlanEntry.member),
    )


def get_meal_plan_entry_or_404(db: Session, entry_id: int) -> MealPlanEntry:
    entry = db.scalar(meal_plan_query().where(MealPlanEntry.id == entry_id))
    if entry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan entry not found",
        )

    return entry


def validate_recipe_exists(db: Session, recipe_id: int) -> None:
    if db.get(Recipe, recipe_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )


def validate_member_exists(db: Session, member_id: int) -> None:
    if db.get(HouseholdMember, member_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Household member not found",
        )


def validate_entry_references(db: Session, recipe_id: int, member_id: int) -> None:
    validate_recipe_exists(db, recipe_id)
    validate_member_exists(db, member_id)


def serialize_meal_plan_entry(entry: MealPlanEntry) -> MealPlanEntryResponse:
    return MealPlanEntryResponse(
        id=entry.id,
        day=entry.day,
        meal_type=entry.meal_type,
        recipe_id=entry.recipe_id,
        recipe_name=entry.recipe.name if entry.recipe is not None else None,
        member_id=entry.member_id,
        member_name=entry.member.name if entry.member is not None else None,
        portion_multiplier=entry.portion_multiplier,
    )


def list_meal_plan_entries(db: Session) -> list[MealPlanEntryResponse]:
    entries = db.scalars(meal_plan_query()).all()
    return [serialize_meal_plan_entry(entry) for entry in entries]


def read_meal_plan_entry(db: Session, entry_id: int) -> MealPlanEntryResponse:
    return serialize_meal_plan_entry(get_meal_plan_entry_or_404(db, entry_id))


def create_meal_plan_entry(
    db: Session,
    entry_data: MealPlanEntryCreate,
) -> MealPlanEntryResponse:
    validate_entry_references(db, entry_data.recipe_id, entry_data.member_id)

    entry = MealPlanEntry(**entry_data.model_dump())
    db.add(entry)
    db.commit()

    return read_meal_plan_entry(db, entry.id)


def update_meal_plan_entry(
    db: Session,
    entry_id: int,
    entry_data: MealPlanEntryUpdate,
) -> MealPlanEntryResponse:
    entry = get_meal_plan_entry_or_404(db, entry_id)
    update_values = entry_data.model_dump(exclude_unset=True)

    recipe_id = update_values.get("recipe_id", entry.recipe_id)
    member_id = update_values.get("member_id", entry.member_id)
    if "recipe_id" in update_values or "member_id" in update_values:
        validate_entry_references(db, recipe_id, member_id)

    for field, value in update_values.items():
        setattr(entry, field, value)

    db.commit()

    return read_meal_plan_entry(db, entry.id)


def delete_meal_plan_entry(db: Session, entry_id: int) -> None:
    entry = get_meal_plan_entry_or_404(db, entry_id)
    db.delete(entry)
    db.commit()
