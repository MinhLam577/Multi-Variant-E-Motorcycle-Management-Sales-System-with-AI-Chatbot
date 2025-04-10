import endpoints from "./endpoints";
import { ResponsePromise } from ".";
import apiClient from "./apiClient";
const productEndpoints = endpoints.product;
const ProductAPI: {
    getListProduct: (query: string) => Promise<ResponsePromise>;
} = {
    getListProduct: async (query: string) =>
        await apiClient.get(productEndpoints.getListProduct(query)),
};

export default ProductAPI;
