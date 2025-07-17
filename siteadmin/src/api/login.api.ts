import apiClient from "./apiClient";
import endpoints from "./endpoints";
const loginEndpoints = endpoints.authAdmin;

const LoginAPI = {
    login: async (email: string, password: string) => {
        try {
            const response = await apiClient.post(loginEndpoints.login, {
                email,
                password,
            });
            return Promise.resolve(response);
        } catch (error) {
            return Promise.reject(error); // Trả về error.response nếu có
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
};

export default LoginAPI;
