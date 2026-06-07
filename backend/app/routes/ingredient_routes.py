from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ingredient import Ingredient
from app.schemas.ingredient_schema import (
    IngredientCreate,
    IngredientResponse,
    IngredientUpdate,
)
from app.services import ingredient_service


router = APIRouter(prefix="/ingredients", tags=["ingredients"])


@router.get("", response_model=list[IngredientResponse])
def list_ingredients(db: Session = Depends(get_db)) -> list[Ingredient]:
    return ingredient_service.list_ingredients(db)


@router.get("/{ingredient_id}", response_model=IngredientResponse)
def read_ingredient(
    ingredient_id: int,
    db: Session = Depends(get_db),
) -> Ingredient:
    return ingredient_service.get_ingredient_or_404(db, ingredient_id)


@router.post(
    "",
    response_model=IngredientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_ingredient(
    ingredient_data: IngredientCreate,
    db: Session = Depends(get_db),
) -> Ingredient:
    return ingredient_service.create_ingredient(db, ingredient_data)


@router.put("/{ingredient_id}", response_model=IngredientResponse)
def update_ingredient(
    ingredient_id: int,
    ingredient_data: IngredientUpdate,
    db: Session = Depends(get_db),
) -> Ingredient:
    return ingredient_service.update_ingredient(db, ingredient_id, ingredient_data)


@router.delete("/{ingredient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ingredient(
    ingredient_id: int,
    db: Session = Depends(get_db),
) -> None:
    ingredient_service.delete_ingredient(db, ingredient_id)
