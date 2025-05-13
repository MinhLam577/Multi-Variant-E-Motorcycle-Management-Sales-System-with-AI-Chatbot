import { ResponsePromise } from ".";
import apiClient from "./apiClient";
import endpoints from "./endpoints";
const orderEndpoints = endpoints.order;

export interface CreateDetailExport {
    quantity_export: number;
    skus_id: string;
    detail_import_id: string;
    warehouse_id: string;
    order_id?: string;
}

export interface ExportOrder {
    note?: string;
    order_id: string;
    detail_export: CreateDetailExport[];
}

const OrderAPI: {
    getOrderList: (query: string) => Promise<ResponsePromise>;
    getOrderDetail: (id: string) => Promise<ResponsePromise>;
    getOrderStatus: () => Promise<ResponsePromise>;
    updateOrderStatus: (id: string) => Promise<ResponsePromise>;
    confirmOrder: (data: ExportOrder) => Promise<ResponsePromise>;
    cancelOrder: (id: string, reason?: string) => Promise<ResponsePromise>;
    failedDelivery: (id: string, reason?: string) => Promise<ResponsePromise>;
    returnOrder: (id: string, reason?: string) => Promise<ResponsePromise>;
} = {
    getOrderList: async (query: string) =>
        await apiClient.get(orderEndpoints.list(query)),
    getOrderDetail: async (id: string) =>
        await apiClient.get(orderEndpoints.getOrderDetail(id)),
    getOrderStatus: async () => await apiClient.get(orderEndpoints.getStatus()),
    updateOrderStatus: async (id: string) =>
        await apiClient.patch(orderEndpoints.updateOrderStatus(id)),
    confirmOrder: async (data: ExportOrder) => {
        const { note, ...res } = data;
        const saveData: ExportOrder = {
            ...res,
        };
        if (note) {
            saveData.note = note;
        }

        return await apiClient.patch(
            orderEndpoints.confirmOrder(),
            JSON.stringify(saveData)
        );
    },
    cancelOrder: async (id: string, reason?: string) => {
        if (reason) {
            return await apiClient.patch(
                orderEndpoints.cancelOrder(id),
                JSON.stringify({ reason })
            );
        }
        return await apiClient.patch(orderEndpoints.cancelOrder(id));
    },
    failedDelivery: async (id: string, reason?: string) => {
        if (reason) {
            return await apiClient.patch(
                orderEndpoints.failedDelivery(id),
                JSON.stringify({ reason })
            );
        }
        return await apiClient.patch(orderEndpoints.failedDelivery(id));
    },
    returnOrder: async (id: string, reason?: string) => {
        if (reason) {
            return await apiClient.patch(
                orderEndpoints.returnOrder(id),
                JSON.stringify({ reason })
            );
        }
        return await apiClient.patch(orderEndpoints.returnOrder(id));
    },
};

export default OrderAPI;
