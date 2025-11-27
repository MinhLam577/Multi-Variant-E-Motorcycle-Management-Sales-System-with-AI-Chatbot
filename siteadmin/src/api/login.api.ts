import { ApiResponse } from "@/types/api-response.type";
import apiClient from "./apiClient";
import endpoints from "./endpoints";
import {
    LoginResponse,
    RegisterDto,
    VerifyCodeDto,
} from "@/types/userLogin.type";
import { AxiosResponse } from "axios";
import { ResetPassword, VerifyResetPassword } from "@/types/auth-validate.type";
const loginEndpoints = endpoints.authAdmin;

const LoginAPI = {
    login: async (
        email: string,
        password: string
    ): Promise<AxiosResponse<ApiResponse<LoginResponse>, any>> => {
        try {
            const response = await apiClient.post<ApiResponse<LoginResponse>>(
                loginEndpoints.login,
                {
                    email,
                    password,
                }
            );
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    },
    register: async (data: RegisterDto) => {
        try {
            const response = await apiClient.post(
                loginEndpoints.register,
                JSON.stringify(data)
            );
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    },
    getAccount: async (email: string) => {
        try {
            const response = await apiClient.post(loginEndpoints.getAccount, {
                email,
            });

            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    },
    forgotPassword: async (email: string) => {
        try {
            const response = await apiClient.post(
                loginEndpoints.forgotPassword,
                {
                    email,
                }
            );
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    },

    verifyResetPassword: async (data: VerifyResetPassword) => {
        try {
            const response = apiClient.post(
                loginEndpoints.verifyResetPassword,
                data
            );
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error);
        }
    },
    resetPassword: async (data: ResetPassword) => {
        try {
            const response = await apiClient.post(
                loginEndpoints.resetPassword,
                data
            );
            return Promise.resolve(response);
        } catch (e) {
            return Promise.reject(e);
        }
    },
    verifyCode: async (data: VerifyCodeDto) => {
        try {
            const response = await apiClient.post(
                loginEndpoints.verifyActiveCode,
                JSON.stringify(data)
            );
            return Promise.resolve(response);
        } catch (e) {
            return Promise.reject(e);
        }
    },
    retryAccount: async (email: string) => {
        try {
            const response = await apiClient.post(
                loginEndpoints.retryAccount,
                JSON.stringify({ email })
            );
            return Promise.resolve(response);
        } catch (e) {
            return Promise.reject(e);
        }
    },
};

export default LoginAPI;
