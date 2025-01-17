import apiClient from "./apiClient";
import endpoints from "./endpoints";
import { getAllBrand } from "./brand";

const BaseAPI = {
  login: (username, password) => {
    return apiClient
      .post(endpoints.auth.login, {
        username,
        password,
      })
      .catch((e) => e);
  },
  getAllBrand,
};

export default BaseAPI;
