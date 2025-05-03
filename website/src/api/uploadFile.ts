import apiClient from "./apiClient";
import endpoints from "./endpoints";

const UploadPictureApi = {
  create: async (image: any) => {
    const formData = new FormData();
    formData.append("image", image);
    const Response = await apiClient.post(endpoints.blogs.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return Response;
  },
  createImageCustomer: async (image: any) => {
    const formData = new FormData();
    formData.append("file", image);
    const Response = await apiClient.post(
      endpoints.customers.uploadAvatar,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return Response;
  },
};
export default UploadPictureApi;
