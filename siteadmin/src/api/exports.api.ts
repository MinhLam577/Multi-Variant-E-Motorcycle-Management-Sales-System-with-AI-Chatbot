import { CreateImportDto } from "src/stores/imports.store";
import { ResponsePromise } from ".";
import apiClient from "./apiClient";
import endpoints from "./endpoints";
import { UpdateImportDto } from "src/stores/product.store";
import { CreateExportDto, UpdateExportDto } from "src/stores/exports.store";
const exportEndpoint = endpoints.export;

type ExportAPI = {
    getList: (query: string) => Promise<ResponsePromise>;
    createExport: (data: CreateExportDto) => Promise<ResponsePromise>;
    updateExport: (
        id: string,
        data: UpdateExportDto
    ) => Promise<ResponsePromise>;
    deleteExport: (id: string) => Promise<ResponsePromise>;
};

const ExportAPI: ExportAPI = {
    getList: async (query: string) =>
        await apiClient.get(exportEndpoint.list(query)),
    createExport: async (data: CreateExportDto) =>
        await apiClient.post(exportEndpoint.create(), JSON.stringify(data)),
    updateExport: async (id: string, data: UpdateExportDto) =>
        await apiClient.patch(exportEndpoint.update(id), JSON.stringify(data)),
    deleteExport: async (id: string) =>
        await apiClient.delete(exportEndpoint.delete(id)),
};

export default ExportAPI;
