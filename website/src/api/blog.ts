import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const getListBlog = async (query: string) => {
    const response = await apiClient.get(endpoints.blogs.list(query));
    return response;
};

export const getBlogDetails = async (id: string) => {
    const response = await apiClient.get(endpoints.blogs.details(id));
    return response;
};
