import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
// import { useSession } from 'next-auth/react';
import { tokenUtils } from "./utils";
// import { tokenUtils } from './utils';

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Đặt URL backend của bạn
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    async (config: any) => {
        const isPublic = config.isPublic || false;

        if (!isPublic) {
            const token = tokenUtils.getAccessToken();
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }

        // On the server, try to get the token from cookies passed in the request headers
        if (config && config?.headers && config.headers?.cookie) {
            // const cookies = cookie.parse(config.headers.cookie);
            // config.headers["Authorization"] = cookies[AUTH_STORAGE_KEYS.ACCESS_TOKEN] || null;
        }
        // config.headers["Authorization"] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIwZDBlMTZiLWI2M2ItNDBmMC1iY2FkLWNlMjgwNjk0MDRjNiIsInVzZXJuYW1lIjpudWxsLCJyb2xlIjoidXNlciIsIndhbGxldEFkZHJlc3MiOiIweDk0NmEwQTYyZTE4NmExMjI5OGZENENiYjIzNUVGZTc3MDMzM2YxQzQiLCJpYXQiOjE3NDEwMTk4MjMsImV4cCI6MTc0MTYyNDYyM30.c7pcHMFZARJCBQyMZ3UWzKk1TS6uj7S3Kn2ynONiUFc`;

        if (config.data instanceof FormData) {
            config.headers["Content-Type"] = "multipart/form-data";
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data?.message === "Invalid access token" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            // const refreshToken = tokenUtils.getRefreshToken();
            console.log("Refreshing access token...");

            try {
                // const response = await axiosInstance.get(
                //   "auth/refresh/",
                //   {
                //     headers: {
                //       Authorization: `Bearer ${refreshToken}`,
                //     },
                //   },
                // );

                // const newAccessToken = response.data?.access_token;
                // tokenUtils.setAccessToken(newAccessToken);

                // originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (error: any) {
                console.error(
                    "Refresh Token Error:",
                    error.response?.data?.message
                );
            }
        }

        console.error("Response Error:", error);
        return Promise.reject(error);
    }
);

export const axiosMutator = <T = any>(
    config: AxiosRequestConfig,
    options?: { baseURL?: string }
): Promise<T> => {
    let newConfig = { ...config };

    // Override baseURL if provided
    if (options?.baseURL) {
        newConfig.baseURL = options.baseURL;
    }

    // Ensure `/api/v1` is removed from the request URL if it's already included in baseURL
    if (newConfig.url?.startsWith("/api/v1")) {
        newConfig.url = newConfig.url.replace(/^\/api\/v1/, "");
    }

    return axiosInstance(newConfig);
};
