import { RevenueProfitStatisticsDto } from "src/types/order.type";
import { ResponsePromise } from ".";
import apiClient from "./apiClient";
import endpoints from "./endpoints";
const orderEndpoints = endpoints.order;

const OrderAPI: {
    getOrderList: (query: string) => Promise<ResponsePromise>;
    getOrderDetail: (id: string) => Promise<ResponsePromise>;
    getOrderStatus: () => Promise<ResponsePromise>;
    updateOrderStatus: (id: string) => Promise<ResponsePromise>;

    // confirmOrder: (data: ExportOrder) => Promise<ResponsePromise>;
    confirmOrder: (id: string) => Promise<ResponsePromise>;
    exportOrder: (id: string) => Promise<ResponsePromise>;
    handOverOrder: (id: string) => Promise<ResponsePromise>;
    deliverOrder: (id: string) => Promise<ResponsePromise>;
    shipOrder: (id: string) => Promise<ResponsePromise>;
    shipSuccess: (id: string) => Promise<ResponsePromise>;
    cancelOrder: (id: string, reason?: string) => Promise<ResponsePromise>;
    failedDelivery: (id: string, reason?: string) => Promise<ResponsePromise>;
    returnOrder: (id: string, reason?: string) => Promise<ResponsePromise>;
    profitStatistic: (
        data: RevenueProfitStatisticsDto
    ) => Promise<ResponsePromise>;
    totalRevenueByYear: (year: number) => Promise<ResponsePromise>;
    orderStatusStatics: (year: number) => Promise<ResponsePromise>;
} = {
    getOrderList: async (query: string) =>
        await apiClient.get(orderEndpoints.list(query)),
    getOrderDetail: async (id: string) =>
        await apiClient.get(orderEndpoints.getOrderDetail(id)),
    getOrderStatus: async () => await apiClient.get(orderEndpoints.getStatus()),
    updateOrderStatus: async (id: string) =>
        await apiClient.patch(orderEndpoints.updateOrderStatus(id)),
    confirmOrder: async (id: string) =>
        await apiClient.patch(orderEndpoints.confirmOrder(id)),
    exportOrder: async (id: string) =>
        await apiClient.patch(orderEndpoints.exportOrder(id)),
    handOverOrder: async (id: string) =>
        await apiClient.patch(orderEndpoints.handOverOrder(id)),
    deliverOrder: async (id: string) =>
        await apiClient.patch(orderEndpoints.deliveryOrder(id)),
    shipOrder: async (id: string) =>
        await apiClient.patch(orderEndpoints.shipOrder(id)),
    shipSuccess: async (id: string) =>
        await apiClient.patch(orderEndpoints.shipSuccess(id)),
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
    profitStatistic: async (
        data: RevenueProfitStatisticsDto
    ): Promise<ResponsePromise> => {
        return await apiClient.post(
            orderEndpoints.revenueProfitStatistic(),
            JSON.stringify(data)
        );
    },
    totalRevenueByYear: async (year: number): Promise<ResponsePromise> => {
        return await apiClient.post(
            orderEndpoints.totalRevenueByYear(),
            JSON.stringify({ year })
        );
    },
    orderStatusStatics: async (year: number): Promise<ResponsePromise> => {
        return await apiClient.post(
            orderEndpoints.orderStatusStatics(),
            JSON.stringify({ year })
        );
    },
};

export default OrderAPI;
