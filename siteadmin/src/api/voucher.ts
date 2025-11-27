import { TypeVoucherResponse, VoucherResponse } from "@/types/voucher.type";
import apiClient from "./apiClient";
import endpoints from "./endpoints";
const voucherApi = {
    getList: async (): Promise<VoucherResponse> => {
        const Response = await apiClient.get<any, VoucherResponse>(
            endpoints.vouchers.list()
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
