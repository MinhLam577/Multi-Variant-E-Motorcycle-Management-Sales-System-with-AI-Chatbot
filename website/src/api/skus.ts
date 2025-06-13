import endpoints from "./endpoints";
import apiClient from "./apiClient";
import { ResponsePromise } from "./order";
const skusEndpoints = endpoints.sku;

const SkusAPI: {
  getDetailImportsById: (id: string) => Promise<ResponsePromise>;
  getDetailImportsByIds: (ids: string[]) => Promise<ResponsePromise>;
  GetSkusByOptionValueIds: (optionValues) => Promise<ResponsePromise>;
} = {
  getDetailImportsById: async (id: string) =>
    await apiClient.get(skusEndpoints.getDetailImportsById(id)),
  getDetailImportsByIds: async (ids: string[]) =>
    await apiClient.post(
      skusEndpoints.getDetailImportsByIds(),
      JSON.stringify({ ids })
    ),
  GetSkusByOptionValueIds: async (optionValuesPayload) =>
    await apiClient.post(
      skusEndpoints.GetSkusByOptionValueIds(),
      optionValuesPayload // <== đảm bảo là: { optionValues: [...] }
    ),
};

export default SkusAPI;
