import { ApiResponse } from "@/types/api-response.type";
import apiClient from "./apiClient";
import endpoints from "./endpoints";
import { RetryActiveResponse } from "@/types/auth-response.type";

const authAPI = {
    login: (username, password) => {
        return apiClient
            .post(endpoints.auth.login, {
                username,
                password,
            })
            .catch((e) => e);
    },
    register: (data) => {
        return apiClient.post(endpoints.auth.register, data);
    },

    checkCode: (data) => {
        return apiClient.post<null>(endpoints.auth.check_code, data);
    },
    // response về id user
    retry_active: (email: string) => {
        return apiClient.post<RetryActiveResponse>(
            endpoints.auth.retry_active,
            JSON.stringify({ email })
        );
    },
    // retry password
    retry_password: (email: string) => {
        return apiClient.post(
            endpoints.auth.retry_password,
            JSON.stringify({ email })
        );
    },
    // change - password
    change_password: (data) => {
        return apiClient.post(endpoints.auth.change_password, data);
    },
    // sendmail about customer and admin báo giá
    contactPrice: (data) => {
        return apiClient.post(endpoints.auth.contactPrice, data);
    },

    forgotPassword: (email: string) => {
        return apiClient.post(
            endpoints.auth.forgotPassword,
            JSON.stringify({ email })
        );
    },
};

export default authAPI;
