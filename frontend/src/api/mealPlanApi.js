import { apiClient } from "./apiClient.js";

// NOTE: these endpoints are not implemented on the backend yet. The Meal Plan
// page falls back to local (session-only) state when they are unavailable.
export const getMealPlan = () => apiClient.get("/meal-plan");
export const createMealPlanEntry = (data) => apiClient.post("/meal-plan", data);
export const updateMealPlanEntry = (id, data) => apiClient.put(`/meal-plan/${id}`, data);
export const deleteMealPlanEntry = (id) => apiClient.delete(`/meal-plan/${id}`);
export const suggestPortion = (data) => apiClient.post("/meal-plan/suggest-portion", data);
