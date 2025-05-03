import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const getAllCategory = () => {
  return apiClient.get(endpoints.category.list);
};
