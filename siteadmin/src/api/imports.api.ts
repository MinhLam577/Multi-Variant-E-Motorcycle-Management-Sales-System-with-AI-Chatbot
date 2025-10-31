import { ResponsePromise } from ".";
import apiClient from "./apiClient";
import endpoints from "./endpoints";
import { CreateImportDto } from "src/types/import.type";
import { UpdateImportDto } from "src/types/product.type";
const importEndpoint = endpoints.import;

type ImportAPI = {
    getList: (query: string) => Promise<ResponsePromise>;
    createImport: (data: CreateImportDto) => Promise<ResponsePromise>;
    updateImport: (
        id: string,
        data: UpdateImportDto
    ) => Promise<ResponsePromise>;
    details: (id: string) => Promise<ResponsePromise>;
    deleteImport: (id: string) => Promise<ResponsePromise>;
};

const ImportAPI: ImportAPI = {
    getList: async (query: string) =>
        await apiClient.get(importEndpoint.list(query)),
    createImport: async (data: CreateImportDto) =>
        await apiClient.post(importEndpoint.create(), JSON.stringify(data)),
    details: async (id: string) =>
        await apiClient.get(importEndpoint.detail(id)),
    updateImport: async (id: string, data: UpdateImportDto) =>
        await apiClient.patch(importEndpoint.update(id), JSON.stringify(data)),
    deleteImport: async (id: string) =>
        await apiClient.delete(importEndpoint.delete(id)),
};

export default ImportAPI;
