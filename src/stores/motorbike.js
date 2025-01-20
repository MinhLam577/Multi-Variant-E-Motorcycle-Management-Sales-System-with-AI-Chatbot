import { action, flow, makeObservable, observable } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";
import { RequestStatus } from "../constants";

class EMotorbikeObservable {
  status = RequestStatus.INITIAL;
  listEMotorbike = [];
  listColor = [];
  listCategory = [];
  listBrand = [];
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
    });
  }
  //get all config
  *getAllConfig() {
    this.status = RequestStatus.SUBMITTING;
    try {
      yield Promise.all([this.getColor(), this.getCategory(), this.getBrand()]);
      this.status = RequestStatus.FETCH_SUCCESS;
    } catch (error) {
      console.log("errorerror", error);
      this.status = RequestStatus.FETCH_FAILED;
    }
  }

  // get e-motor color
  *getColor() {
    this.status = RequestStatus.SUBMITTING;
    try {
      const { data, status } = yield apiClient.get(endpoints.motorbike.color);
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
      const { data, status } = yield apiClient.get(endpoints.motorbike.brand);
      this.listBrand = data?.data;
      console.log("data?.data?.colors", data?.data);

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
