import endpoints from "./endpoints";
import apiClient from "./apiClient";
import { ResponsePromise } from ".";
const deliveryMethodEndPoint = endpoints.deliveryMethod;

type BrandAPIType = {
    list: (query: string) => Promise<ResponsePromise>;
};

const BrandAPI: BrandAPIType = {
    list: async (query: string) => {
        return await apiClient.get(deliveryMethodEndPoint.list(query));
    },
};

export default BrandAPI;
