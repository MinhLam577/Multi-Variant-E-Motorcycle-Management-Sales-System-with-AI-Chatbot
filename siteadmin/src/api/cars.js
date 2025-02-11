import apiClient from "./apiClient";
import endpoints from "./endpoints";

export const getAll = async () => {
  try {
    const [brands, colors, categories] = await Promise.all([
      fetchCarColor(),
      fetchCategories(),
      fetchBrand(),
    ]);

    return {
      brands,
      colors,
      categories,
    };
  } catch (error) {
    return null;
  }
};

export const getCars = async ({ page, size }) => {
  try {
    const response = await apiClient.get(endpoints.cars.list(page, size));
    console.log("getCars-response", response);
    if (response?.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log("getCars-error", error);
    return error;
  }
};

export const getCarDetails = async (id) => {
  const response = await apiClient.get(endpoints.cars.details(id));
  return response.data;
};

export const createCar = async (carData) => {
  try {
    const response = await apiClient.post(endpoints.cars.create, carData);
    return response;
  } catch (error) {
    if (error.response.status === 400) {
      return error.message;
    }
    return error;
  }
};

export const updateCar = async (carData) => {
  try {
    const response = await apiClient.patch(endpoints.cars.update(carData.id), {
      status: carData.status,
    });
    return response;
  } catch (error) {
    if (error.response.status === 400) {
      return error.message;
    }
    return error;
  }
};

export const fetchCarColor = async () => {
  const response = await apiClient.get(endpoints.cars.color());
  return response?.data?.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get(endpoints.cars.categories());
  console.log("fetchCategories", response?.data?.data);

  return response?.data?.data;
};

export const fetchBrand = async () => {
  const response = await apiClient.get(endpoints.cars.brand());

  console.log("fetchBrand", response?.data?.data);
  return response?.data?.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(endpoints.cars.delete(id));
  return response?.data?.data;
};

export const uploadProductImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(
      endpoints.cars.uploadImage(),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
