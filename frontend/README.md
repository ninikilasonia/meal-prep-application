# Meal Prep Frontend

React + Vite frontend for the Web-Based Meal Prep Platform.

## Technology

- React (JavaScript / JSX)
- React Router for client-side routing
- Vite (build tool & dev server)
- CSS Modules for component/page styling (no UI framework)

## Setup

Install dependencies:

```powershell
npm install
```

Create a `.env` file by copying `.env.example`. The default points the frontend
at the Vite dev proxy, which forwards `/api/*` to the FastAPI backend and avoids
browser CORS during local development:

```text
VITE_API_BASE_URL=/api
```

To call a CORS-enabled backend directly instead, set the full URL:

```text
VITE_API_BASE_URL=http://localhost:8000
```

## Run

```powershell
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

The app will be available at `http://localhost:5173`. Start the backend
separately (see `../backend`) so the pages can load data.

## Backend Connection

This frontend talks to the FastAPI backend (see `../backend`). The base URL is
read from `VITE_API_BASE_URL`; never hardcode backend URLs in components. In local
development the Vite proxy in `vite.config.js` forwards same-origin `/api/*`
requests to `http://localhost:8000`.

## Pages

- `/` shows the dashboard with summary counts, the nutrition progress summary, and links to each module.
- `/ingredients` manages the ingredient library with nutrition values per unit.
- `/recipes` builds recipes from ingredients and shows calculated nutrition.
- `/household` manages household members used for personalized planning.
- `/meal-plan` plans recipes per day and household member and adjusts portions.
- `/shopping-list` generates a combined shopping list and subtracts pantry quantities you already have.
