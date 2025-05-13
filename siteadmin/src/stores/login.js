import { makeAutoObservable } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints.ts";
import { RootStore } from "./base";
import { handleErrorMessage } from "../api/handleErrorMessage";

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
        this.status = "submitting";
        try {
            const { data, status, message } = yield apiClient.post(
                endpoints.authAdmin.login,
                {
                    email,
                    password,
                }
            );

            if (status !== 200 && !data?.userId) {
                this.status = "loginFailed";
                this.errorMsg = message;
                return;
            }
            yield this.rootStore.accountObservable.setAccount(data);
            yield this.rootStore.userObservable.getMe(data.userId);
            // goi api account

            this.status = "loginSuccess";
            this.successMsg = message;
        } catch (error) {
            this.status = "loginFailed";
            this.errorMsg = error?.message;
        }
    }

    *getAccountApi(email) {
        this.status = "submitting";
        try {
            const { data, status, message } = yield apiClient.post(
                endpoints.authAdmin.getAccount,
                {
                    email,
                }
            );
            if (status !== 200 && !data?.userId) {
                this.status = "loginFailed";
                this.errorMsg = message;
                return;
            }
            yield this.rootStore.accountObservable.setAccount(data);
            yield this.rootStore.userObservable.getMe(data.userId);
            // goi api account

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

    *logout() {
        yield this.rootStore.accountObservable.clearAccount();
    }
}

export default LoginObservable;
