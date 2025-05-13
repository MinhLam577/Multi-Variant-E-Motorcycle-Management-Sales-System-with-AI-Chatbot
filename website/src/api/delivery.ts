import apiClient from "./apiClient";
import endpoints from "./endpoints";
const delivery = endpoints.delivery;

export const DeliveryApi = {
  // Tạo phương thức giao hàng mới
  createDeliveryMethod: async (data: any) => {
    return await apiClient.post(delivery.create(), data);
  },

  // Lấy danh sách tất cả phương thức giao hàng
  getListDeliveryMethods: async () => {
    return await apiClient.get(delivery.list());
  },

  // Lấy chi tiết phương thức giao hàng theo ID
  getDetailDeliveryMethod: async (id: string | number) => {
    return await apiClient.get(delivery.details(id));
  },

  // Cập nhật phương thức giao hàng theo ID
  updateDeliveryMethod: async (id: string | number, data: any) => {
    return await apiClient.put(delivery.update(id), data);
  },

  // Xóa phương thức giao hàng theo ID
  deleteDeliveryMethod: async (id: string | number) => {
    return await apiClient.delete(delivery.delete(id));
  },
};
