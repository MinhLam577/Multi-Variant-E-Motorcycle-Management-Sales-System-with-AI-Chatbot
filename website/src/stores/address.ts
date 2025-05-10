import { makeAutoObservable, toJS } from "mobx";

import { DateTimeFormat } from "../constants";
import OrderAPI, { ExportOrder, ResponsePromise } from "../api/order";
import { RootStore } from "./base";
import voucherApi from "../api/voucher";
import { AddressApi } from "../api/address";

export type TypeVoucher = {
  id: string;
  name_type_voucher: string;
};

export type paginationData = {
  current: number;
  pageSize: number;
};

export default class AddressObservable {
  status: number | null = null;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  showSuccessMsg: boolean = false;
  rootStore: RootStore;
  data = {
    listAddress: [],
    addressDefault: null,
  };

  typeVoucher: TypeVoucher[] = [];
  dataDetail: [];
  dataListCustomer_no_voucher = [];
  idVoucher: string = "";
  pagination: paginationData = {
    current: 1,
    pageSize: 100,
  };
  loading: boolean = false;
  isOpenDetail: boolean = false;
  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.getAddressDefault = this.getAddressDefault.bind(this);
    this.getListAddress = this.getListAddress.bind(this);
  }

  *getAddressDefault(idCustomer: string) {
    try {
      this.loading = true;
      const response: ResponsePromise = yield AddressApi.getAddressDefault(
        idCustomer
      );
      const { data, status, message } = response;
      console.log(data);
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        this.data.addressDefault = data;
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
  *getListAddress(idCustomer: string) {
    try {
      this.loading = true;
      const response = yield AddressApi.getListAddressByCustomer(idCustomer);
      console.log("response", toJS(response));
      const { data, status, message } = response;
      console.log(data);
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        this.data.listAddress = data;
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
  // cập nhật id
  *updateAddressDefaultCustomer(customerId: string, addressId: string) {
    try {
      // lấy ra danh sách customer no voucher theo id voucher
      const response = yield AddressApi.setAddressDefault(addressId);
      const { data, status, message } = response;
      const success_status = [200, 201, 204];
      if (success_status.includes(status)) {
        //   ✅ Gọi lại API để refresh data
        yield this.getListAddress(customerId);
        yield this.getAddressDefault(customerId);
        this.status = status;
        this.successMsg = message;
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

  *getVoucherDetail(id: string) {
    try {
      this.idVoucher = id;
      const response: ResponsePromise = yield voucherApi.getById(id);
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
  //   // * : generator function
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

  //   *createVoucher_give_Customer(id: string, body: any) {
  //     try {
  //       // gọi một hàm bất đồng bộ (API)
  //       const response: ResponsePromise = yield voucherApi.give_customer_voucher(
  //         id,
  //         body
  //       );
  //       const { status, message } = response;
  //       const success_status = [200, 201, 204];
  //       if (success_status.includes(status)) {
  //         yield this.setID_ListCustomer_no_voucher(id);
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
  //   *editVoucher(id: string, body: any) {
  //     try {
  //       // gọi một hàm bất đồng bộ (API)
  //       const response = yield voucherApi.update(id, body);
  //       const { status, message } = response;
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

  setPagination(page: number, pageSize: number) {
    if (page < 1 || pageSize < 1) return;

    this.pagination = {
      ...this.pagination,
      current: page,
      pageSize: pageSize,
    };
  }
}
