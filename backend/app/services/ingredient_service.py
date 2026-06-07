from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.ingredient import Ingredient
from app.schemas.ingredient_schema import IngredientCreate, IngredientUpdate


def get_ingredient_or_404(db: Session, ingredient_id: int) -> Ingredient:
    ingredient = db.get(Ingredient, ingredient_id)
    if ingredient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient not found",
        )

    return ingredient


def list_ingredients(db: Session) -> list[Ingredient]:
    return list(db.scalars(select(Ingredient)).all())


def create_ingredient(db: Session, ingredient_data: IngredientCreate) -> Ingredient:
    ingredient = Ingredient(**ingredient_data.model_dump())
    db.add(ingredient)
    db.commit()
    db.refresh(ingredient)
    return ingredient


def update_ingredient(
    db: Session,
    ingredient_id: int,
    ingredient_data: IngredientUpdate,
) -> Ingredient:
    ingredient = get_ingredient_or_404(db, ingredient_id)

    for field, value in ingredient_data.model_dump(exclude_unset=True).items():
        setattr(ingredient, field, value)

    db.commit()
    db.refresh(ingredient)
    return ingredient


def delete_ingredient(db: Session, ingredient_id: int) -> None:
    ingredient = get_ingredient_or_404(db, ingredient_id)
    db.delete(ingredient)
    db.commit()
