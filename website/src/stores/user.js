import { action, makeObservable, observable } from "mobx";
import secureLocalStorage from "react-secure-storage";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints.ts";
import { keyStorageAccount } from "../constants";

class UserObservable {
  roles = null;
  me = null;
  status = null; // Thêm dòng này để trạng thái có thể theo dõ
  rootStore = null; // Thêm rootStore để lưu trữ tham chiếu
  constructor(rootStore) {
    makeObservable(this, {
      getMe: action.bound, //marks a method as an action that will modify the state. Giữ ngữ cảnh của this:
      me: observable, // lưu trữ state, theo dõi sự thay đổi ,me thay đổi, component sẽ tự động render lại!
      status: observable, // Cần khai báo trạng thái là observable
      updateUserProfile: action.bound, //// được bind với instance
    });
    this.rootStore = rootStore; // Gán rootStore
  }

  async getMe(userId) {
    this.status = "submitting";
    try {
      const { data, status } = await apiClient.get(endpoints.user.me(userId));

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

      // Gán dữ liệu người dùng vào this.me
      const { Roles, ...editData } = data;
      this.me = {
        ...editData,
        Roles:
          Roles && Array.isArray(Roles) && Roles.length > 0
            ? Roles[0].name
            : null,
      };
      // Lấy thông tin tài khoản hiện tại từ accountObservable
      const getData = await this.rootStore.accountObservable.getAccount();
      if (getData && typeof getData === "object" && getData !== null) {
        const newData = {
          ...this.me, // Dữ liệu người dùng đã cập nhật
          refreshToken: getData.refresh_token || "",
          access_token: getData.access_token || "",
        };
        await this.rootStore.accountObservable.setAccount(newData);
      }
      this.status = "updateSuccess";
    } catch (error) {
      console.log("error", error);
      this.status = "updateFailed";
      this.errorMsg = error?.message;
    }
  }
  async changePassword_Profile(ChangePassword) {
    try {
      const { status, message } = await apiClient.post(
        endpoints.customers.changePassword_inProfile,
        ChangePassword
      );

      if (status !== 200) {
        this.status = status || "fail";
        this.errorMsg = message;
        return;
      }
      this.status = 200;
      this.message = message;
    } catch (error) {
      this.status = "fetchFailed";
      this.errorMsg = error?.message;
    }
  }

  clearAccount() {
    secureLocalStorage.removeItem(keyStorageAccount);
    this.account = null;
  }
}

export default UserObservable;
