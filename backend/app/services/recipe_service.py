from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.ingredient import Ingredient
from app.models.recipe import Recipe, RecipeIngredient
from app.schemas.recipe_schema import (
    RecipeCreate,
    RecipeIngredientCreate,
    RecipeIngredientResponse,
    RecipeResponse,
    RecipeUpdate,
)


def recipe_query():
    return select(Recipe).options(
        selectinload(Recipe.ingredients).selectinload(RecipeIngredient.ingredient),
    )


def get_recipe_or_404(db: Session, recipe_id: int) -> Recipe:
    recipe = db.scalar(recipe_query().where(Recipe.id == recipe_id))
    if recipe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

    return recipe


def validate_ingredient_ids(
    db: Session,
    recipe_ingredients: list[RecipeIngredientCreate],
) -> None:
    ingredient_ids = {item.ingredient_id for item in recipe_ingredients}
    if not ingredient_ids:
        return

    existing_ids = set(
        db.scalars(select(Ingredient.id).where(Ingredient.id.in_(ingredient_ids))).all(),
    )
    missing_ids = sorted(ingredient_ids - existing_ids)
    if missing_ids:
        missing = ", ".join(str(ingredient_id) for ingredient_id in missing_ids)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ingredient not found: {missing}",
        )


def build_recipe_ingredients(
    recipe_ingredients: list[RecipeIngredientCreate],
) -> list[RecipeIngredient]:
    return [
        RecipeIngredient(
            ingredient_id=ingredient.ingredient_id,
            quantity=ingredient.quantity,
        )
        for ingredient in recipe_ingredients
    ]


def serialize_recipe(recipe: Recipe) -> RecipeResponse:
    return RecipeResponse(
        id=recipe.id,
        name=recipe.name,
        description=recipe.description,
        meal_type=recipe.meal_type,
        base_servings=recipe.base_servings,
        ingredients=[
            RecipeIngredientResponse(
                id=recipe_ingredient.id,
                ingredient_id=recipe_ingredient.ingredient_id,
                name=recipe_ingredient.ingredient.name
                if recipe_ingredient.ingredient is not None
                else None,
                quantity=recipe_ingredient.quantity,
            )
            for recipe_ingredient in recipe.ingredients
        ],
    )


def list_recipes(db: Session) -> list[RecipeResponse]:
    recipes = db.scalars(recipe_query()).all()
    return [serialize_recipe(recipe) for recipe in recipes]


def read_recipe(db: Session, recipe_id: int) -> RecipeResponse:
    return serialize_recipe(get_recipe_or_404(db, recipe_id))


def create_recipe(db: Session, recipe_data: RecipeCreate) -> RecipeResponse:
    validate_ingredient_ids(db, recipe_data.ingredients)

    recipe_values = recipe_data.model_dump(exclude={"ingredients"})
    recipe = Recipe(**recipe_values)
    recipe.ingredients = build_recipe_ingredients(recipe_data.ingredients)

    db.add(recipe)
    db.commit()

    return read_recipe(db, recipe.id)


def update_recipe(
    db: Session,
    recipe_id: int,
    recipe_data: RecipeUpdate,
) -> RecipeResponse:
    recipe = get_recipe_or_404(db, recipe_id)
    update_values = recipe_data.model_dump(exclude_unset=True)
    recipe_ingredients = update_values.pop("ingredients", None)

    if recipe_ingredients is not None:
        validate_ingredient_ids(db, recipe_data.ingredients or [])
        recipe.ingredients = build_recipe_ingredients(recipe_data.ingredients or [])

    for field, value in update_values.items():
        setattr(recipe, field, value)

    db.commit()

    return read_recipe(db, recipe.id)


def delete_recipe(db: Session, recipe_id: int) -> None:
    recipe = get_recipe_or_404(db, recipe_id)
    db.delete(recipe)
    db.commit()
