import axios from "axios";
import AuthService from "./authService";
import endpoints from "./endpoints";
import { useContext } from "react";
import { NavigateContext } from "../contexts/global";
import { useStore } from "../stores";
import LoginObservable from "../stores/login";
import { AccountObservable } from "../stores/account";
import secureLocalStorage from "react-secure-storage";
import { keyStorageAccount } from "../constants";

let isRefreshToken = false;
let pendingRequests = [];

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
    if (!config?.url.endsWith(endpoints.auth.refreshToken)) {
      config.headers.Authorization = "Bearer " + account?.access_token;
    }

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
      return handleError401(originalRequest);

    case 404: {
      return respStatus;
    }

    default:
      break;
  }
  return Promise.reject(respData);
};

const handleError401 = (originalRequest) => {
  subscribeTokenRefresh((token) => {
    originalRequest.headers.Authorization = `Bearer ${token}`;
  });

  refreshToken(originalRequest);

  return new Promise((resolve) => {
    subscribeTokenRefresh((token) => {
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(apiClient.request(originalRequest));
      }
    });
  });
};

const subscribeTokenRefresh = (cb) => {
  pendingRequests.push(cb);
};

const onTokenRefreshed = (token) => {
  console.log("onTokenRefreshed", token);
  pendingRequests.forEach((cb) => cb(token));
};

const refreshToken = async () => {
  if (!isRefreshToken) {
    isRefreshToken = true;
    try {
      let account = await new AccountObservable().getAccount();

      const { data } = await apiClient.get(endpoints.auth.refreshToken, {
        headers: {
          Authorization: `Bearer ${account?.refresh_token}`,
        },
      });

      if (data?.access_token) {
        onTokenRefreshed(data?.access_token);
      } else {
        checkLogout();
      }
    } catch (e) {
      checkLogout();
    }
  }
};

const checkLogout = async () => {
  console.log("logout");
  // await secureLocalStorage.removeItem(keyStorageAccount);
  //  window.location.href = "/login";
};

apiClient.interceptors.response.use(handleSuccess, handleError);

export default apiClient;
