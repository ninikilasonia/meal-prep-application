from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal, create_db_tables
from app.models.household_member import HouseholdMember
from app.models.ingredient import Ingredient
from app.models.meal_plan import MealPlanEntry
from app.models.recipe import Recipe, RecipeIngredient
from app.services.goal_service import apply_goal_estimates
from app.services.portion_service import suggest_portion_multiplier


INGREDIENTS = [
    {
        "name": "chicken breast",
        "unit": "g",
        "calories": 1.65,
        "protein": 0.31,
        "carbohydrates": 0.0,
        "fat": 0.036,
        "fiber": 0.0,
    },
    {
        "name": "rice",
        "unit": "g",
        "calories": 1.3,
        "protein": 0.027,
        "carbohydrates": 0.28,
        "fat": 0.003,
        "fiber": 0.004,
    },
    {
        "name": "broccoli",
        "unit": "g",
        "calories": 0.35,
        "protein": 0.024,
        "carbohydrates": 0.07,
        "fat": 0.004,
        "fiber": 0.026,
    },
    {
        "name": "olive oil",
        "unit": "g",
        "calories": 8.84,
        "protein": 0.0,
        "carbohydrates": 0.0,
        "fat": 1.0,
        "fiber": 0.0,
    },
    {
        "name": "eggs",
        "unit": "piece",
        "calories": 78.0,
        "protein": 6.3,
        "carbohydrates": 0.6,
        "fat": 5.3,
        "fiber": 0.0,
    },
    {
        "name": "yogurt",
        "unit": "g",
        "calories": 0.61,
        "protein": 0.035,
        "carbohydrates": 0.047,
        "fat": 0.033,
        "fiber": 0.0,
    },
]

RECIPES = [
    {
        "name": "Chicken Rice Bowl",
        "description": "Chicken breast with rice, broccoli, and olive oil.",
        "meal_type": "lunch",
        "base_servings": 2.0,
        "ingredients": [
            {"name": "chicken breast", "quantity": 300.0},
            {"name": "rice", "quantity": 250.0},
            {"name": "broccoli", "quantity": 200.0},
            {"name": "olive oil", "quantity": 15.0},
        ],
    },
    {
        "name": "Egg Breakfast Plate",
        "description": "Eggs with yogurt for a simple breakfast plate.",
        "meal_type": "breakfast",
        "base_servings": 1.0,
        "ingredients": [
            {"name": "eggs", "quantity": 2.0},
            {"name": "yogurt", "quantity": 150.0},
        ],
    },
]

HOUSEHOLD_MEMBERS = [
    {
        "name": "Adult Maintain",
        "age": 34,
        "sex": "female",
        "height": 165.0,
        "weight": 65.0,
        "activity_level": "medium",
        "goal": "maintain",
        "dietary_restrictions": None,
    },
    {
        "name": "Adult Gain",
        "age": 28,
        "sex": "male",
        "height": 180.0,
        "weight": 75.0,
        "activity_level": "high",
        "goal": "gain",
        "dietary_restrictions": None,
    },
    {
        "name": "Child Example",
        "age": 10,
        "sex": "other",
        "height": 140.0,
        "weight": 35.0,
        "activity_level": "medium",
        "goal": "maintain",
        "dietary_restrictions": None,
    },
]

MEAL_PLAN_ENTRIES = [
    {
        "day": "monday",
        "meal_type": "lunch",
        "recipe_name": "Chicken Rice Bowl",
        "member_name": "Adult Maintain",
    },
    {
        "day": "tuesday",
        "meal_type": "breakfast",
        "recipe_name": "Egg Breakfast Plate",
        "member_name": "Adult Gain",
    },
    {
        "day": "wednesday",
        "meal_type": "dinner",
        "recipe_name": "Chicken Rice Bowl",
        "member_name": "Child Example",
    },
]


def get_by_name(db: Session, model, name: str):
    return db.scalar(select(model).where(model.name == name))


