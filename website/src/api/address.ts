import apiClient from "./apiClient";
import endpoints from "./endpoints";
const receive_address = endpoints.receive_address;

export const AddressApi = {
  getListAddress: async (query: string) => {
    return await apiClient.get(receive_address.list())
  },

  getDetailAddress: async (id: string) => {
    return await apiClient.get(receive_address.details(id));
  },

  getListAddressByCustomer: async (customerId: string) => {
    return await apiClient.get(receive_address.listAddressCustomer(customerId));
  },

  createAddress: async (data: any) => {
    return await apiClient.post(receive_address.create(), data);
  },

  updateAddress: async (id: string, data: any) => {
    return await apiClient.put(receive_address.update(id), data);
  },

  deleteAddress: async (id: string) => {
    return await apiClient.delete(receive_address.delete(id));
  },

  setAddressDefault: async (customerId: string, addressId: string) => {
    return await apiClient.patch(
      receive_address.setAddressDefault(customerId),
      {
        addressId,
      }
    );
  },

  getAddressDefault: async (customerId: string) => {
    return await apiClient.get(receive_address.getAddressDefault(customerId));
  },

  uploadImage: async (formData: FormData) => {
    return await apiClient.post(receive_address.upload, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  uploadImages: async (formData: FormData) => {
    return await apiClient.post(receive_address.uploads, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
