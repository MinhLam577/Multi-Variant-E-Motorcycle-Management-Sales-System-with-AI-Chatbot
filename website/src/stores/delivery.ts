import { makeAutoObservable, toJS } from "mobx";

import { DateTimeFormat } from "../constants";
import OrderAPI, { ExportOrder, ResponsePromise } from "../api/order";
import { RootStore } from "./base";
import voucherApi from "../api/voucher";
import { AddressApi } from "../api/address";
import { DeliveryApi } from "../api/delivery";

export type TypeVoucher = {
    id: string;
    name_type_voucher: string;
};

export type paginationData = {
    current: number;
    pageSize: number;
};

export default class DeliveryObservable {
    status: number | null = null;
    errorMsg: string | null = null;
    successMsg: string | null = null;
    showSuccessMsg: boolean = false;
    rootStore: RootStore;
    data = {
        listMethodDelivery: [],
        detailDelivery: null,
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
        this.getDetailDelivery = this.getDetailDelivery.bind(this);
        this.getListDelivery = this.getListDelivery.bind(this);
        this.getDeliveryDefault = this.getDeliveryDefault.bind(this);
    }

    *getDetailDelivery(id: string) {
        try {
            this.loading = true;
            const response: ResponsePromise =
                yield DeliveryApi.getDetailDeliveryMethod(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204, true];
            if (success_status.includes(status)) {
                this.data.detailDelivery = data;
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
    // lấy đia chỉ mặc định
    *getDeliveryDefault() {
        try {
            const response = yield DeliveryApi.getListDeliveryMethods();
            const { data, status, message } = response;
            yield this.getDetailDelivery(data[0].id);
        } catch (error) {}
    }
    *getListDelivery() {
        try {
            this.loading = true;
            const response = yield DeliveryApi.getListDeliveryMethods();
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.listMethodDelivery = data;
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
}
