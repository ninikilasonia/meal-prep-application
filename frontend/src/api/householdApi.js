import { apiClient } from "./apiClient.js";

export const getHouseholdMembers = () => apiClient.get("/household-members");
export const getHouseholdMember = (id) => apiClient.get(`/household-members/${id}`);
export const createHouseholdMember = (data) => apiClient.post("/household-members", data);
export const updateHouseholdMember = (id, data) =>
  apiClient.put(`/household-members/${id}`, data);
export const deleteHouseholdMember = (id) => apiClient.delete(`/household-members/${id}`);
