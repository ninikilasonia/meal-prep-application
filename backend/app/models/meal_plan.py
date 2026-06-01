from __future__ import annotations

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MealPlanEntry(Base):
    __tablename__ = "meal_plan_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    day: Mapped[str] = mapped_column(String, nullable=False, index=True)
    meal_type: Mapped[str] = mapped_column(String, nullable=False)
    recipe_id: Mapped[int] = mapped_column(
        ForeignKey("recipes.id"),
        nullable=False,
        index=True,
    )
    member_id: Mapped[int] = mapped_column(
        ForeignKey("household_members.id"),
        nullable=False,
        index=True,
    )
    portion_multiplier: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=1.0,
    )

    recipe: Mapped["Recipe"] = relationship(back_populates="meal_plan_entries")
    member: Mapped["HouseholdMember"] = relationship(back_populates="meal_plan_entries")
