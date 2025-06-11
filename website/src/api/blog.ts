import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const getListBlog = async (current: number, pageSize: number) => {
    const queryString = `current=${current}&pageSize=${pageSize}`;
    const response = await apiClient.get(endpoints.blogs.list(queryString));
    return response;
};

export const getBlogDetails = async (id) => {
    const response = await apiClient.get(endpoints.blogs.details(id));
    return response;
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
