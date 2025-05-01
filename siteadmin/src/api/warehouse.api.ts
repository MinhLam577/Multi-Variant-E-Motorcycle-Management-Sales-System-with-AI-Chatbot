import apiClient from "./apiClient";
import endpoints from "./endpoints";
const warehouseEndPoint = endpoints.warehouse;

const WarehouseAPI = {
  getAllWarehouses: async () => await apiClient.get(warehouseEndPoint.list()),
  getWarehouseById: async (id) => {
    const response = await apiClient.get(warehouseEndPoint.details(id));
    return response.data;
  },
}

export default WarehouseAPI;