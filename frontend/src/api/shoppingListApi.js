import { apiClient } from "./apiClient.js";

// Backend generates the shopping list from planned meals minus pantry stock.
export const getShoppingList = () => apiClient.get("/shopping-list");
