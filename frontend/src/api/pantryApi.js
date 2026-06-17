import { apiClient } from "./apiClient.js";

export const getPantry = () => apiClient.get("/pantry");
export const createPantryItem = (data) => apiClient.post("/pantry", data);
export const updatePantryItem = (id, data) => apiClient.put(`/pantry/${id}`, data);
export const deletePantryItem = (id) => apiClient.delete(`/pantry/${id}`);
