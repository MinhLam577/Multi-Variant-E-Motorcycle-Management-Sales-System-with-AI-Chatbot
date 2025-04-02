import { makeAutoObservable, toJS } from "mobx";
import { convertDate } from "../utils";
import { DateTimeFormat } from "../constants";
import OrderAPI, { ExportOrder, ResponsePromise } from "../api/order";
import { RootStore } from "./base";

export type OrderStatus = {
    key?: string;
};

export type globalFiltersData = {
    search?: string;
    sortOrder?: string;
    sortBy?: string;
    order_status?: string;
    payment_status?: string;
    payment_method?: string;
    created_from?: string;
    created_to?: string;
};

export type paginationData = {
    current: number;
    pageSize: number;
};

export type orderData = {
    orders: any[];
    order_status: OrderStatus[];
    order_status_selected?: string;
    order_selected?: string;
    order_detail?: any;
    confirm_order_data?: ExportOrder;
};
export default class OrderObservable {
    status: number | null = null;
    errorMsg: string | null = null;
    successMsg: string | null = null;
    showSuccessMsg: boolean = false;
    rootStore: RootStore;
    data: orderData = {
        orders: [],
        order_status: [],
        order_status_selected: null,
        order_selected: null,
        order_detail: null,
        confirm_order_data: null,
    };
    globalFilters: globalFiltersData = {
        search: null,
        sortOrder: null,
        sortBy: null,
        order_status: null,
        payment_status: null,
        payment_method: null,
        created_from: null,
        created_to: null,
    };
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    loading: boolean = false;
    isOpenDetail: boolean = false;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        this.setGlobalFilters = this.setGlobalFilters.bind(this);
        this.setPagination = this.setPagination.bind(this);
        this.getListOrder = this.getListOrder.bind(this);
        this.getOrderDetail = this.getOrderDetail.bind(this);
        this.getOrderStatus = this.getOrderStatus.bind(this);
        this.clearMessage = this.clearMessage.bind(this);
        this.setOrderDetail = this.setOrderDetail.bind(this);
        this.setOpenDetail = this.setOpenDetail.bind(this);
        this.setOrderStatusSelected = this.setOrderStatusSelected.bind(this);
        this.setOrderSelected = this.setOrderSelected.bind(this);
        this.updateOrderStatus = this.updateOrderStatus.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.failedDelivery = this.failedDelivery.bind(this);
        this.returnOrder = this.returnOrder.bind(this);
        this.setStatusMessage = this.setStatusMessage.bind(this);
        this.confirmOrder = this.confirmOrder.bind(this);
    }

    *getListOrder(query?: string | object) {
        try {
            this.loading = true;

            // Xử lý chuyển đổi query string thành object
            let parsedQuery: globalFiltersData & paginationData = {
                ...(typeof query === "string"
                    ? Object.fromEntries(new URLSearchParams(query.trim()))
                    : query),
                current: Number(this.pagination.current),
                pageSize: Number(this.pagination.pageSize),
            };

            // Gộp filters và xử lý dữ liệu
            const filters: paginationData & globalFiltersData = {
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
            const response: ResponsePromise =
                yield OrderAPI.getOrderList(queryString);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.orders = data.orders;
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = Array.isArray(message)
                    ? message.join(", ")
                    : message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *getOrderStatus() {
        try {
            const response: ResponsePromise = yield OrderAPI.getOrderStatus();
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.order_status = [
                    {
                        key: "All",
                        value: null,
                    },
                    ...data,
                ];
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *getOrderDetail(id: string) {
        try {
            const response: ResponsePromise = yield OrderAPI.getOrderDetail(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.order_detail = data;
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *updateOrderStatus(id: string) {
        try {
            const response: ResponsePromise =
                yield OrderAPI.updateOrderStatus(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.status = status;
                this.successMsg = message;
                this.showSuccessMsg = true;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *cancelOrder(id: string, reason?: string) {
        try {
            let response: ResponsePromise = yield OrderAPI.cancelOrder(
                id,
                reason
            );
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.status = status;
                this.successMsg = message;
                this.showSuccessMsg = true;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *failedDelivery(id: string, reason?: string) {
        try {
            let response: ResponsePromise = yield OrderAPI.failedDelivery(
                id,
                reason
            );
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.status = status;
                this.successMsg = message;
                this.showSuccessMsg = true;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *returnOrder(id: string, reason?: string) {
        try {
            let response: ResponsePromise = yield OrderAPI.returnOrder(
                id,
                reason
            );
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(id);
                this.status = status;
                this.successMsg = message;
                this.showSuccessMsg = true;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *confirmOrder(data: ExportOrder) {
        try {
            const response: ResponsePromise = yield OrderAPI.confirmOrder(data);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListOrder();
                yield this.getOrderDetail(data.order_id);
                this.status = status;
                this.successMsg = message;
                this.showSuccessMsg = true;
            } else {
                this.status = status;
                this.errorMsg = message;
                this.showSuccessMsg = false;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    clearMessage() {
        this.showSuccessMsg = false;
        this.status = null;
        this.errorMsg = null;
        this.successMsg = null;
    }

    setStatusMessage(
        status?: number,
        errorMsg?: string,
        successMsg?: string,
        showSuccessMsg?: boolean
    ) {
        if (showSuccessMsg) {
            this.showSuccessMsg = showSuccessMsg;
        }
        if (status) {
            this.status = status;
        }
        if (errorMsg) {
            this.errorMsg = errorMsg;
        }
        if (successMsg) {
            this.successMsg = successMsg;
        }
    }

    setGlobalFilters(filters: globalFiltersData) {
        this.globalFilters = {
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
}
