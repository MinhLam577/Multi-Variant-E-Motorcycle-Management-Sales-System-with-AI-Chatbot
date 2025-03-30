import apiClient from "./apiClient";
import endpoints from "./endpoints.ts";
const orderEndpoints = endpoints.order;

// export interface CreateDetailExport {
//     skus_id: string;
//     quantity: number;
//     price: number;
//     warehouse_id: string;
// }

// export interface ExportOrder {
//     note: string;
//     order_id: string;
//     detail_export?: CreateDetailExport[];
// }

const OrderAPI: {
    getOrderList: (query: string) => Promise<any>;
    getOrderDetail: (id: string) => Promise<any>;
    getOrderStatus: () => Promise<any>;
    updateOrderStatus: (id: string) => Promise<any>;
    confirmOrder: (data: any, reason?: string) => Promise<any>;
    cancelOrder: (id: string, reason?: string) => Promise<any>;
    failedDelivery: (id: string, reason?: string) => Promise<any>;
    returnOrder: (id: string, reason?: string) => Promise<any>;
} = {
    getOrderList: async (query: string) =>
        await apiClient.get(orderEndpoints.list(query)),
    getOrderDetail: async (id: string) =>
        await apiClient.get(orderEndpoints.getOrderDetail(id)),
    getOrderStatus: async () => await apiClient.get(orderEndpoints.getStatus()),
    updateOrderStatus: async (id: string) =>
        await apiClient.put(orderEndpoints.updateOrderStatus(id)),
    confirmOrder: async (data: any, reason?: string) => {
        if (reason) {
            data.reason = reason;
        }
        return await apiClient.post(orderEndpoints.confirmOrder(), data);
    },
    cancelOrder: async (id: string, reason?: string) =>
        await apiClient.post(orderEndpoints.cancelOrder(id)),
    failedDelivery: async (id: string, reason?: string) =>
        await apiClient.post(orderEndpoints.failedDelivery(id)),
    returnOrder: async (id: string, reason?: string) =>
        await apiClient.post(orderEndpoints.returnOrder(id)),
};

export default OrderAPI;
