import { makeAutoObservable, toJS } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";
import { RootStore } from "./base";
import { paginationData } from "./voucher";
import { filterEmptyFields, getErrorMessage } from "src/utils";

export type DeliveryMethodResponseType = {
    id: string;
    name: string;
    description: string;
    fee: number;
    logo: string | null;
    updatedAt: string;
    createdAt: string;
    deletedAt: string | null;
};

export type PaymentMethodResponseType = {
    id: string;
    name: string;
    description: string;
    logo: string | null;
};

export default class PaymentMethodObservable {
    status: number = null;
    errorMsg: string = "";
    successMsg: string = "";
    rootStore: RootStore;
    data = {
        payments: [],
        payment_status: [],
        payment_method: [],
    };
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };

    deliveryMethodData: DeliveryMethodResponseType[] = [];

    constructor(rootStore: RootStore) {
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
    }

    private validateQuery(query?: string | object): string {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: paginationData = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query
                  ? query
                  : {}),
            current: Number(this.pagination.current),
            pageSize: Number(this.pagination.pageSize),
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData = filterEmptyFields({
            ...this.pagination,
            ...parsedQuery,
        });

        // Tạo query string
        const queryString = new URLSearchParams(
            Object.fromEntries(
                Object.entries(filters).map(([key, value]) => [
                    key,
                    String(value),
                ])
            )
        ).toString();
        return queryString;
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
        } catch (e: any) {
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
        } catch (e: any) {
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
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *getListDeliveryMethod(query?: object) {
        try {
            const queryString = this.validateQuery(query);
            const response = yield apiClient.get(
                endpoints.deliveryMethod.list(queryString)
            );
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.deliveryMethodData = data;
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = Array.isArray(message) ? message[0] : message;
            }
        } catch (e: any) {
            console.error("Error fetching delivery methods:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể lấy danh sách phương thức giao hàng, vui lòng thử lại sau."
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
        }
    }
}
