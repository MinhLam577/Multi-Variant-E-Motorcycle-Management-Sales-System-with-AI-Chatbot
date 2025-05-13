import apiClient from "./apiClient";
import endpoints from "./endpoints";
const payment = endpoints.paymentMethodOption;

export const PaymentMethodApi = {
  // Tạo phương thức thanh toán mới
  createPaymentMethod: async (data: any) => {
    return await apiClient.post(payment.create(), data);
  },

  // Lấy danh sách tất cả phương thức thanh toán
  getListPaymentMethods: async () => {
    return await apiClient.get(payment.list());
  },

  // Lấy chi tiết phương thức thanh toán theo ID
  getDetailPaymentMethod: async (id: string | number) => {
    return await apiClient.get(payment.details(id));
  },

  // Lấy phương thức thanh toán theo tên
  getPaymentMethodByName: async (name: string) => {
    return await apiClient.get(payment.getByName(name));
  },

  // Cập nhật phương thức thanh toán theo ID
  updatePaymentMethod: async (id: string | number, data: any) => {
    return await apiClient.put(payment.update(id), data);
  },

  // Xóa phương thức thanh toán theo ID
  deletePaymentMethod: async (id: string | number) => {
    return await apiClient.delete(payment.delete(id));
  },
};
