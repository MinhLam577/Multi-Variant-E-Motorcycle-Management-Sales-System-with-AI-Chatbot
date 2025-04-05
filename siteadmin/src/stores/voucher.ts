import { makeAutoObservable, toJS } from "mobx";
import { convertDate } from "../utils";
import { DateTimeFormat } from "../constants";
import OrderAPI, { ExportOrder, ResponsePromise } from "../api/order";
import { RootStore } from "./base";
import voucherApi from "src/api/voucher";

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
export type TypeVoucher = {
  id: string;
  name_type_voucher: string;
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
export default class VoucherObservable {
  status: number | null = null;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  showSuccessMsg: boolean = false;
  rootStore: RootStore;
  data: Voucher[] = null;
  dataUser = null;
  typeVoucher: TypeVoucher[] = [];
  dataDetail: Voucher[] = [];
  dataListCustomer_no_voucher = [];
  idVoucher: string = "";

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
    this.getListVoucher = this.getListVoucher.bind(this);
    this.getVoucherDetail = this.getVoucherDetail.bind(this);
    this.getListCustomer_no_voucher =
      this.getListCustomer_no_voucher.bind(this);
    this.deleteVoucherByID = this.deleteVoucherByID.bind(this);
    this.getListTypeVoucher = this.getListTypeVoucher.bind(this);
    this.createVoucher = this.createVoucher.bind(this);
  }

  *getListVoucher() {
    try {
      this.loading = true;
      const response = yield voucherApi.getList();

      const { data, status, message } = response;
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        this.data = data;
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

  *getListCustomer_no_voucher() {
    try {
      this.loading = true;
      const response = yield voucherApi.getListCustomer_no_Voucher(
        this.idVoucher
      );
      const { data, status, message } = response;
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        this.dataListCustomer_no_voucher = data;
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
  // cập nhật id
  *setID_ListCustomer_no_voucher(id) {
    try {
      this.idVoucher = id;
      // lấy ra danh sách customer no voucher theo id voucher
      const response = yield voucherApi.getListCustomer_no_Voucher(id);
      console.log(response);
      const { data, status, message } = response;
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        this.dataListCustomer_no_voucher = data;
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

  *getVoucherDetail(id: string) {
    try {
      this.idVoucher = id;
      const response: ResponsePromise = yield voucherApi.getById(id);
      console.log(response);
      const { data, status, message } = response;
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        this.dataDetail = data;
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

  // danh sách voucher

  *getListTypeVoucher() {
    try {
      this.loading = true;
      const response = yield voucherApi.getListTypeVoucher();
      console.log(response);
      const { data, status, message } = response;
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        this.typeVoucher = data;
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
  // * : generator function
  *deleteVoucherByID(id: string) {
    try {
      // gọi một hàm bất đồng bộ (API)
      const response: ResponsePromise = yield voucherApi.delete(id);
      const { data, status, message } = response;
      console.log(response);
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        // ✅ Gọi lại API để refresh data
        yield this.getListVoucher();
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
      console.log(response);
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        // ✅ Gọi lại API để refresh data
        yield this.getListVoucher();
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

  *createVoucher_give_Customer(id: string, body: any) {
    try {
      // gọi một hàm bất đồng bộ (API)
      const response: ResponsePromise = yield voucherApi.give_customer_voucher(
        id,
        body
      );
      const { status, message } = response;
      console.log(response);
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        yield this.setID_ListCustomer_no_voucher(id);
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
      console.log(response);
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        // ✅ Gọi lại API để refresh data
        yield this.getListVoucher();
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
