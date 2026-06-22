from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.pantry import PantryItem
from app.schemas.pantry_schema import PantryItemCreate, PantryItemUpdate
from app.services.ingredient_service import get_ingredient_or_404


def get_pantry_item_or_404(db: Session, pantry_item_id: int) -> PantryItem:
    pantry_item = db.get(PantryItem, pantry_item_id)
    if pantry_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pantry item not found",
        )

    return pantry_item


def list_pantry_items(db: Session) -> list[PantryItem]:
    return list(db.scalars(select(PantryItem)).all())


def get_available_quantities_by_ingredient(db: Session) -> dict[int, float]:
    rows = db.execute(
        select(
            PantryItem.ingredient_id,
            func.sum(PantryItem.available_quantity),
        ).group_by(PantryItem.ingredient_id),
    ).all()
    return {
        ingredient_id: available_quantity or 0
        for ingredient_id, available_quantity in rows
    }


def create_pantry_item(
    db: Session,
    pantry_item_data: PantryItemCreate,
) -> PantryItem:
    get_ingredient_or_404(db, pantry_item_data.ingredient_id)

    pantry_item = PantryItem(**pantry_item_data.model_dump())
    db.add(pantry_item)
    db.commit()
    db.refresh(pantry_item)
    return pantry_item


def update_pantry_item(
    db: Session,
    pantry_item_id: int,
    pantry_item_data: PantryItemUpdate,
) -> PantryItem:
    pantry_item = get_pantry_item_or_404(db, pantry_item_id)
    update_values = pantry_item_data.model_dump(exclude_unset=True)

    if "ingredient_id" in update_values:
        get_ingredient_or_404(db, update_values["ingredient_id"])

    for field, value in update_values.items():
        setattr(pantry_item, field, value)

    db.commit()
    db.refresh(pantry_item)
    return pantry_item


def delete_pantry_item(db: Session, pantry_item_id: int) -> None:
    pantry_item = get_pantry_item_or_404(db, pantry_item_id)
    db.delete(pantry_item)
    db.commit()
