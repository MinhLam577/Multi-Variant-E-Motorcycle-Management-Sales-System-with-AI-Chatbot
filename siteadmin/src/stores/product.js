import { action, flow, makeObservable, observable } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints.ts";
import { RequestStatus } from "../constants";

class ProductObservable {
    status = RequestStatus.INITIAL;
    listCar = [];
    listEMotorbike = [];
    constructor() {
        makeObservable(this, {
            listCar: observable,
            listEMotorbike: observable,
            getListMotorBike: flow,
        });
    }
    // get e-motor color
    // get e-motor category
    // get e-motor brand
    *getEMotorColor() {
        this.status = RequestStatus.SUBMITTING;
        try {
            const { data, status } = yield apiClient.get(
                endpoints.motorbike.color
            );
            if (status !== 200) {
                this.status = RequestStatus.FETCH_FAILED;
                return;
            }
        } catch (error) {
            this.status = RequestStatus.FETCH_FAILED;
        }
    }

    *getListMotorBike({ page, size }) {
        this.status = RequestStatus.SUBMITTING;
        try {
            const { data, status } = yield apiClient.get(
                endpoints.motorbike.list(page, size)
            );
            if (status !== 200) {
                this.status = RequestStatus.FETCH_FAILED;
                return;
            }
            this.listEMotorbike = data;
            this.status = RequestStatus.FETCH_SUCCESS;
        } catch (error) {
            this.status = RequestStatus.FETCH_FAILED;
            return error?.message;
        }
    }
}

export default ProductObservable;
