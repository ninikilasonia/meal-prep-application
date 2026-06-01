from __future__ import annotations

from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class HouseholdMember(Base):
    __tablename__ = "household_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    sex: Mapped[str] = mapped_column(String, nullable=False)
    height: Mapped[float] = mapped_column(Float, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    activity_level: Mapped[str] = mapped_column(String, nullable=False)
    goal: Mapped[str] = mapped_column(String, nullable=False)
    dietary_restrictions: Mapped[str | None] = mapped_column(String, nullable=True)
    daily_calorie_goal: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    daily_protein_goal: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    daily_fiber_goal: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    meal_plan_entries: Mapped[list["MealPlanEntry"]] = relationship(
        back_populates="member",
    )
