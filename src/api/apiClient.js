import axios from "axios";
import { transform } from "lodash";
import { Router } from "react-router-dom";

let isRefreshToken = false;
let pendingRequests = [];

const apiClient = axios.create({
  baseURL: "http://13.212.181.1:8080/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
apiClient.interceptors.request.use(
  async (config) => {
    // let account = await new accountStore().getAccount();
    const headers = config.headers || {};
    // let authorization = headers.Authorization;
    // if (_.isEmpty(authorization)) {
    //   config.headers.Authorization = `Basic ${Base64.encode(BASIC_AUTH)}`;
    //   if (account?.accessToken != null) {

    //     config.headers.Authorization = 'Bearer ' + account?.accessToken;
    //   }
    //   // has login
    // }
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
  const respData = transform(error?.response.data ?? {});
  const respStatus = error?.response ? error?.response.status : -1;
  const originalRequest = error?.config;

  if (originalRequest?.url.endsWith("oauth/refresh-token")) {
    return handleRefresh401(respData);
  }

  console.log("respStatusrespStatus", error?.response?.data);
  switch (respStatus) {
    case 301:
      console.log("Request Moved Permanently");
      break;
    case 400:
      console.log("Bad Request");
      return respStatus;
    case 401:
      return handleError401(originalRequest);
    case 403:
      return respStatus;
    case 404:
      console.log("Not Found");
      return Router.push("/404");
    case 409:
      return respStatus;
    case 500:
      return respStatus;
    default:
      break;
  }
  return Promise.reject(error?.response?.data);
};

const handleError401 = (originalRequest) => {
  subscribeTokenRefresh((token) => {
    originalRequest.header.Authorization = `Bearer ${token}`;
  });
  refreshToken(originalRequest);
  return new Promise((resolve, reject) => {
    subscribeTokenRefresh((token) => {
      originalRequest.header.Authorization = `Bearer ${token}`;
      resolve(apiClient.request(originalRequest));
    });
  });
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
    // let account = await new accountStore().getAccount();
    // const { data } = await AuthService.refreshToken({
    //   token: account?.accessToken || '',
    // });
    // if (data?.accessToken && data?.refreshToken) {
    //   onTokenRefreshed(data.accessToken);
    // } else {
    //   // checkLogout();
    // }
  } catch (e) {
    // checkLogout();
  }
  isRefreshToken = false;
};

apiClient.interceptors.response.use(handleSuccess, handleError);

export default apiClient;
