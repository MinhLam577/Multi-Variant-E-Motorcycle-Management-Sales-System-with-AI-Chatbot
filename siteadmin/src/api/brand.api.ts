import endpoints from "./endpoints";
import apiClient from "./apiClient";
import { ResponsePromise } from ".";
const brandEndpoints = endpoints.brand;

type BrandAPIType = {
    list: (query: string) => Promise<ResponsePromise>;
};

const BrandAPI: BrandAPIType = {
    list: async (query: string) => {
        return await apiClient.get(brandEndpoints.list(query));
    },
};

export default BrandAPI;
