import { apiClient } from "./apiClient.js";

export const getIngredients = () => apiClient.get("/ingredients");
export const getIngredient = (id) => apiClient.get(`/ingredients/${id}`);
export const createIngredient = (data) => apiClient.post("/ingredients", data);
export const updateIngredient = (id, data) => apiClient.put(`/ingredients/${id}`, data);
export const deleteIngredient = (id) => apiClient.delete(`/ingredients/${id}`);
