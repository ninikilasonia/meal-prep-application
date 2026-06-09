import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import IngredientsPage from "./pages/IngredientsPage.jsx";
import RecipesPage from "./pages/RecipesPage.jsx";
import HouseholdPage from "./pages/HouseholdPage.jsx";
import MealPlanPage from "./pages/MealPlanPage.jsx";
import ShoppingListPage from "./pages/ShoppingListPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="ingredients" element={<IngredientsPage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="household" element={<HouseholdPage />} />
          <Route path="meal-plan" element={<MealPlanPage />} />
          <Route path="shopping-list" element={<ShoppingListPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
