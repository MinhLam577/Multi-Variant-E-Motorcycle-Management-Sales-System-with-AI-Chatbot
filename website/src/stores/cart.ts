import { makeAutoObservable, toJS } from "mobx";

import { DateTimeFormat, SUCCESS_STATUSES } from "../constants";
import OrderAPI, { ExportOrder, ResponsePromise } from "../api/order";
import { RootStore } from "./base";
import voucherApi from "../api/voucher";
import { getBlogDetails, getListBlog } from "../api/blog";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";

export type paginationData = {
    current: number;
    pageSize: number;
};

export type CartItemResponseType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    quantity: number;
    skus: {
        id: string;
        name: string;
        price_sold: string;
        image: string;
        product: {
            id: string;
            title: string;
            type: string;
        };
        skus_quantity_remaining: number;
    };
};
export default class CartObservable {
    status: number | null = null;
    errorMsg: string | null = null;
    successMsg: string | null = null;
    showSuccessMsg: boolean = false;
    rootStore: RootStore;
    data: CartItemResponseType[] = [];
    idcart: string = "";

    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    loading: boolean = false;
    isOpenDetail: boolean = false;
    // chonj ben cart
    selectedItems: string[] = [];
    // data checkout
    listDataSelected: CartItemResponseType[] = [];
    dataOrder = {
        orderId: null,
        payment_method: null,
        order_url: null,
        checkoutUrl: null,
    };
    constructor(rootStore: RootStore) {
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
    }

    *getListCart() {
        try {
            this.loading = true;
            const response = yield apiClient.get(endpoints.cart.list());
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data = data.cartItem;
                this.idcart = data.id;
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

    setSelectedItems(items: string[]) {
        this.selectedItems = items;

        // Lưu vào localStorage
        localStorage.setItem("selectedItems", JSON.stringify(items));
        // lấy danh sách item đc chọn

        this.listDataSelected = this.data.filter((item) =>
            this.selectedItems.includes(item.id)
        );
    }
    // lấy lại khi F5 ở checkout
    initSelectedItemsFromStorage() {
        const stored = localStorage.getItem("selectedItems");
        if (stored) {
            this.selectedItems = JSON.parse(stored);
            this.listDataSelected = this.data.filter((item) =>
                this.selectedItems.includes(item.id)
            );
        }
    }

    get getListDataSelectedByCart() {
        return this.data.filter((item) => item);
    }

    get getSelectedItems() {
        return this.selectedItems;
    }
    clearSelectedCart() {
        this.selectedItems = [];
    }
    *checkoutBycart(orderData) {
        try {
            this.loading = true;
            const response = yield apiClient.post(
                endpoints.order.createOrder(),
                orderData
            );
            const { data, status, message } = response;
            if (!SUCCESS_STATUSES.includes(status)) {
                this.status = status;
                this.errorMsg = Array.isArray(message) ? message[0] : message;
            }
            // ✅ Xóa selectedItems trong localStorage
            localStorage.removeItem("selectedItems");
            // lấy id cart
            yield this.getListCart();
            this.dataOrder.orderId = data.id;
            this.dataOrder.payment_method = data.payment_method.name;
            this.status = status;
            this.successMsg = message;
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }
    *checkoutByZaloPay(orderID) {
        try {
            this.loading = true;
            const response = yield apiClient.post(
                endpoints.zalo_pay.createZalopayOrder(),
                orderID
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // ✅ Xóa selectedItems trong localStorage
                localStorage.removeItem("selectedItems");
                // lấy id cart
                this.dataOrder.order_url = data.response.order_url;

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
    *checkoutByPayos(orderID) {
        try {
            this.loading = true;
            const response = yield apiClient.post(
                endpoints.pay_os.createPayosOrder(),
                orderID
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // ✅ Xóa selectedItems trong localStorage
                localStorage.removeItem("selectedItems");

                // ✅ Kiểm tra checkoutUrl trước khi dùng
                if (data?.checkoutUrl) {
                    this.dataOrder.checkoutUrl = data.checkoutUrl;
                } else {
                    console.warn("Không nhận được checkoutUrl từ PayOS.");
                }
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

    // hủy đơn pay os
    *cancel_order_payos(orderID) {
        try {
            this.loading = true;
            const response = yield apiClient.post(
                endpoints.pay_os.cancel_order_payos(orderID)
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // lấy id cart
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

    *BuyAgain_InOrder(body) {
        try {
            this.loading = true;
            const response = yield apiClient.post(
                endpoints.cart.create(),
                body
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                if (!this.selectedItems.includes(data.id)) {
                    this.selectedItems.push(data.id);
                }
                yield this.getListCart();
                this.setSelectedItems(this.selectedItems);
                this.status = status;
                this.successMsg = message;
            } else {
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
    *PostCart(body) {
        try {
            this.loading = true;
            const response = yield apiClient.post(
                endpoints.cart.create(),
                body
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListCart();
                this.status = status;
                this.successMsg = message;
            } else {
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

    *PostCart_ByBuyNow(body) {
        try {
            this.loading = true;
            const response = yield apiClient.post(
                endpoints.cart.create(),
                body
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                if (!this.selectedItems.includes(data.id)) {
                    this.selectedItems.push(data.id);
                    // xử lý cập nhật phần mảng cartITem đã chọn :
                }
                yield this.getListCart();
                // cập nhật lại mảng cartItem đã chọn ở selectedItems để hiển thị
                this.listDataSelected = this.data.filter((item) =>
                    this.selectedItems.includes(item.id)
                );
                // yield this.getListCart();
                this.status = status;
                this.successMsg = message;
            } else {
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

    *UpdateQuantityCart(idCartItem, quantity) {
        try {
            this.loading = true;
            const response = yield apiClient.patch(
                endpoints.cart.update(idCartItem),
                quantity
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                yield this.getListCart();
                // cập nhật lại mảng cartItem đã chọn ở selectedItems để hiển thị
                this.listDataSelected = this.data.filter((item) =>
                    this.selectedItems.includes(item.id)
                );
                this.status = status;
                this.successMsg = message;
            } else {
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

    *deleteCartItemByID(id: string) {
        try {
            // gọi một hàm bất đồng bộ (API)
            const response: ResponsePromise = yield apiClient.delete(
                endpoints.cart.deleteCartItem(id)
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.selectedItems = this.selectedItems.filter((i) => i !== id);
                yield this.getListCart();
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

    *createVoucher(body: any) {
        try {
            // gọi một hàm bất đồng bộ (API)
            const response: ResponsePromise = yield voucherApi.create(body);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // ✅ Gọi lại API để refresh data
                // yield this.getListBlogs();
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

    *editVoucher(id: string, body: any) {
        try {
            // gọi một hàm bất đồng bộ (API)
            const response = yield voucherApi.update(id, body);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // ✅ Gọi lại API để refresh data
                // yield this.getListBlogs();
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
    setPagination(page: number, pageSize: number) {
        if (page < 1 || pageSize < 1) return;

        this.pagination = {
            ...this.pagination,
            current: page,
            pageSize: pageSize,
        };
    }
}
