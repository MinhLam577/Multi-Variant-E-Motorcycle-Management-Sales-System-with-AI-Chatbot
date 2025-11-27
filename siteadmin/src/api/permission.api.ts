import { IPermission } from "@/types/backend";
import apiClient from "./apiClient";
import endpoints from "./endpoints";

export interface PermissionResponse {
    data: IPermission[];
    status: number;
    message: string;
}
const PermissionAPI = {
    getListPermissions: async (query: string): Promise<PermissionResponse> => {
        const Response = await apiClient.get<any, PermissionResponse>(
            endpoints.permission.list(query)
        );
        return Response;
    },
};
export default PermissionAPI;
