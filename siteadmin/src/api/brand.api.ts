import endpoints from "./endpoints";
import apiClient from "./apiClient";
import { ResponsePromise } from ".";
import { CreateBrandDto, UpdateBrandDto } from "src/types/brand.type";
const brandEndpoints = endpoints.brand;

type BrandAPIType = {
    list: (query: string) => Promise<ResponsePromise>;
    create: (data: CreateBrandDto) => Promise<ResponsePromise>;
    update: (id: string, data: UpdateBrandDto) => Promise<ResponsePromise>;
    delete: (id: string) => Promise<ResponsePromise>;
};

const BrandAPI: BrandAPIType = {
    list: async (query: string) => {
        return await apiClient.get(brandEndpoints.list(query));
    },
    create: async (data: any) => {
        return await apiClient.post(brandEndpoints.create(), data);
    },
    update: async (id: string, data: UpdateBrandDto) => {
        return await apiClient.patch(brandEndpoints.update(id), data);
    },
    delete: async (id: string) => {
        return await apiClient.delete(brandEndpoints.delete(id));
    },
};

export default BrandAPI;
