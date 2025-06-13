import apiClient from "./apiClient";
import endpoints from "./endpoints";

const blogCategoriesEndPoints = endpoints.blogCategories;

export const getListBlogCategories = async (query: string) => {
    const response = await apiClient.get(blogCategoriesEndPoints.list(query));
    return response;
};
