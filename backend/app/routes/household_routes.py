from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.household_member import HouseholdMember
from app.schemas.household_schema import (
    HouseholdMemberCreate,
    HouseholdMemberResponse,
    HouseholdMemberUpdate,
)
from app.services import household_service


router = APIRouter(prefix="/household-members", tags=["household-members"])


@router.get("", response_model=list[HouseholdMemberResponse])
def list_household_members(db: Session = Depends(get_db)) -> list[HouseholdMember]:
    return household_service.list_household_members(db)


@router.get("/{member_id}", response_model=HouseholdMemberResponse)
def read_household_member(
    member_id: int,
    db: Session = Depends(get_db),
) -> HouseholdMember:
    return household_service.get_household_member_or_404(db, member_id)


@router.post(
    "",
    response_model=HouseholdMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_household_member(
    member_data: HouseholdMemberCreate,
    db: Session = Depends(get_db),
) -> HouseholdMember:
    return household_service.create_household_member(db, member_data)


@router.put("/{member_id}", response_model=HouseholdMemberResponse)
def update_household_member(
    member_id: int,
    member_data: HouseholdMemberUpdate,
    db: Session = Depends(get_db),
) -> HouseholdMember:
    return household_service.update_household_member(db, member_id, member_data)


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_household_member(
    member_id: int,
    db: Session = Depends(get_db),
) -> None:
    household_service.delete_household_member(db, member_id)
