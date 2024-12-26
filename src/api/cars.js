import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const getAll = async () => {
  try {
    const [categories, colors, branches] = await Promise.all([
      fetchBranch(),
      fetchCarColor(),
      fetchCategories(),
    ]);

    return {
      categories,
      colors,
      branches,
    };
  } catch (error) {
    return null;
  }
};

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

export const fetchCarColor = async () => {
  const response = await apiClient.get(endpoints.cars.color());
  return response?.data?.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get(endpoints.cars.categories());
  return response?.data?.data;
};

export const fetchBranch = async () => {
  const response = await apiClient.get(endpoints.cars.branch());
  return response?.data?.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(endpoints.cars.delete(id));
  return response?.data?.data;
};