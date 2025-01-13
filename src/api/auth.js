import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const loginRequest = async (formData) => {
  try {
    const response = await apiClient.post(endpoints.auth.login, formData);
    if (response?.status === 200) {
      return response.data;
    }
  } catch (error) {
    return error;
  }
};
