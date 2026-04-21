import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import secureLocalStorage from "react-secure-storage";
import { keyStorageAccount } from "../constants/index";
import { jwtDecode } from "jwt-decode";
import endpoints from "./endpoints";
import { JwtPayload } from "@/types/jwt.type";
import { BACKEND_BASE } from "../config/api.config";
import { Base64 } from "js-base64";
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

// lấy account từ storage
const getStoredAccount = () => {
    try {
        const dataEncoded =
            secureLocalStorage.getItem(keyStorageAccount) ||
            sessionStorage.getItem(keyStorageAccount);

        if (!dataEncoded) return null;

        const decoded = Base64.decode(String(dataEncoded));
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Parse account error:", e);
        return null;
    }
};

const isTokenExpired = (token: string) => {
    try {
        const decoded: JwtPayload = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp && decoded.exp < currentTime + 30; // còn < 30s coi như sắp hết hạn
    } catch {
        return true;
    }
};

const apiClient = axios.create({
    baseURL: BACKEND_BASE,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});
apiClient.interceptors.request.use(
    (config) => {
        if (
            config.url?.includes(endpoints.auth.login) ||
            config.url?.includes(endpoints.auth.register) ||
            config.url?.includes(endpoints.auth.forgotPassword)
        ) {
            return config;
        }

        const account = getStoredAccount();

        if (account?.access_token) {
            config.headers.Authorization = `Bearer ${account.access_token}`;
        }

        return config;
    },
    (err) => Promise.reject(err)
);

const handleSuccess = async <T>(response: AxiosResponse<T>): Promise<T> => {
    return response.data;
};

const handleError = async (error: AxiosError<any>): Promise<any> => {
    const respData = error.response?.data;
    const respStatus = error.response?.status ?? -1;
    const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
    };

    switch (respStatus) {
        case 400:
            return Promise.reject(respData);
        case 401:
        case 403:
            return handleError401(originalRequest, error);
        case 404:
            return Promise.reject(respData);
        default:
            return Promise.reject(respData || error);
    }
};

const handleError401 = async (originalRequest: any, error: AxiosError) => {
    if (
        originalRequest._retry ||
        originalRequest.url?.includes(endpoints.auth.refreshToken)
    ) {
        return Promise.reject(error);
    }

    if (isRefreshing) {
        return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                resolve(apiClient(originalRequest));
            });
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
        const newToken = await refreshToken();

        if (!newToken) {
            return Promise.reject(error);
        }

        onRefreshed(newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return apiClient(originalRequest);
    } catch (err) {
        return Promise.reject(err);
    } finally {
        isRefreshing = false;
    }
};

const refreshToken = async () => {
    try {
        const account = getStoredAccount();

        if (!account?.refresh_token) {
            checkLogout();
            return null;
        }

        const { data } = await axios.get(
            `${BACKEND_BASE}${endpoints.auth.refreshToken}`,
            {
                headers: {
                    Authorization: `Bearer ${account.refresh_token}`,
                },
            }
        );

        const newAccessToken = data?.access_token;

        if (!newAccessToken) {
            checkLogout();
            return null;
        }

        // update storage
        const updatedAccount = {
            ...account,
            access_token: newAccessToken,
        };

        const encoded = Base64.encode(JSON.stringify(updatedAccount));

        if (secureLocalStorage.getItem(keyStorageAccount)) {
            secureLocalStorage.setItem(keyStorageAccount, encoded);
        } else {
            sessionStorage.setItem(keyStorageAccount, encoded);
        }

        return newAccessToken;
    } catch (e) {
        console.error("Refresh token error:", e);
        checkLogout();
        return null;
    }
};
apiClient.interceptors.response.use(handleSuccess, handleError);
const checkLogout = () => {
    secureLocalStorage.removeItem(keyStorageAccount);
    sessionStorage.removeItem(keyStorageAccount);
    if (window.location.pathname !== "/login") window.location.href = "/login";
};

export default apiClient;
