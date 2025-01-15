import { action, makeObservable, observable } from "mobx";
import secureLocalStorage from "react-secure-storage";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";
import { keyStorageAccount } from "../constants";

class UserObservable {
  roles = null;
  me = null;
  constructor() {
    makeObservable(this, {
      getMe: action.bound,
      me: observable,
      updateUserProfile: action.bound,
    });
  }

  async getMe(userId) {
    this.status = "submitting";
    try {
      const { data, status } = await apiClient.get(endpoints.user.me, {
        id: userId,
      });

      if (status !== 200) {
        this.status = "fetchFailed";
        this.errorMsg = "Email hoặc mật khẩu không đúng!";
        return;
      }
      this.me = data;
      this.status = "fetchSuccess";
    } catch (error) {
      this.status = "fetchFailed";
      this.errorMsg = error?.message;
    }
  }

  async updateUserProfile(dto, userId) {
    this.status = "submitting";
    try {
      const { data, status } = await apiClient.patch(
        endpoints.user.update(userId),
        dto
      );

      if (status !== 200) {
        this.status = "updateFailed";
        this.errorMsg = "Cập nhật thông tin thất bại!";
        return;
      }
      this.me = data;
      this.status = "updateSuccess";
    } catch (error) {
      console.log("error", error);
      this.status = "updateFailed";
      this.errorMsg = error?.message;
    }
  }

  clearAccount() {
    secureLocalStorage.removeItem(keyStorageAccount);
    this.account = null;
  }
}

export default UserObservable;
