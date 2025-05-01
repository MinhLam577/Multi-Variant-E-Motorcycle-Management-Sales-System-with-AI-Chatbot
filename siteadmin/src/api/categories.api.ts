import endpoints from "./endpoints";
import apiClient from "./apiClient";
import { ResponsePromise } from ".";
const categoriesEndpoints = endpoints.categories;

type CategoryAPIType = {
    list: () => Promise<ResponsePromise>;
};

const CategoriesAPI: CategoryAPIType = {
    list: async () => await apiClient.get(categoriesEndpoints.list),
};
export default CategoriesAPI;
