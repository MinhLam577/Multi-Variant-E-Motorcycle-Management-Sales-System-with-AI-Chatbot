import { flow, makeAutoObservable } from "mobx";
import { ResponsePromise } from "@/api";
import { MessageStore, paginationData, RootStore } from "./base";
import voucherApi from "@/api/voucher";
import { TypeVoucher, Voucher } from "@/types/voucher.type";

export default class VoucherObservable implements MessageStore {
    status?: number;
    successMsg?: string;
    errorMsg?: string;
    showSuccessMsg?: boolean;
    rootStore: RootStore;
    data: Voucher[] = null;
    dataUser = null;
    typeVoucher: TypeVoucher[] = [];
    dataDetail: Voucher;
    dataListCustomer_no_voucher = [];
    idVoucher: string = "";
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    loading: boolean = false;
    isOpenDetail: boolean = false;
    constructor(rootStore: RootStore) {
        makeAutoObservable(
            this,
            {
                getListCustomer_no_voucher: flow,
                getListTypeVoucher: flow,
                getListVoucher: flow,
                getVoucherDetail: flow,
                setID_ListCustomer_no_voucher: flow,
                deleteVoucherByID: flow,
                createVoucher: flow,
                createVoucher_give_Customer: flow,
                editVoucher: flow,
            },
            { autoBind: true }
        );
        this.rootStore = rootStore;
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
    // cập nhật id
    *setID_ListCustomer_no_voucher(id: string) {
        try {
            this.idVoucher = id;
            // lấy ra danh sách customer no voucher theo id voucher
            const response = yield voucherApi.getListCustomer_no_Voucher(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.dataListCustomer_no_voucher = data;
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
    *deleteVoucherByID(id: string) {
        try {
            // gọi một hàm bất đồng bộ (API)
            const response: ResponsePromise = yield voucherApi.delete(id);
            const { data, status, message } = response;
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
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // ✅ Gọi lại API để refresh data
                yield this.getListVoucher();
                this.status = status;
                this.successMsg = message;
                return true;
            } else {
                this.status = status;
                this.errorMsg = message;
                return false;
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
            const response: ResponsePromise =
                yield voucherApi.give_customer_voucher(id, body);
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
    *editVoucher(id: string, body: any) {
        try {
            // gọi một hàm bất đồng bộ (API)
            const response = yield voucherApi.update(id, body);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // ✅ Gọi lại API để refresh data
                yield this.getListVoucher();
                this.status = status;
                this.successMsg = message;
                return true;
            } else {
                this.status = status;
                this.errorMsg = message;
                return false;
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
    clearMessage() {
        this.status = undefined;
        this.successMsg = undefined;
        this.errorMsg = undefined;
    }

    setStatusMessage(status: number, errorMsg: string, successMsg: string) {
        this.status = status;
        this.errorMsg = errorMsg;
        this.successMsg = successMsg;
    }
}
