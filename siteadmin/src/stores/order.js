import { makeAutoObservable, toJS } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints.ts";
import { convertDD_MM_YYYY_To_DateToTimeStamp } from "../utils";
import { DateTimeFormat } from "../constants";
import OrderAPI from "../api/order.ts";
export default class OrderObservable {
    status = null;
    errorMsg = null;
    successMsg = null;
    showSuccessMsg = false;
    rootStore;
    data = {
        orders: [],
        order_status: [],
        order_status_selected: null,
        order_selected: null,
        order_detail: null,
    };
    globalFilters = {
        search: null,
        sortOrder: null,
        sortBy: null,
        order_status: null,
        payment_status: null,
        payment_method: null,
        created_from: null,
        created_to: null,
    };
    pagination = {
        current: 1,
        pageSize: 100,
    };
    loading = false;
    isOpenDetail = false;
    constructor(rootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        this.setGlobalFilters = this.setGlobalFilters.bind(this);
        this.setPagination = this.setPagination.bind(this);
        this.getListOrder = this.getListOrder.bind(this);
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
    }

    *getListOrder(query) {
        try {
            this.loading = true;
            let parsedQuery = {};
            if (typeof query === "string" && query) {
                query = query.trim();
                parsedQuery = Object.fromEntries(new URLSearchParams(query));
            } else if (query && typeof query === "object") {
                parsedQuery = { ...query };
            }

            const filters = {
                ...parsedQuery,
                ...this.globalFilters,
                ...this.pagination,
            };
            if (query?.created_from && query?.created_to) {
                filters.created_from = convertDD_MM_YYYY_To_DateToTimeStamp(
                    query.created_from,
                    DateTimeFormat.TIME_STAMP_POSTGRES
                );
                filters.created_to = convertDD_MM_YYYY_To_DateToTimeStamp(
                    query.created_to,
                    DateTimeFormat.TIME_STAMP_POSTGRES
                );
            }

            if (query?.search) {
                filters.search = query.search.trim();
            }

            for (const key in filters) {
                if (
                    filters[key] === null ||
                    filters[key] === undefined ||
                    filters[key] === ""
                ) {
                    delete filters[key];
                }
            }
            const queryString = new URLSearchParams(filters).toString();
            const response = yield OrderAPI.getOrderList(queryString);
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
        } catch (e) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *getOrderStatus() {
        try {
            const response = yield OrderAPI.getOrderStatus();
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
        } catch (e) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *getOrderDetail(id) {
        try {
            const response = yield OrderAPI.getOrderDetail(id);
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
        } catch (e) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *updateOrderStatus(id) {
        try {
            const response = yield OrderAPI.updateOrderStatus(id);
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
        } catch (e) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *cancelOrder(id, reason) {
        try {
            let response = null;
            if (!reason) {
                response = yield apiClient.patch(
                    endpoints.order.cancelOrder(id)
                );
            } else {
                response = yield apiClient.patch(
                    endpoints.order.cancelOrder(id),
                    JSON.stringify({ reason: reason })
                );
            }
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
        } catch (e) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *failedDelivery(id, reason) {
        try {
            let response = null;
            if (!reason) {
                response = yield apiClient.patch(
                    endpoints.order.failedDelivery(id)
                );
            } else {
                response = yield apiClient.patch(
                    endpoints.order.failedDelivery(id),
                    JSON.stringify({ reason: reason })
                );
            }
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
        } catch (e) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *returnOrder(id, reason) {
        try {
            let response = null;
            if (!reason) {
                response = yield apiClient.patch(
                    endpoints.order.returnOrder(id)
                );
            } else {
                response = yield apiClient.patch(
                    endpoints.order.returnOrder(id),
                    JSON.stringify({ reason: reason })
                );
            }
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
        } catch (e) {
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

    setStatusMessage(status, errorMsg, successMsg, showSuccessMsg) {
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

    setGlobalFilters(filters) {
        this.globalFilters = {
            ...this.globalFilters,
            ...filters,
        };
    }

    setPagination(page, pageSize) {
        if (!page || !pageSize) return;
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

    setOpenDetail(isOpen) {
        this.isOpenDetail = isOpen;
    }

    setOrderSelected(order_selected) {
        this.data.order_selected = order_selected;
    }

    setOrderStatusSelected(order_status_selected) {
        this.data.order_status_selected = order_status_selected;
    }
}
