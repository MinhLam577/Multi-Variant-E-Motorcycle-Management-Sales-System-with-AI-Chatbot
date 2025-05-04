import apiClient from "./apiClient";
import endpoints from "./endpoints.ts";

export const getAllBrand = (current, paseSize) => {
  return apiClient.get(endpoints.brand.list(current, paseSize));
};
