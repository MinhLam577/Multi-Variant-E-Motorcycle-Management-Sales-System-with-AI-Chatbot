import { ResponsePromise } from ".";
import apiClient from "./apiClient";
import endpoints from "./endpoints";
const importEndpoint = endpoints.import;

type ImportAPI = {
    getList: (query: string) => Promise<ResponsePromise>;
};

const ImportAPI: ImportAPI = {
    getList: async (query: string) =>
        await apiClient.get(importEndpoint.list(query)),
};

export default ImportAPI;
