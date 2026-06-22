from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pantry import PantryItem
from app.schemas.pantry_schema import (
    PantryItemCreate,
    PantryItemResponse,
    PantryItemUpdate,
)
from app.services import pantry_service


router = APIRouter(prefix="/pantry", tags=["pantry"])


@router.get("", response_model=list[PantryItemResponse])
def list_pantry_items(db: Session = Depends(get_db)) -> list[PantryItem]:
    return pantry_service.list_pantry_items(db)


@router.post(
    "",
    response_model=PantryItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_pantry_item(
    pantry_item_data: PantryItemCreate,
    db: Session = Depends(get_db),
) -> PantryItem:
    return pantry_service.create_pantry_item(db, pantry_item_data)


@router.put("/{pantry_item_id}", response_model=PantryItemResponse)
def update_pantry_item(
    pantry_item_id: int,
    pantry_item_data: PantryItemUpdate,
    db: Session = Depends(get_db),
) -> PantryItem:
    return pantry_service.update_pantry_item(db, pantry_item_id, pantry_item_data)


@router.delete("/{pantry_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pantry_item(
    pantry_item_id: int,
    db: Session = Depends(get_db),
) -> None:
    pantry_service.delete_pantry_item(db, pantry_item_id)
