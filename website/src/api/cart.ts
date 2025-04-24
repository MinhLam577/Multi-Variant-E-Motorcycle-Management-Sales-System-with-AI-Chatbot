import apiClient from "./apiClient";
import endpoints from "./endpoints";

const Permissons = {
  getListPermissions: async () => {
    const Response = await apiClient.get(endpoints.permission.list(",", ""));
    return Response;
  },
};
export default Permissons;
