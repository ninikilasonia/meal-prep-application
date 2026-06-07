from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.recipe_schema import (
    RecipeCreate,
    RecipeResponse,
    RecipeUpdate,
)
from app.services import recipe_service


router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("", response_model=list[RecipeResponse])
def list_recipes(db: Session = Depends(get_db)) -> list[RecipeResponse]:
    return recipe_service.list_recipes(db)


@router.get("/{recipe_id}", response_model=RecipeResponse)
def read_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
) -> RecipeResponse:
    return recipe_service.read_recipe(db, recipe_id)


@router.post(
    "",
    response_model=RecipeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_recipe(
    recipe_data: RecipeCreate,
    db: Session = Depends(get_db),
) -> RecipeResponse:
    return recipe_service.create_recipe(db, recipe_data)


@router.put("/{recipe_id}", response_model=RecipeResponse)
def update_recipe(
    recipe_id: int,
    recipe_data: RecipeUpdate,
    db: Session = Depends(get_db),
) -> RecipeResponse:
    return recipe_service.update_recipe(db, recipe_id, recipe_data)


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
) -> None:
    recipe_service.delete_recipe(db, recipe_id)
