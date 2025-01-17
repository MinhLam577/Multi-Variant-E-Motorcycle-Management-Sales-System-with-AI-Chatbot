import { action, makeAutoObservable, observable } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";
import { RootStore } from "./base";

class BrandObservable {
  errorMsg = "";
  status = "initial";
  listBrand = [];
  rootStore = RootStore;
  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }
  // constructor() {
  //   makeObservable(this, {
  //     listBrand: observable,
  //     getListBrand: action.bound,
  //   });
  // }

  *getListBrand({ page, size }) {
    this.status = "submitting";
    try {
      const { data, status } = yield apiClient.get(
        endpoints.brand.list(page, size)
      );

      if (status !== 200 && !data) {
        this.status = "loginFailed";
        this.errorMsg = "Email hoặc mật khẩu không đúng!";
        return;
      }

      this.listBrand = data?.data;
      this.status = "fetchSuccess";
    } catch (error) {
      this.status = "fetchFailed";
      this.errorMsg = error?.message;
    }
  }
}

export default BrandObservable;
