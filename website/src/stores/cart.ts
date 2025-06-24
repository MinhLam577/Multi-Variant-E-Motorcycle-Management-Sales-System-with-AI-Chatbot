import { makeAutoObservable, toJS } from "mobx";

import { DateTimeFormat } from "../constants";
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
    selectedItems = [];
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
                // lấy id cart
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

    *setSelectedItems(items: string[]) {
        this.selectedItems = items;
        // lấy danh sách item đc chọn
        this.listDataSelected = this.data.filter((item) =>
            this.selectedItems.includes(item.id)
        );
    }
    get ListDataSelectedByCart() {
        return this.data.filter((item) => item);
    }

    *getSelectedItems() {
        return this.selectedItems;
    }
    *getItemCarts_Checkout() {
        return this.data.filter((item) => this.selectedItems.includes(item.id));
    }
    *clearSelectedCart() {
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
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // lấy id cart
                yield this.getListCart();
                this.dataOrder.orderId = data.id;
                this.dataOrder.payment_method = data.payment_method.name;
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
                // lấy id cart
                this.dataOrder.checkoutUrl = data.checkoutUrl;
                console.log(data.checkoutUrl);
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
            // quantity , skus
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

    // danh sách voucher

    // * : generator function
    *deleteCartByID(id: string) {
        try {
            // gọi một hàm bất đồng bộ (API)
            const response: ResponsePromise = yield apiClient.delete(
                endpoints.cart.deleteCartItem(id)
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // ✅ Gọi lại API để refresh data
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
