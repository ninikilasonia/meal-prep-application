# Meal Prep Backend

FastAPI backend for the Web-Based Meal Prep Platform.

## Setup

Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Run the local development server:

```powershell
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Endpoints

- `GET /` returns the API welcome message.
- `GET /health` returns backend health status.
