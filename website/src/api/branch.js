import apiClient from "./apiClient";
import endpoints from "./endpoints.ts";

export const getListBranch = async ({ pageSize, current }) => {
    const response = await apiClient.get(
        endpoints.branch.list(pageSize, current)
    );
    return response.data;
};

export const getBranchDetails = async (id) => {
    const response = await apiClient.get(endpoints.branch.details(id));
    return response.data;
};

export const createBranch = async (carData) => {
    const response = await apiClient.post(endpoints.branch.create, carData);
    return response.data;
};


export const deleteStore = async (id) => {
    const response = await apiClient.delete(endpoints.branch.delete(id));
    return response?.data?.data;
};

export const updateImage = async (id) => {
    const response = await apiClient.post(endpoints.branch.delete(id));
    return response?.data?.data;
};
