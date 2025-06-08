import apiClient from "./apiClient";
import endpoints from "./endpoints";
export interface Voucher {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  voucher_code: string;
  voucher_name: string;
  description: string;
  uses: number;
  limit: number;
  max_uses_user: number;
  discount_amount: string;
  fixed: boolean;
  status: string;
  start_date: string;
  end_date: string;
  count_user_get: number;
}
export interface data {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: string;
  is_used: boolean;
  used_at: Date;
  voucher: Voucher;
}

export interface VoucherResponse {
  data: data[];
  status: number;
  message: string;
}
export type TypeVoucher = {
  id: string;
  name_type_voucher: string;
};
export interface TypeVoucherResponse {
  data: TypeVoucher[];
  status: number;
  message: string;
}
const voucherApi = {
  getList_Of_User: async (): Promise<VoucherResponse> => {
    const Response = await apiClient.get<any, VoucherResponse>(
      endpoints.vouchers.getListVoucher_Of_Customer()
    );
    return Response;
  },

  getVoucher_User_ById: async (id: string): Promise<VoucherResponse> => {
    const Response = await apiClient.get<any, VoucherResponse>(
      endpoints.vouchers.getVoucher_Of_Customer_ByID(id)
    );
    return Response;
  },
  create: async (data: any): Promise<VoucherResponse> => {
    const Response = await apiClient.post<any, VoucherResponse>(
      endpoints.vouchers.create,
      data
    );
    return Response;
  },
  update: async (id: string, body: string) => {
    const Response = await apiClient.patch<any, VoucherResponse>(
      endpoints.vouchers.update(id),
      body
    );
    return Response;
  },
  delete: async (id: string) => {
    const Response = await apiClient.delete(endpoints.vouchers.delete(id));
    return Response;
  },
  getById: async (id: string): Promise<VoucherResponse> => {
    const Response = await apiClient.get<any, VoucherResponse>(
      endpoints.vouchers.details(id)
    );
    return Response;
  },
  // get typevoucher
  getListTypeVoucher: async (): Promise<TypeVoucherResponse> => {
    const Response = await apiClient.get<any, TypeVoucherResponse>(
      endpoints.type_voucher.list
    );
    return Response;
  },
  // get list customer no voucher
  getListCustomer_no_Voucher: async (id) => {
    const Response = await apiClient.get(
      endpoints.vouchers.getList_Customer_no_voucher(id)
    );
    return Response;
  },

  // post give_customer_voucher
  give_customer_voucher: async (id: string, body: any) => {
    const Response = await apiClient.post(
      endpoints.vouchers.give_customer_voucher(id),
      body
    );
    return Response;
  },
};
export default voucherApi;
