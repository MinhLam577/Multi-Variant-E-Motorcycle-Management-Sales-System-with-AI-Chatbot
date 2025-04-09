import { IPermission, IRole } from "src/types/backend";
import apiClient from "./apiClient";
import endpoints from "./endpoints";

export interface RoleResponse {
  data: IRole[];
  status: number;
  message: string;
}

export interface PermissionResponse {
  data: IPermission[];
  status: number;
  message: string;
}

//// role
const RoleApi = {
  getList: async (): Promise<RoleResponse> => {
    const Response = await apiClient.get<any, RoleResponse>(
      endpoints.role.list()
    );
    return Response;
  },
  create: async (data: any): Promise<RoleResponse> => {
    const Response = await apiClient.post<any, RoleResponse>(
      endpoints.role.create(),
      data
    );
    return Response;
  },
  update: async (id: string, body) => {
    const Response = await apiClient.put<any, RoleResponse>(
      endpoints.role.update(id),
      body
    );
    return Response;
  },
  delete: async (id: string) => {
    const Response = await apiClient.delete(endpoints.role.delete(id));
    return Response;
  },
  getById: async (id: string): Promise<RoleResponse> => {
    const Response = await apiClient.get<any, RoleResponse>(
      endpoints.role.details(id)
    );
    return Response;
  },

  // permissions
  getListPermissions: async (): Promise<PermissionResponse> => {
    const Response = await apiClient.get<any, PermissionResponse>(
      endpoints.permission.list(",", "")
    );
    return Response;
  },
};
export default RoleApi;
