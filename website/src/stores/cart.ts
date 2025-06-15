import { makeAutoObservable, toJS } from "mobx";

import { DateTimeFormat } from "../constants";
import OrderAPI, { ExportOrder, ResponsePromise } from "../api/order";
import { RootStore } from "./base";
import voucherApi from "../api/voucher";
import { getBlogDetails, getListBlog } from "../api/blog";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";

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
export type TypeVoucher = {
  id: string;
  name_type_voucher: string;
};

export type paginationData = {
  current: number;
  pageSize: number;
};

interface Voucher {
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
export default class CartObservable {
  status: number | null = null;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  showSuccessMsg: boolean = false;
  rootStore: RootStore;
  data = [];
  dataById = null;
  typeVoucher: TypeVoucher[] = [];
  dataDetail: Voucher[] = [];
  dataListCustomer_no_voucher = [];
  idcart: string = "";

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
  // chonj ben cart
  selectedItems = [];
  // data checkout
  listDataSelected = [];
  dataOrder = {
    orderId: null,
    payment_method: null,
    order_url: null,
    checkoutUrl: null,
  };
  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.setGlobalFilters = this.setGlobalFilters.bind(this);
    this.setPagination = this.setPagination.bind(this);
    this.getListCart = this.getListCart.bind(this);
    this.createVoucher = this.createVoucher.bind(this);
    this.UpdateQuantityCart = this.UpdateQuantityCart.bind(this);
    this.setSelectedItems = this.setSelectedItems.bind(this);
    this.getSelectedItems = this.getSelectedItems.bind(this);
    this.getItemCarts_Checkout = this.getItemCarts_Checkout.bind(this);
    this.BuyAgain_InOrder = this.BuyAgain_InOrder.bind(this);
    this.clearSelectedCart = this.clearSelectedCart.bind(this);
    this.checkoutByPayos = this.checkoutByPayos.bind(this);
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
        this.errorMsg = Array.isArray(message) ? message.join(", ") : message;
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
    console.log(this.listDataSelected);
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
        this.errorMsg = Array.isArray(message) ? message.join(", ") : message;
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
        this.errorMsg = Array.isArray(message) ? message.join(", ") : message;
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
      console.log(data);
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        // lấy id cart
        this.dataOrder.checkoutUrl = data.checkoutUrl;
        console.log(data.checkoutUrl);
        this.status = status;
        this.successMsg = message;
      } else {
        this.status = status;
        this.errorMsg = Array.isArray(message) ? message.join(", ") : message;
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
      const response = yield apiClient.post(endpoints.cart.create(), body);
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
        this.errorMsg = Array.isArray(message) ? message.join(", ") : message;
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
      const response = yield apiClient.post(endpoints.cart.create(), body);
      const { data, status, message } = response;
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        yield this.getListCart();
        this.status = status;
        this.successMsg = message;
      } else {
        this.errorMsg = Array.isArray(message) ? message.join(", ") : message;
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
      const response = yield apiClient.post(endpoints.cart.create(), body);
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
        this.errorMsg = Array.isArray(message) ? message.join(", ") : message;
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
        this.errorMsg = Array.isArray(message) ? message.join(", ") : message;
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
}
