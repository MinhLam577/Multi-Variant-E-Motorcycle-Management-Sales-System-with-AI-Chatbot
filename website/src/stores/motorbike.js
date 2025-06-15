import { flow, makeObservable, observable } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints.ts";
import { RequestStatus } from "../constants";

class EMotorbikeObservable {
    status = RequestStatus.INITIAL;
    listEMotorbike = [];
    listColor = [];
    listCategory = [];
    listBrand = [];
    detail = null;
    constructor() {
        makeObservable(this, {
            listEMotorbike: observable,
            getColor: flow,
            getCategory: flow,
            getBrand: flow,
            listColor: observable,
            listCategory: observable,
            listBrand: observable,
            getAllConfig: flow,
            detail: observable,
            getDetail: flow,
            status: observable,
            updateMotorbike: flow,
        });
    }
    //get all config
    *getAllConfig() {
        try {
            yield Promise.all([
                this.getColor(),
                this.getCategory(),
                this.getBrand(),
            ]);
        } catch (error) {
            return;
        }
    }
    //get detail
    *getDetail(id) {
        this.status = RequestStatus.SUBMITTING;
        try {
            const { data, status } = yield apiClient.get(
                endpoints.motorbike.details(id)
            );

            if (status !== 200) {
                this.status = RequestStatus.FETCH_DETAIL_FAILED;
                return;
            }

            this.detail = data?.product;
            this.status = RequestStatus.FETCH_DETAIL_SUCCESS;
        } catch (error) {
            console.log("error", error);
            this.status = RequestStatus.FETCH_DETAIL_FAILED;
        }
    }
    //get detail
    *updateMotorbike({ form, id }) {
        this.status = RequestStatus.SUBMITTING;
        try {
            const { data, status } = yield apiClient.patch(
                endpoints.motorbike.details(id),
                form
            );

            if (status !== 200) {
                this.status = RequestStatus.FETCH_DETAIL_FAILED;
                return;
            }

            // this.detail = data?.product;
            this.status = RequestStatus.FETCH_DETAIL_SUCCESS;
        } catch (error) {
            console.log("error", error);
            this.status = RequestStatus.FETCH_DETAIL_FAILED;
        }
    }

    // get e-motor color
    *getColor() {
        this.status = RequestStatus.SUBMITTING;
        try {
            const { data, status } = yield apiClient.get(
                endpoints.motorbike.color
            );
            if (status !== 200) {
                this.status = RequestStatus.FETCH_FAILED;
                return;
            }

            this.listColor = data?.colors;
            this.status = RequestStatus.FETCH_SUCCESS;
        } catch (error) {
            this.status = RequestStatus.FETCH_FAILED;
        }
    }

    // get e-motor category
    *getCategory() {
        this.status = RequestStatus.SUBMITTING;
        try {
            const { data, status } = yield apiClient.get(
                endpoints.motorbike.categories
            );

            this.listCategory = data?.data;
            this.status = RequestStatus.FETCH_SUCCESS;
        } catch (error) {
            this.status = RequestStatus.FETCH_FAILED;
        }
    }

    // get e-motor brand
    *getBrand() {
        this.status = RequestStatus.SUBMITTING;
        try {
            const { data, status } = yield apiClient.get(
                endpoints.motorbike.brand
            );
            this.listBrand = data?.data;

            this.status = RequestStatus.FETCH_SUCCESS;
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

export default EMotorbikeObservable;
