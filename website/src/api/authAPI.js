import apiClient from "./apiClient";
import endpoints from "./endpoints";

const authAPI = {
  login: (username, password) => {
    return apiClient
      .post(endpoints.auth.login, {
        username,
        password,
      })
      .catch((e) => e);
  },
  register: (data) => {
    return apiClient.post(endpoints.auth.register, data);
  },

  checkCode: (data) => {
    return apiClient.post(endpoints.auth.check_code, data);
  },
  // response về id user
  retry_active: (email) => {
    return apiClient.post(endpoints.auth.retry_active, email);
  },
  // retry password
  retry_password: (email) => {
    return apiClient.post(endpoints.auth.retry_password, email);
  },
  // change - password
  change_password: (data) => {
    return apiClient.post(endpoints.auth.change_password, data);
  },
  // sendmail about customer and admin báo giá
  contactPrice: (data) => {
    return apiClient.post(endpoints.auth.contactPrice, data);
  },
};

export default authAPI;
