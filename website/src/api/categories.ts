import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const getAllCategory = (query: string) => {
    return apiClient.get(endpoints.category.list(query));
};
