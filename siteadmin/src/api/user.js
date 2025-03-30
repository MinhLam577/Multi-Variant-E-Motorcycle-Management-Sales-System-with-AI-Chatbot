import apiClient from "./apiClient";
import endpoints from "./endpoints.ts";

export const getListUser = async ({ page, size }) => {
    const response = await apiClient.get(endpoints.user.list(page, size));
    return response.data;
};

export const getUserDetails = async (id) => {
    const response = await apiClient.get(endpoints.user.details(id));
    return response.data;
};

export const createUser = async (carData) => {
    const response = await apiClient.post(endpoints.user.create, carData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await apiClient.delete(endpoints.user.delete(id));
    return response?.data?.data;
};

export const updateImage = async (id) => {
    const response = await apiClient.post(endpoints.user.delete(id));
    return response?.data?.data;
};
