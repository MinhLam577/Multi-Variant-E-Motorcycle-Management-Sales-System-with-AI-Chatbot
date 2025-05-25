import endpoints from "./endpoints";
import apiClient from "./apiClient";
import { ResponsePromise } from ".";
const categoriesEndpoints = endpoints.categories;

type CategoryAPIType = {
    list: (query: string) => Promise<ResponsePromise>;
    create: (data: any) => Promise<ResponsePromise>;
    update: (id: string, data: any) => Promise<ResponsePromise>;
    detail: (id: string) => Promise<ResponsePromise>;
    remove: (id: string) => Promise<ResponsePromise>;
};

const CategoriesAPI: CategoryAPIType = {
    list: async (query: string) =>
        await apiClient.get(categoriesEndpoints.list(query)),
    detail: async (id: string) =>
        await apiClient.get(categoriesEndpoints.detail(id)),
    create: async (data: any) =>
        await apiClient.post(categoriesEndpoints.create(), data),
    update: async (id: string, data: any) =>
        await apiClient.patch(categoriesEndpoints.update(id), data),
    remove: async (id: string) =>
        await apiClient.delete(categoriesEndpoints.remove(id)),
};
export default CategoriesAPI;
