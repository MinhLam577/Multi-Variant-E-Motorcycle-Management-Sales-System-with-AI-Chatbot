import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const getAllBrand = (username, password) => {
  return apiClient
    .post(endpoints.auth.login, {
      username,
      password,
    })
    .catch((e) => e);
};
