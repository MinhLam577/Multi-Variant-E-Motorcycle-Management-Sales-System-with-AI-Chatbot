import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://13.212.181.1:8080/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xử lý token hết hạn
      console.error("Unauthorized! Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
