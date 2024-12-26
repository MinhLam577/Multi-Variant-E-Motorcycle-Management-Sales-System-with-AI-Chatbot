import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const getCars = async ({ page, size }) => {
  const response = await apiClient.get(endpoints.cars.list(page, size));
  return response.data;
};

export const getCarDetails = async (id) => {
  const response = await apiClient.get(endpoints.cars.details(id));
  return response.data;
};

export const createCar = async (carData) => {
  const response = await apiClient.post(endpoints.cars.create, carData);
  return response.data;
};
