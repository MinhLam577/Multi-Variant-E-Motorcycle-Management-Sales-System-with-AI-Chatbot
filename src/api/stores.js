import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const getListStore = async ({ page, size }) => {
  const response = await apiClient.get(endpoints.cars.list(page, size));
  return response.data;
};

export const getStoreDetails = async (id) => {
  const response = await apiClient.get(endpoints.cars.details(id));
  return response.data;
};

export const createStore = async (carData) => {
  const response = await apiClient.post(endpoints.cars.create, carData);
  return response.data;
};

export const deleteStore = async (id) => {
  const response = await apiClient.delete(endpoints.cars.delete(id));
  return response?.data?.data;
};

export const updateImage = async (id) => {
  const response = await apiClient.post(endpoints.cars.delete(id));
  return response?.data?.data;
};
