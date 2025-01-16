import apiClient from "./apiClient";
import endpoints from "./endpoints";

const refreshToken = (refreshToken) => {
  console.log("refreshTokenrefreshToken", refreshToken);

  return apiClient.get(endpoints.auth.refreshToken);
};

const AuthService = {
  refreshToken,
};

export default AuthService;
