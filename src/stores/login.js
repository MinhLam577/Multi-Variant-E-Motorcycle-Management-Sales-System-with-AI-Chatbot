import { makeAutoObservable } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";
import { RootStore } from "./base";

export class LoginObservable {
  errorMsg = "";
  status = "initial";
  rootStore = RootStore;
  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  // call api login
  *login(email, password) {
    this.email = email;
    this.status = "submitting";
    try {
      // Call oauth/login
      const { data, status } = yield apiClient.post(endpoints.auth.login, {
        email,
        password,
      });

      if (status !== 200) {
        this.status = "loginFailed";
        this.errorMsg = "Email hoặc mật khẩu không đúng!";
        return;
      }
      this.rootStore.accountObservable.setAccount(data);
      this.status = "loginSuccess";
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
    } catch (error) {
      this.status = "forgotPasswordFailed";
      this.errorMsg = error?.message;
    }
  }
}

export default LoginObservable;
