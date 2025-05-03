import apiClient from "./apiClient";
import endpoints from "./endpoints";

const optionsEndPoint = endpoints.options;

const OptionsAPI = {
  getAllOptions: async () => await apiClient.get(optionsEndPoint.list()),
};

export default OptionsAPI;