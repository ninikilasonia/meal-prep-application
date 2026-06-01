from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import create_db_tables


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    create_db_tables()
    yield


app = FastAPI(title="Web-Based Meal Prep Platform API", lifespan=lifespan)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Web-Based Meal Prep Platform API"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "message": "Meal prep backend is running",
    }
