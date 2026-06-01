from __future__ import annotations

from sqlalchemy import Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PantryItem(Base):
    __tablename__ = "pantry_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    ingredient_id: Mapped[int] = mapped_column(
        ForeignKey("ingredients.id"),
        nullable=False,
        index=True,
    )
    available_quantity: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    ingredient: Mapped["Ingredient"] = relationship(back_populates="pantry_items")
