import axios from "axios";
import { default as Account, default as AccountStore } from "../stores/account";
import AuthService from "./authService";
import endpoints from "./endpoints";

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
    let account = await new Account().getAccount();
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

const handleRefresh401 = async (data) => {
  pendingRequests = [];

  return null;
};

const handleError = async (error) => {
  const respData = error?.response?.data;
  const respStatus = error?.response ? error?.response.status : -1;
  const originalRequest = error?.config;

  if (originalRequest?.url.endsWith(endpoints.auth.refreshToken)) {
    return handleRefresh401(respData);
  }
  switch (respStatus) {
    // case 301:
    //   console.log("Request Moved Permanently");
    //   break;
    case 400:
      console.log("Bad Request");
      return respStatus;
    case 401:
      return handleError401(originalRequest, respData);
    // case 403:
    //   return respStatus;
    case 404: {
      return respStatus;
    }
    // case 409:
    //   return respStatus;
    // case 500:
    //   return respStatus;
    default:
      break;
  }
  return Promise.reject(respData);
};

const handleError401 = (originalRequest, respData) => {
  // Trường hợp login failed
  if (originalRequest?.url.endsWith("auth/login")) {
    return Promise.reject(respData);
  }
  // Xử lý refresh token
};

const subscribeTokenRefresh = (cb) => {
  pendingRequests.push(cb);
};

const onTokenRefreshed = (token) => {
  pendingRequests.forEach((cb) => cb(token));
};

const refreshToken = async (originalRequest) => {
  isRefreshToken = true;
  try {
    let account = await new AccountStore().getAccount();
    const { data } = await AuthService.refreshToken({
      token: account?.accessToken || "",
    });
    if (data?.accessToken && data?.refreshToken) {
      onTokenRefreshed(data.accessToken);
    } else {
      // checkLogout();
    }
  } catch (e) {
    // checkLogout();
  }
  isRefreshToken = false;
};

apiClient.interceptors.response.use(handleSuccess, handleError);

export default apiClient;
