import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const loginRequest = (formData) => {
  return apiClient
    .post(endpoints.auth.login, {
      formData,
    })
    .catch((e) => e);
};
