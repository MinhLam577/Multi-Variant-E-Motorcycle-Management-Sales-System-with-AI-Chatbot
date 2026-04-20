import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const getAllCategory = async (query: string) => {
    return await apiClient.get(endpoints.category.list(query));
};
export const getDetailCategory = async (id: string) => {
  return await apiClient.get(endpoints.category.details(id));
};
  