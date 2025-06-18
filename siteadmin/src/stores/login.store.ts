import { makeAutoObservable } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";
import { RootStore } from "./base";
import { handleErrorMessage } from "../api/handleErrorMessage";
import { getErrorMessage } from "src/utils";

export class LoginObservable {
    errorMsg: string = "";
    status: string = "initial";
    successMsg: string = "";
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }
    // call api login
    *login(email: string, password: string) {
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
            // yield this.rootStore.userObservable.getMe(data.userId);
            this.status = "loginSuccess";
            this.successMsg = message;
        } catch (error) {
            const errorMessage = getErrorMessage(error, "Đăng nhập thất bại");
            this.status = "loginFailed";
            this.errorMsg = errorMessage;
        }
    }

    *getAccountApi(email: string) {
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
            // yield this.rootStore.userObservable.getMe(data.userId);

            this.status = "loginSuccess";
            this.successMsg = message;
        } catch (error) {
            const errorMessage = getErrorMessage(
                error,
                "Lấy thông tin tài khoản thất bại"
            );
            this.status = "loginFailed";
            this.errorMsg = errorMessage;
        }
    }
    //forgot password
    *forgotPassword(email: string) {
        try {
            const { data, status } = yield apiClient.post(
                endpoints.authAdmin.forgotPassword,
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
