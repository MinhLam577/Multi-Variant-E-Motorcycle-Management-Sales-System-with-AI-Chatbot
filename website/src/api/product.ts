import endpoints from "./endpoints";
import apiClient from "./apiClient";
import { ResponsePromise } from "./order";
import { EnumProductStore } from "../stores/product.store";
const productEndpoints = endpoints.product;
const ProductAPI: {
  getListProduct: (query: string) => Promise<ResponsePromise>;
  getDetailProduct: (query: string) => Promise<ResponsePromise>;
  getDetailSKU: (query: string) => Promise<ResponsePromise>;
  getBestSellingProducts: (type: EnumProductStore) => Promise<ResponsePromise>;
  getDetailProduct_getOptionValue: (query: string) => Promise<ResponsePromise>;
} = {
  getListProduct: async (query: string) => {
    return await apiClient.get(productEndpoints.getListProduct(query));
  },
  getDetailProduct: async (id) => {
    return await apiClient.get(productEndpoints.getDetailProduct(id));
  },
  getDetailSKU: async (id) => {
    return await apiClient.get(productEndpoints.getDetailSKU(id));
  },
  getBestSellingProducts: async (
    type: EnumProductStore
  ): Promise<ResponsePromise> => {
    const query = `type=${type}`;
    return await apiClient.get(productEndpoints.getBestSellingProducts(query));
  },
  getDetailProduct_getOptionValue: async (id) => {
    return await apiClient.get(productEndpoints.getDetailProduct_user_page_id(id));
  },
};

export default ProductAPI;
