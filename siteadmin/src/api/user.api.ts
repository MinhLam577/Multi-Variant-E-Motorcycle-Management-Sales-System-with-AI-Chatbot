import { UpdateUserDto } from "src/stores/user.store";
import { ResponsePromise } from ".";
import apiClient from "./apiClient";
import endpoints from "./endpoints";
const userEndpoints = endpoints.user;

type UserAPIType = {
    list: (query: string) => Promise<ResponsePromise>;
    getUserDetails: (id: string) => Promise<ResponsePromise>;
    update: (id: string, data: UpdateUserDto) => Promise<ResponsePromise>;
    remove: (id: string) => Promise<ResponsePromise>;
};

const UserAPI: UserAPIType = {
    list: async (query: string) =>
        await apiClient.get(userEndpoints.list(query)),
    remove: async (id: string) =>
        await apiClient.delete(userEndpoints.remove(id)),
    getUserDetails: async (id: string) =>
        await apiClient.get(userEndpoints.details(id)),
    update: async (id: string, data: UpdateUserDto) =>
        await apiClient.patch(userEndpoints.update(id), data),
};
export default UserAPI;
