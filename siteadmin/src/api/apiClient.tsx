import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import { keyStorageAccount } from "../constants";
import { AccountObservable } from "../stores/account.store";
import endpoints from "./endpoints";
let isRefreshing = false;
let refreshSubscribers = [];

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        let account = await new AccountObservable().getAccount();

        config.headers.Authorization = "Bearer " + account?.access_token;

        return { ...config };
    },
    (err) => {
        return Promise.reject(err);
    }
);

const handleSuccess = async (response) => {
    return response.data;
};

const handleError = async (error) => {
    const respData = error?.response?.data;
    const respStatus = error?.response ? error?.response.status : -1;
    const originalRequest = error?.config;
    if (!error.response && error.code === "ERR_NETWORK") {
        console.error(
            "Connection refused: Server is not responding at",
            error?.config?.url
        );
        const currentUrl = window.location.href;
        localStorage.setItem("lastUrl", currentUrl);
        return Promise.reject({
            message:
                "Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối hoặc thử lại sau.",
            code: "ERR_NETWORK",
        });
    }
    switch (respStatus) {
        case 400:
            return respData;
        case 403:
        case 401:
            return handleError401(originalRequest, error);
        case 404: {
            return respData;
        }

        default:
            break;
    }
    return Promise.reject(respData);
};

const handleError401 = async (originalRequest, error) => {
    const respData = error?.response?.data;
    checkLogout();
    return Promise.reject(respData);
    // if (originalRequest._retry) {
    //     return;
    // }

    // if (originalRequest.url.includes(endpoints.authAdmin.refreshToken)) {
    //     checkLogout();
    //     return;
    // }

    // if (isRefreshing) {
    //     return new Promise((resolve) => {
    //         refreshSubscribers.push((token) => {
    //             originalRequest.headers.Authorization = `Bearer ${token}`;
    //             resolve(apiClient(originalRequest));
    //         });
    //     });
    // }

    // originalRequest._retry = true;
    // isRefreshing = true;

    // try {
    //     const newAccessToken = await refreshToken();
    //     if (!newAccessToken) return Promise.reject(error);

    //     apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
    //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    //     refreshSubscribers.forEach((callback) => callback(newAccessToken));
    //     refreshSubscribers = [];
    //     isRefreshing = false;

    //     return apiClient(originalRequest);
    // } catch (err) {
    //     return Promise.reject(err);
    // }
};

const refreshToken = async () => {
    try {
        let { setAccount, getAccount } = new AccountObservable();
        const account = await getAccount();

        // get api
        const { data } = await apiClient.get(endpoints.authAdmin.refreshToken, {
            headers: {
                Authorization: `Bearer ${account?.refresh_token}`,
            },
        });

        const newAccessToken = data?.access_token;
        // Kiểm tra nếu token không tồn tại thì sẽ chuyển về màn hình login
        if (!newAccessToken) {
            checkLogout();
            return;
        }
        // lưu access token mới vào local storage
        const updateNewToken = { ...account, access_token: newAccessToken };

        await setAccount(updateNewToken);
        return newAccessToken;
    } catch (e) {
        checkLogout();
    }
};

const checkLogout = async () => {
    await secureLocalStorage.removeItem(keyStorageAccount);
};

apiClient.interceptors.response.use(handleSuccess, handleError);

export default apiClient;
