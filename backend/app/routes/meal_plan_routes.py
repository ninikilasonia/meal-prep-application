from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.meal_plan_schema import (
    MealPlanEntryCreate,
    MealPlanEntryResponse,
    MealPlanEntryUpdate,
)
from app.services import meal_plan_service


router = APIRouter(prefix="/meal-plan", tags=["meal-plan"])


@router.get("", response_model=list[MealPlanEntryResponse])
def list_meal_plan_entries(
    db: Session = Depends(get_db),
) -> list[MealPlanEntryResponse]:
    return meal_plan_service.list_meal_plan_entries(db)


@router.get("/{entry_id}", response_model=MealPlanEntryResponse)
def read_meal_plan_entry(
    entry_id: int,
    db: Session = Depends(get_db),
) -> MealPlanEntryResponse:
    return meal_plan_service.read_meal_plan_entry(db, entry_id)


@router.post(
    "",
    response_model=MealPlanEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_meal_plan_entry(
    entry_data: MealPlanEntryCreate,
    db: Session = Depends(get_db),
) -> MealPlanEntryResponse:
    return meal_plan_service.create_meal_plan_entry(db, entry_data)


@router.put("/{entry_id}", response_model=MealPlanEntryResponse)
def update_meal_plan_entry(
    entry_id: int,
    entry_data: MealPlanEntryUpdate,
    db: Session = Depends(get_db),
) -> MealPlanEntryResponse:
    return meal_plan_service.update_meal_plan_entry(db, entry_id, entry_data)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meal_plan_entry(
    entry_id: int,
    db: Session = Depends(get_db),
) -> None:
    meal_plan_service.delete_meal_plan_entry(db, entry_id)