def get_or_create_ingredient(db: Session, ingredient_data: dict) -> Ingredient:
    ingredient = get_by_name(db, Ingredient, ingredient_data["name"])
    if ingredient is not None:
        return ingredient

    ingredient = Ingredient(**ingredient_data)
    db.add(ingredient)
    db.flush()
    return ingredient


def get_or_create_recipe(
    db: Session,
    recipe_data: dict,
    ingredients_by_name: dict[str, Ingredient],
) -> Recipe:
    recipe = get_by_name(db, Recipe, recipe_data["name"])
    if recipe is None:
        recipe = Recipe(
            name=recipe_data["name"],
            description=recipe_data["description"],
            meal_type=recipe_data["meal_type"],
            base_servings=recipe_data["base_servings"],
        )
        db.add(recipe)
        db.flush()

    existing_ingredient_ids = {
        recipe_ingredient.ingredient_id for recipe_ingredient in recipe.ingredients
    }
    for recipe_ingredient_data in recipe_data["ingredients"]:
        ingredient = ingredients_by_name[recipe_ingredient_data["name"]]
        if ingredient.id in existing_ingredient_ids:
            continue

        recipe.ingredients.append(
            RecipeIngredient(
                ingredient_id=ingredient.id,
                quantity=recipe_ingredient_data["quantity"],
            ),
        )

    db.flush()
    return recipe


def get_or_create_household_member(
    db: Session,
    member_data: dict,
) -> HouseholdMember:
    member = get_by_name(db, HouseholdMember, member_data["name"])
    if member is None:
        member = HouseholdMember(**member_data)
        db.add(member)

    apply_goal_estimates(member)
    db.flush()
    return member


def meal_plan_entry_exists(
    db: Session,
    day: str,
    meal_type: str,
    recipe_id: int,
    member_id: int,
) -> bool:
    existing_entry = db.scalar(
        select(MealPlanEntry).where(
            MealPlanEntry.day == day,
            MealPlanEntry.meal_type == meal_type,
            MealPlanEntry.recipe_id == recipe_id,
            MealPlanEntry.member_id == member_id,
        ),
    )
    return existing_entry is not None


def add_meal_plan_entry_if_missing(
    db: Session,
    entry_data: dict,
    recipes_by_name: dict[str, Recipe],
    members_by_name: dict[str, HouseholdMember],
) -> None:
    recipe = recipes_by_name[entry_data["recipe_name"]]
    member = members_by_name[entry_data["member_name"]]
    if meal_plan_entry_exists(
        db,
        entry_data["day"],
        entry_data["meal_type"],
        recipe.id,
        member.id,
    ):
        return

    suggestion = suggest_portion_multiplier(member, recipe)
    db.add(
        MealPlanEntry(
            day=entry_data["day"],
            meal_type=entry_data["meal_type"],
            recipe_id=recipe.id,
            member_id=member.id,
            portion_multiplier=suggestion.suggested_portion_multiplier,
        ),
    )


def seed_demo_data() -> None:
    create_db_tables()
    db = SessionLocal()
    try:
        ingredients_by_name = {
            ingredient_data["name"]: get_or_create_ingredient(db, ingredient_data)
            for ingredient_data in INGREDIENTS
        }
        recipes_by_name = {
            recipe_data["name"]: get_or_create_recipe(
                db,
                recipe_data,
                ingredients_by_name,
            )
            for recipe_data in RECIPES
        }
        members_by_name = {
            member_data["name"]: get_or_create_household_member(db, member_data)
            for member_data in HOUSEHOLD_MEMBERS
        }

        for entry_data in MEAL_PLAN_ENTRIES:
            add_meal_plan_entry_if_missing(
                db,
                entry_data,
                recipes_by_name,
                members_by_name,
            )

        db.commit()
        print("Demo seed data is ready.")
        print(f"Ingredients: {len(ingredients_by_name)}")
        print(f"Recipes: {len(recipes_by_name)}")
        print(f"Household members: {len(members_by_name)}")
        print(f"Meal plan entries checked: {len(MEAL_PLAN_ENTRIES)}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
