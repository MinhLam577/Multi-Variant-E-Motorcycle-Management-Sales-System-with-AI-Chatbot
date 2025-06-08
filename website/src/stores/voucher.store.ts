import { makeAutoObservable, toJS } from "mobx";

import { DateTimeFormat } from "../constants";
import OrderAPI, { ExportOrder, ResponsePromise } from "../api/order";
import { RootStore } from "./base";
import voucherApi from "../api/voucher";

// export type OrderStatus = {
//     key?: string;
// };

// export type globalFiltersData = {
//     search?: string;
//     sortOrder?: string;
//     sortBy?: string;
//     order_status?: string;
//     payment_status?: string;
//     payment_method?: string;
//     created_from?: string;
//     created_to?: string;
// };
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
export default class VoucherObservable {
  status: number | null = null;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  showSuccessMsg: boolean = false;
  rootStore: RootStore;
  data = null;
  dataUser = null;
  typeVoucher: TypeVoucher[] = [];
  dataDetail = "";
  dataListCustomer_no_voucher = [];
  idVoucher_User: string = "";
  idVoucher: string = "";
  pagination: paginationData = {
    current: 1,
    pageSize: 100,
  };
  loading: boolean = false;
  isOpenDetail: boolean = false;
  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {}, { autoBind: true });

    this.rootStore = rootStore;
  }

  *getListVoucher_of_User() {
    try {
      this.loading = true;
      const response = yield voucherApi.getList_Of_User();
      console.log("response", toJS(response));
      const { data, status, message } = response;
      console.log(data);
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        this.data = data;
        this.status = status;
        this.successMsg = message;
      } else {
        this.status = status;
        this.errorMsg = Array.isArray(message) ? message[0] : message;
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
        this.errorMsg = Array.isArray(message) ? message[0] : message;
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
      const { data, status, message } = response;
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        this.dataListCustomer_no_voucher = data;
      } else {
        this.errorMsg = Array.isArray(message) ? message[0] : message;
      }
    } catch (e: any) {
      console.error(e);
      this.status = 500;
      this.errorMsg = e?.message || "Lỗi không xác định";
    } finally {
      this.loading = false;
    }
  }

  *getUser_Voucher_Detail(id: string) {
    try {
      this.idVoucher_User = id;
      const response: ResponsePromise = yield voucherApi.getVoucher_User_ById(
        id
      );
      const { data, status, message } = response;
      console.log(data);
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
      const { data, status, message } = response;
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        this.typeVoucher = data;
      } else {
        this.status = status;
        this.errorMsg = Array.isArray(message) ? message[0] : message;
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
  //   *deleteVoucherByID(id: string) {
  //     try {
  //       // gọi một hàm bất đồng bộ (API)
  //       const response: ResponsePromise = yield voucherApi.delete(id);
  //       const { data, status, message } = response;
  //       const success_status = [200, 201, 204];
  //       if (success_status.includes(status)) {
  //         // ✅ Gọi lại API để refresh data
  //         yield this.getListVoucher();
  //         this.status = status;
  //         this.successMsg = message;
  //       } else {
  //         this.status = status;
  //         this.errorMsg = message;
  //       }
  //     } catch (e: any) {
  //       console.error(e);
  //       this.status = 500;
  //       this.errorMsg = e?.message || "Lỗi không xác định";
  //     }
  //   }

  //   *createVoucher(body: any) {
  //     try {
  //       // gọi một hàm bất đồng bộ (API)
  //       const response: ResponsePromise = yield voucherApi.create(body);
  //       const { data, status, message } = response;
  //       const success_status = [200, 201, 204];
  //       if (success_status.includes(status)) {
  //         // ✅ Gọi lại API để refresh data
  //         yield this.getListVoucher();
  //         this.status = status;
  //         this.successMsg = message;
  //       } else {
  //         this.status = status;
  //         this.errorMsg = message;
  //       }
  //     } catch (e: any) {
  //       console.error(e);
  //       this.status = 500;
  //       this.errorMsg = e?.message || "Lỗi không xác định";
  //     }
  //   }

  *createVoucher_give_Customer(id: string, body: any) {
    try {
      // gọi một hàm bất đồng bộ (API)
      const response: ResponsePromise = yield voucherApi.give_customer_voucher(
        id,
        body
      );
      const { status, message } = response;
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

  setPagination(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) return;

    this.pagination = {
      ...this.pagination,
      current: page,
      pageSize: pageSize,
    };
  }
}
