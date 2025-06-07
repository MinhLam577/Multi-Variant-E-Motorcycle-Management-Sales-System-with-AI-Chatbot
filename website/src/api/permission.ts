import apiClient from "./apiClient";
import endpoints from "./endpoints";
export interface IPermission {
    id?: string;
    name?: string;
    // path
    path?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IRole {
    id?: string;
    name: string;
    description: string;
    permissions: IPermission[] | string[];
    isActive: boolean;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

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
