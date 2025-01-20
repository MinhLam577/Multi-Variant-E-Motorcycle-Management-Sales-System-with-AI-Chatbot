import axios from "axios";
import { AccountObservable } from "../stores/account";
import endpoints from "./endpoints";
import { keyStorageAccount } from "../constants";
import secureLocalStorage from "react-secure-storage";

// Flag để tránh nhiều request refresh cùng lúc
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
  return response;
};

const handleError = async (error) => {
  console.log("------Error-----", error);
  const respData = error?.response?.data;
  const respStatus = error?.response ? error?.response.status : -1;
  const originalRequest = error?.config;

  switch (respStatus) {
    case 400:
      console.log("Bad Request");
      return respStatus;
    // handle authentication
    case 403:
    case 401:
      return handleError401(originalRequest, error);

    case 404: {
      return respStatus;
    }

    default:
      break;
  }
  return Promise.reject(respData);
};

const handleError401 = async (originalRequest, error) => {
  if (originalRequest._retry) {
    return;
  }

  if (originalRequest.url.includes(endpoints.auth.refreshToken)) {
    checkLogout();
    return;
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(apiClient(originalRequest));
      });
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const newAccessToken = await refreshToken();
    if (!newAccessToken) return Promise.reject(error);

    apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
    isRefreshing = false;

    return apiClient(originalRequest);
  } catch (err) {
    return Promise.reject(err);
  }
};

const refreshToken = async () => {
  try {
    let { setAccount, getAccount } = new AccountObservable();
    const account = await getAccount();

    // get api
    const { data } = await apiClient.get(endpoints.auth.refreshToken, {
      headers: {
        Authorization: `Bearer ${account?.refresh_token}`,
      },
    });
    console.log("refreshToken", data);

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
    console.log("refreshToken error", e);

    checkLogout();
  }
};

const checkLogout = async () => {
  await secureLocalStorage.removeItem(keyStorageAccount);
  window.location.href = "/login";
};

apiClient.interceptors.response.use(handleSuccess, handleError);

export default apiClient;
