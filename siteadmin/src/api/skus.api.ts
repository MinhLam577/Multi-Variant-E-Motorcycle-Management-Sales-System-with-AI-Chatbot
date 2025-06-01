import endpoints from "./endpoints";
import apiClient from "./apiClient";
import { ResponsePromise } from ".";
import { CreateSkusDto, UpdateSkusDto } from "src/stores/skus.store";
const skusEndpoints = endpoints.skus;

const SkusAPI: {
    list: (query: string) => Promise<ResponsePromise>;
    create: (data: CreateSkusDto) => Promise<ResponsePromise>;
    update: (id: string, data: UpdateSkusDto) => Promise<ResponsePromise>;
    remove: (id: string) => Promise<ResponsePromise>;
    getDetailImportsById: (id: string) => Promise<ResponsePromise>;
    getDetailImportsByIds: (ids: string[]) => Promise<ResponsePromise>;
} = {
    list: async (query: string) =>
        await apiClient.get(skusEndpoints.list(query)),
    create: async (data: CreateSkusDto) =>
        await apiClient.post(skusEndpoints.create(), JSON.stringify(data)),
    update: async (id: string, data: UpdateSkusDto) =>
        await apiClient.patch(skusEndpoints.update(id), JSON.stringify(data)),
    remove: async (id: string) =>
        await apiClient.delete(skusEndpoints.remove(id)),
    getDetailImportsById: async (id: string) =>
        await apiClient.get(skusEndpoints.getDetailImportsById(id)),
    getDetailImportsByIds: async (ids: string[]) =>
        await apiClient.post(
            skusEndpoints.getDetailImportsByIds(),
            JSON.stringify({ ids })
        ),
};

export default SkusAPI;
