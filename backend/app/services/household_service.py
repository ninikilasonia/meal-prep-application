from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.household_member import HouseholdMember
from app.schemas.household_schema import (
    HouseholdMemberCreate,
    HouseholdMemberUpdate,
)
from app.services.goal_service import apply_goal_estimates


def get_household_member_or_404(db: Session, member_id: int) -> HouseholdMember:
    member = db.get(HouseholdMember, member_id)
    if member is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Household member not found",
        )

    return member


def list_household_members(db: Session) -> list[HouseholdMember]:
    return list(db.scalars(select(HouseholdMember)).all())


def create_household_member(
    db: Session,
    member_data: HouseholdMemberCreate,
) -> HouseholdMember:
    member = HouseholdMember(**member_data.model_dump())
    apply_goal_estimates(member)

    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def update_household_member(
    db: Session,
    member_id: int,
    member_data: HouseholdMemberUpdate,
) -> HouseholdMember:
    member = get_household_member_or_404(db, member_id)

    for field, value in member_data.model_dump(exclude_unset=True).items():
        setattr(member, field, value)

    apply_goal_estimates(member)

    db.commit()
    db.refresh(member)
    return member


def delete_household_member(db: Session, member_id: int) -> None:
    member = get_household_member_or_404(db, member_id)
    db.delete(member)
    db.commit()
