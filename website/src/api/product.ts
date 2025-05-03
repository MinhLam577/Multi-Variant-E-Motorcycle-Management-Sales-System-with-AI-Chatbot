import endpoints from "./endpoints";
import apiClient from "./apiClient";
import { ResponsePromise } from "./order";
const productEndpoints = endpoints.product;
const ProductAPI: {
  getListProduct: (query: string) => Promise<ResponsePromise>;
  getDetailProduct: (query: string) => Promise<ResponsePromise>;
} = {
  getListProduct: async (query: string) => {
    return await apiClient.get(productEndpoints.getListProduct(query));
  },
  getDetailProduct: async (id) => {
    return await apiClient.get(productEndpoints.getDetailProduct(id));
  },
};

export default ProductAPI;
