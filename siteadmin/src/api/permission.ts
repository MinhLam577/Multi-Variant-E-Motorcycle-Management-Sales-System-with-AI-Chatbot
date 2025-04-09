import { IPermission } from "src/types/backend";
import apiClient from "./apiClient";
import endpoints from "./endpoints";

export interface PermissionResponse {
  data: IPermission[];
  status: number;
  message: string;
}
const Permissons = {
  getListPermissions: async (): Promise<PermissionResponse> => {
    const Response = await apiClient.get<any, PermissionResponse>(
      endpoints.permission.list(",", "")
    );
    return Response;
  },
};
export default Permissons;
