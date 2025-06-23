import { makeAutoObservable, toJS } from "mobx";
import { convertDate, getErrorMessage } from "../utils";
import { DateTimeFormat, EnumOrderStatusesValue } from "../constants";
import OrderAPI, { ExportOrder } from "../api/order.api";
import { paginationData, RootStore } from "./base";
import { ResponsePromise } from "src/api";
import { SkusDataResponseType } from "./product.store";
import { CustomerResponseType, ReceiveAddressResponseType } from "./user.store";
import { PaymentMethodResponseType } from "./paymentMethod";
import {
    EnumTypeOfTimeStatistics,
    StatisticsResponse,
} from "src/pages/adminOverview/Overview";

export class order_detail_dto {
    skus_id: string;
    quantity: number;
}

export type CreateOrderDto = {
    customer_id: string;
    receive_address_id: string;
    total_price: number;
    discount_price: number;
    order_note?: string;
    payment_method_id: string;
    delivery_method_id: string;
    order_details: order_detail_dto[];
};

export type RevenueProfitStatisticsDto = {
    time_type: EnumTypeOfTimeStatistics;
    year?: number;
    startMonth?: number;
    endMonth?: number;
    month?: number;
    startDay?: number;
    endDay?: number;
};

export type OrderDetailResponseType = {
    id: string;
    customer: CustomerResponseType;
    receive_address: ReceiveAddressResponseType;
    order_status: string;
    note: string | null;
    order_details: OrderDetailDataResponseType[];
    total_price: number;
    discount_price: number;
    payment_method: PaymentMethodResponseType;
    payment_status: string;
    delivery_method: DeliveryMethodResponseType;
    delivery_time: string | null;
    refund_time: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type DeliveryMethodResponseType = {
    id: string;
    name: string;
    description: string;
    logo: string | null;
};
export type OrderStatusStaticsResponseType = {
    [K in Exclude<keyof typeof EnumOrderStatusesValue, "All">]: number;
};
export type OrderStatus = {
    key?: string;
};

export type OrderDetailDataResponseType = {
    id: string;
    quantity: number;
    skus: SkusDataResponseType & {
        product: {
            id: string;
            title: string;
        };
    };
};

export type globalFiltersDataOrder = {
    search?: string;
    sortOrder?: string;
    sortBy?: string;
    order_status?: Omit<EnumOrderStatusesValue, "All">;
    payment_status?: string;
    payment_method?: string;
    delivery_method?: string;
    created_from?: string;
    created_to?: string;
};

export type orderData = {
    orders: OrderDetailResponseType[];
    order_status: EnumOrderStatusesValue[];
    order_status_selected?: string;
    order_selected?: string;
    order_detail?: OrderDetailResponseType;
    confirm_order_data?: ExportOrder;
    revenue_profit_statistics?: StatisticsResponse;
    total_revenue_by_year?: number;
    order_status_statics?: OrderStatusStaticsResponseType[];
};
export default class OrderObservable {
    rootStore: RootStore;
    data: orderData = {
        orders: [],
        order_status: [],
        order_status_selected: null,
        order_selected: null,
        order_detail: null,
        confirm_order_data: null,
        revenue_profit_statistics: null,
        total_revenue_by_year: null,
        order_status_statics: null,
    };
    globalFilters: globalFiltersDataOrder = {
        search: null,
        sortOrder: null,
        sortBy: null,
        order_status: null,
        payment_status: null,
        payment_method: null,
        created_from: null,
        created_to: null,
        delivery_method: null,
    };
    pagination: paginationData = {
        current: 1,
        pageSize: 10,
    };
    loading: boolean = false;
    isOpenDetail: boolean = false;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
    }

    private validateQuery(query?: string | object): string {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: globalFiltersDataOrder & paginationData = {
            current: Number(this.pagination.current),
            pageSize: Number(this.pagination.pageSize),
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query
                  ? query
                  : {}),
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFiltersDataOrder = {
            ...this.globalFilters,
            ...this.pagination,
            ...parsedQuery,
            created_from: parsedQuery?.created_from
                ? convertDate(
                      parsedQuery.created_from,
                      DateTimeFormat.TIME_STAMP_POSTGRES
                  )
                : undefined,
            created_to: parsedQuery?.created_to
                ? convertDate(
                      parsedQuery.created_to,
                      DateTimeFormat.TIME_STAMP_POSTGRES
                  )
                : undefined,
            search: parsedQuery?.search?.trim(),
        };

        // Xóa các key có giá trị null, undefined hoặc ""
        Object.keys(filters).forEach((key) => {
            if (
                filters[key] === null ||
                filters[key] === undefined ||
                filters[key] === ""
            )
                delete filters[key];
        });

        // Tạo query string
        const queryString = new URLSearchParams(
            Object.fromEntries(
                Object.entries(filters).map(([key, value]) => [
                    key,
                    String(value),
                ])
            )
        ).toString();
        return queryString;
    }

    *getListOrder(query?: string | object) {
        try {
            this.loading = true;
            const queryString = this.validateQuery(query);
            const response: ResponsePromise =
                yield OrderAPI.getOrderList(queryString);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            const newUrl = `${window.location.pathname}?${queryString}`;
            if (newUrl.includes("orders")) {
                window.history.replaceState({}, "", newUrl);
            }
            if (success_status.includes(status)) {
                this.data.orders = data.orders;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
            }
        } catch (e: any) {
            const errorMessage = getErrorMessage(
                e,
                "Không thể lấy danh sách đơn hàng"
            );
            console.error("Error fetching orders:", errorMessage);
        } finally {
            this.loading = false;
        }
    }

    *getOrderDetail(id: string) {
        try {
            const response: ResponsePromise = yield OrderAPI.getOrderDetail(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.order_detail = data;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *updateOrderStatus(id: string) {
        try {
            this.loading = true;
            const response: ResponsePromise =
                yield OrderAPI.updateOrderStatus(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *cancelOrder(id: string, reason?: string) {
        try {
            this.loading = true;
            let response: ResponsePromise = yield OrderAPI.cancelOrder(
                id,
                reason
            );
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *failedDelivery(id: string, reason?: string) {
        try {
            this.loading = true;
            let response: ResponsePromise = yield OrderAPI.failedDelivery(
                id,
                reason
            );
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *confirmOrder(id: string) {
        try {
            const response: ResponsePromise = yield OrderAPI.confirmOrder(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                this.rootStore.showSuccessMsg = false;
                return false;
            }
        } catch (e: any) {
            console.error("Error confirming order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể xác nhận đơn hàng"
            );

            this.rootStore.setStatusMessage(500, errorMessage, "", false);
            return false;
        }
    }

    *exportOrder(id: string) {
        try {
            const response: ResponsePromise = yield OrderAPI.exportOrder(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                this.rootStore.showSuccessMsg = false;
                return false;
            }
        } catch (e: any) {
            console.error("Error exporting order:", e);
            const errorMessage = getErrorMessage(e, "Không thể xuất đơn hàng");
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
            return false;
        }
    }

    *handOverOrder(id: string) {
        try {
            const response: ResponsePromise = yield OrderAPI.handOverOrder(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                this.rootStore.showSuccessMsg = false;
                return false;
            }
        } catch (e: any) {
            console.error("Error handing over order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể bàn giao đơn hàng"
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
            return false;
        }
    }

    *deliverOrder(id: string) {
        try {
            const response: ResponsePromise = yield OrderAPI.deliverOrder(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                this.rootStore.showSuccessMsg = false;
                return false;
            }
        } catch (e: any) {
            console.error("Error delivering order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể chuyển sang trạng thái vận chuyển"
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
            return false;
        }
    }

    *shipOrder(id: string) {
        try {
            const response: ResponsePromise = yield OrderAPI.shipOrder(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                this.rootStore.showSuccessMsg = false;
                return false;
            }
        } catch (e: any) {
            console.error("Error shipping order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể chuyển trang thái giao hàng"
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
            return false;
        }
    }

    *shipSuccess(id: string) {
        try {
            const response: ResponsePromise = yield OrderAPI.shipSuccess(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                this.rootStore.showSuccessMsg = false;
                return false;
            }
        } catch (e: any) {
            console.error("Error shipping success order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể chuyển trạng thái giao hàng thành công"
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
            return false;
        }
    }

    setGlobalFilters(
        filters:
            | (globalFiltersDataOrder & paginationData)
            | globalFiltersDataOrder
            | paginationData
    ) {
        this.globalFilters = {
            ...this.pagination,
            ...this.globalFilters,
            ...filters,
        };
    }

    setPagination(page: number, pageSize: number) {
        if (page < 1 || pageSize < 1) return;
        this.pagination = {
            ...this.pagination,
            current: page,
            pageSize: pageSize,
        };
    }

    setOrderDetail(orderDetail) {
        this.data.order_detail = orderDetail;
    }

    setOpenDetail(isOpen: boolean) {
        this.isOpenDetail = isOpen;
    }

    setOrderSelected(order_selected: string) {
        this.data.order_selected = order_selected;
    }

    setOrderStatusSelected(order_status_selected: string) {
        this.data.order_status_selected = order_status_selected;
    }

    *getRevenueProfitStatistics(data: RevenueProfitStatisticsDto) {
        try {
            this.loading = true;
            const response: ResponsePromise =
                yield OrderAPI.profitStatistic(data);
            const { data: statistics, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.revenue_profit_statistics = statistics;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                return statistics;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return null;
            }
        } catch (e: any) {
            console.error(e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể lấy thống kê doanh thu lợi nhuận"
            );
            this.rootStore.status = 500;
            this.rootStore.errorMsg = errorMessage;
            return null;
        } finally {
            this.loading = false;
        }
    }

    *getTotalRevenueByYear(year: number) {
        try {
            this.loading = true;
            const response: ResponsePromise =
                yield OrderAPI.totalRevenueByYear(year);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.total_revenue_by_year = data;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error(e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể lấy doanh thu theo năm"
            );
            this.rootStore.status = 500;
            this.rootStore.errorMsg = errorMessage;
            return false;
        } finally {
            this.loading = false;
        }
    }

    *getOrderStatusStatics(year: number) {
        try {
            this.loading = true;
            const response: ResponsePromise =
                yield OrderAPI.orderStatusStatics(year);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.order_status_statics = data;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error(e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể lấy thống kê trạng thái đơn hàng"
            );
            this.rootStore.status = 500;
            this.rootStore.errorMsg = errorMessage;
            return false;
        } finally {
            this.loading = false;
        }
    }

    get OrderDetailStatus() {
        return EnumOrderStatusesValue[this.data.order_detail?.order_status];
    }
}

// *confirmOrder(data: ExportOrder) {
//     try {
//         const response: ResponsePromise = yield OrderAPI.confirmOrder(data);
//         const { status, message } = response;
//         const success_status = [200, 201, 204];
//         if (success_status.includes(status)) {
//             yield this.getListOrder();
//             yield this.getOrderDetail(data.order_id);
//             this.rootStore.status = status;
//             this.rootStore.successMsg = message;
//             this.rootStore.showSuccessMsg = true;
//             return true;
//         } else {
//             this.rootStore.status = status;
//             this.rootStore.errorMsg = message;
//             this.rootStore.showSuccessMsg = false;
//             return false;
//         }
//     } catch (e: any) {
//         console.error(e);
//         this.rootStore.status = 500;
//         this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
//         return false;
//     }
// }
