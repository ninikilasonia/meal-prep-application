from fastapi import FastAPI


app = FastAPI(title="Web-Based Meal Prep Platform API")


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Web-Based Meal Prep Platform API"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "message": "Meal prep backend is running",
    }
