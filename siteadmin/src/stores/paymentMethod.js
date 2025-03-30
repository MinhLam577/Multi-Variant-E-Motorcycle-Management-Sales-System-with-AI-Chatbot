import { makeAutoObservable } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints.ts";

export default class PaymentMethodObservable {
    status = 50;
    errorMsg = "";
    successMsg = "";
    rootStore;
    data = {
        payments: [],
        payment_status: [],
        payment_method: [],
    };

    constructor(rootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    *getListPaymentMethod() {
        try {
            const response = yield apiClient.get(
                endpoints.paymentMethod.list()
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.payments = data;
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
    *getMethods() {
        try {
            const response = yield apiClient.get(
                endpoints.paymentMethod.getPaymentName()
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.payment_method = data;
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

    *getPaymentStatus() {
        try {
            const response = yield apiClient.get(
                endpoints.paymentMethod.getPaymentStatus()
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.status = status;
                this.successMsg = message;
                this.data.payment_status = data;
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
}
