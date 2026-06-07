# Meal Prep Frontend

React + Vite frontend for the Web-Based Meal Prep Platform.

## Technology

- React (JavaScript / JSX)
- Vite (build tool & dev server)
- CSS Modules for component/page styling (no UI framework)

## Setup

Install dependencies:

```powershell
npm install
```

Create a `.env` file (copy from `.env.example`) and set the backend URL:

```text
VITE_API_BASE_URL=http://localhost:8000
```

## Run

```powershell
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Backend

This frontend talks to Nino's FastAPI backend (see `../backend`). The base URL
is read from `VITE_API_BASE_URL`; never hardcode backend URLs in components.
