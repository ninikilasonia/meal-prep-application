from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import create_db_tables
from app.routes import (
    household_router,
    ingredient_router,
    meal_plan_router,
    recipe_router,
    shopping_list_router,
)


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    create_db_tables()
    yield


app = FastAPI(title="Web-Based Meal Prep Platform API", lifespan=lifespan)
app.include_router(household_router)
app.include_router(ingredient_router)
app.include_router(meal_plan_router)
app.include_router(recipe_router)
app.include_router(shopping_list_router)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Web-Based Meal Prep Platform API"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "message": "Meal prep backend is running",
    }
