import { apiClient } from "./apiClient.js";

export const getRecipes = () => apiClient.get("/recipes");
export const getRecipe = (id) => apiClient.get(`/recipes/${id}`);
export const createRecipe = (data) => apiClient.post("/recipes", data);
export const updateRecipe = (id, data) => apiClient.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => apiClient.delete(`/recipes/${id}`);
