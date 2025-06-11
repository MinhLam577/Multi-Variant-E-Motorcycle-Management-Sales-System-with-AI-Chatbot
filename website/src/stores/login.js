import { makeAutoObservable } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints.ts";
import { RootStore } from "./base";
import { handleErrorMessage } from "../api/handleErrorMessage";
import axios from "axios";

export class LoginObservable {
  errorMsg = "";
  successMsg = "";
  status = "initial";
  code = "";
  rootStore = RootStore;
  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }
  // call api login
  *login(email, password) {
    this.status = "submitting";
    try {
      const { data, status, message } = yield apiClient.post(
        endpoints.auth.login,
        {
          email,
          password,
        }
      );

      if (status !== 200 && !data?.userId) {
        this.status = "loginFailed";
        this.errorMsg = message;
        if (
          message ==
          "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản nha"
        )
          this.code = 2;
        return;
      }
      yield this.rootStore.accountObservable.setAccount(data);
      yield this.rootStore.userObservable.getMe(data.userId);
      this.status = "loginSuccess";
      this.successMsg = message;
    } catch (error) {
      this.status = "loginFailed";
      this.errorMsg = error?.message;
    }
  }
  //forgot password
  *forgotPassword(email) {
    try {
      const { data, status } = yield apiClient.post(
        endpoints.auth.forgotPassword,
        {
          email,
        }
      );
      if (status !== 200) {
        this.status = "forgotPasswordFailed";
        this.errorMsg = "Email không tồn tại!";
        return;
      }
      this.status = "forgotPasswordSuccess";
    } catch (error) {
      this.status = "forgotPasswordFailed";
      this.errorMsg = handleErrorMessage(error);
    }
  }

  catch(error) {
    this.status = "loginFailed";
    this.errorMsg = handleErrorMessage(error);
  }
  // call api login
  *getProfile_ByGoogle(token) {
    this.status = "submitting";
    try {
      const { data } = yield axios.get(
        process.env.NEXT_PUBLIC_BACK_END_API_BASE_URL +
          endpoints.customers.loginGoogle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      yield this.rootStore.accountObservable.setAccount(data.data);
      // yield this.rootStore.userObservable.getMe(data.userId);
      this.status = "loginSuccess";
      this.successMsg = "Đăng nhập thành công";
    } catch (error) {
      this.status = "loginFailed";
      this.errorMsg = error?.message;
    }
  }

  *logout() {
    yield this.rootStore.accountObservable.clearAccount();
  }
}

export default LoginObservable;
