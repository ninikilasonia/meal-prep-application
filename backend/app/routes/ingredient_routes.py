from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ingredient import Ingredient
from app.schemas.ingredient_schema import (
    IngredientCreate,
    IngredientResponse,
    IngredientUpdate,
)


router = APIRouter(prefix="/ingredients", tags=["ingredients"])


def get_ingredient_or_404(db: Session, ingredient_id: int) -> Ingredient:
    ingredient = db.get(Ingredient, ingredient_id)
    if ingredient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found",
        )

    return ingredient


@router.get("", response_model=list[IngredientResponse])
def list_ingredients(db: Session = Depends(get_db)) -> list[Ingredient]:
    return list(db.scalars(select(Ingredient)).all())


@router.get("/{ingredient_id}", response_model=IngredientResponse)
def read_ingredient(
    ingredient_id: int,
    db: Session = Depends(get_db),
) -> Ingredient:
    return get_ingredient_or_404(db, ingredient_id)


@router.post(
    "",
    response_model=IngredientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_ingredient(
    ingredient_data: IngredientCreate,
    db: Session = Depends(get_db),
) -> Ingredient:
    ingredient = Ingredient(**ingredient_data.model_dump())
    db.add(ingredient)
    db.commit()
    db.refresh(ingredient)
    return ingredient


@router.put("/{ingredient_id}", response_model=IngredientResponse)
def update_ingredient(
    ingredient_id: int,
    ingredient_data: IngredientUpdate,
    db: Session = Depends(get_db),
) -> Ingredient:
    ingredient = get_ingredient_or_404(db, ingredient_id)

    for field, value in ingredient_data.model_dump(exclude_unset=True).items():
        setattr(ingredient, field, value)

    db.commit()
    db.refresh(ingredient)
    return ingredient


@router.delete("/{ingredient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ingredient(
    ingredient_id: int,
    db: Session = Depends(get_db),
) -> None:
    ingredient = get_ingredient_or_404(db, ingredient_id)
    db.delete(ingredient)
    db.commit()
