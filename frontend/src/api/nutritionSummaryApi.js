import { apiClient } from "./apiClient.js";

// Backend aggregates planned-meal nutrition per household member against their
// daily goals. May return a single member object or a list of them.
export const getNutritionSummary = () => apiClient.get("/nutrition-summary");
