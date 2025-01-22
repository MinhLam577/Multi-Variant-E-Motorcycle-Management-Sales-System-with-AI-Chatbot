import apiClient from "./apiClient";
import endpoints from "./endpoints";

const BaseAPI = {
  login: (username, password) => {
    return apiClient
      .post(endpoints.auth.login, {
        username,
        password,
      })
      .catch((e) => e);
  },
};

export default BaseAPI;
