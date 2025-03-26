import { flow, makeAutoObservable, toJS } from "mobx";
import { RootStore } from "./base";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";
import { handleResponse } from "../api/handleErrorMessage";

export default class OrderObservable {
    status = "";
    errorMsg = "";
    successMsg = "";
    rootStore;
    data = [];
    constructor(rootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    getListOrder = flow(function* (query) {
        try {
            const response = yield apiClient.get(endpoints.order.list(query));
            if (!response) {
                this.status = "error";
                this.errorMsg = "Không thể lấy dữ liệu";
                return;
            }
            const success_status = [200, 201, 204];
            const { status, message, data } = handleResponse(
                response,
                "Lấy danh sách đơn hàng thất bại"
            );
            if (success_status.includes(status)) {
                this.data = toJS(data);
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
            return this.data;
        } catch (e) {
            this.status = 500;
            this.errorMsg = e?.message;
        }
    });
    setStatus(status) {
        this.status = status;
    }

    setData(data) {
        this.data = data;
    }
}
