import apiClient from "./apiClient";
import endpoints from "./endpoints";

const refreshToken = (token) => {
  return apiClient.post(endpoints.auth.refreshToken, token);
};

const AuthService = {
  refreshToken,
};

export default AuthService;
