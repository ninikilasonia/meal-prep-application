import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.models.household_member import HouseholdMember
from app.models.ingredient import Ingredient
from app.models.meal_plan import MealPlanEntry
from app.models.pantry import PantryItem
from app.models.recipe import Recipe, RecipeIngredient
from app.services.shopping_list_service import generate_shopping_list


@pytest.fixture()
def db() -> Session:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    testing_session_local = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )
    session = testing_session_local()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


def add_member(db: Session) -> HouseholdMember:
    member = HouseholdMember(
        name="Tester",
        age=30,
        sex="other",
        height=170,
        weight=70,
        activity_level="medium",
        goal="maintain",
        dietary_restrictions=None,
    )
    db.add(member)
    db.flush()
    return member


def add_ingredient(db: Session, name: str, unit: str = "g") -> Ingredient:
    ingredient = Ingredient(
        name=name,
        unit=unit,
        calories=0,
        protein=0,
        carbohydrates=0,
        fat=0,
        fiber=0,
    )
    db.add(ingredient)
    db.flush()
    return ingredient


def add_recipe(
    db: Session,
    name: str,
    ingredients: list[tuple[Ingredient, float]],
) -> Recipe:
    recipe = Recipe(
        name=name,
        description=None,
        meal_type="lunch",
        base_servings=1,
    )
    recipe.ingredients = [
        RecipeIngredient(ingredient_id=ingredient.id, quantity=quantity)
        for ingredient, quantity in ingredients
    ]
    db.add(recipe)
    db.flush()
    return recipe


def add_meal_plan_entry(
    db: Session,
    recipe: Recipe,
    member: HouseholdMember,
    portion_multiplier: float,
    day: str = "monday",
) -> None:
    db.add(
        MealPlanEntry(
            day=day,
            meal_type=recipe.meal_type,
            recipe_id=recipe.id,
            member_id=member.id,
            portion_multiplier=portion_multiplier,
        ),
    )


def list_by_name(db: Session) -> dict[str, object]:
    return {
        item.ingredient_name: item
        for item in generate_shopping_list(db)
    }


def test_generate_shopping_list_groups_same_ingredient(db: Session) -> None:
    member = add_member(db)
    rice = add_ingredient(db, "rice")
    chicken = add_ingredient(db, "chicken")
    bowl = add_recipe(db, "Bowl", [(rice, 100), (chicken, 50)])
    curry = add_recipe(db, "Curry", [(rice, 200)])
    add_meal_plan_entry(db, bowl, member, portion_multiplier=2)
    add_meal_plan_entry(db, curry, member, portion_multiplier=0.5, day="tuesday")
    db.commit()

    items = list_by_name(db)

    assert items["rice"].required_quantity == pytest.approx(300)
    assert items["rice"].available_quantity == pytest.approx(0)
    assert items["rice"].final_quantity_to_buy == pytest.approx(300)
    assert items["chicken"].required_quantity == pytest.approx(100)


def test_generate_shopping_list_subtracts_available_pantry_quantity(
    db: Session,
) -> None:
    member = add_member(db)
    rice = add_ingredient(db, "rice")
    bowl = add_recipe(db, "Bowl", [(rice, 100)])
    add_meal_plan_entry(db, bowl, member, portion_multiplier=3)
    db.add(PantryItem(ingredient_id=rice.id, available_quantity=125))
    db.commit()

    items = list_by_name(db)

    assert items["rice"].required_quantity == pytest.approx(300)
    assert items["rice"].available_quantity == pytest.approx(125)
    assert items["rice"].final_quantity_to_buy == pytest.approx(175)


def test_generate_shopping_list_never_returns_negative_quantity_to_buy(
    db: Session,
) -> None:
    member = add_member(db)
    rice = add_ingredient(db, "rice")
    bowl = add_recipe(db, "Bowl", [(rice, 100)])
    add_meal_plan_entry(db, bowl, member, portion_multiplier=1)
    db.add(PantryItem(ingredient_id=rice.id, available_quantity=150))
    db.commit()

    items = list_by_name(db)

    assert items["rice"].required_quantity == pytest.approx(100)
    assert items["rice"].available_quantity == pytest.approx(150)
    assert items["rice"].final_quantity_to_buy == pytest.approx(0)
