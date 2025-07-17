import { makeAutoObservable } from "mobx";
import { RootStore } from "./base";
import { getErrorMessage } from "src/utils";
import LoginAPI from "src/api/login.api";

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
            const { data, status, message } = yield LoginAPI.login(
                email,
                password
            );

            if (status !== 200 && !data?.userId) {
                this.status = "loginFailed";
                this.errorMsg = message;
                return;
            }
            yield this.rootStore.accountObservable.setAccount(data);
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
            const { data, status, message } = yield LoginAPI.getAccount(email);
            if (status !== 200 && !data?.userId) {
                this.status = "loginFailed";
                this.errorMsg = message;
                return;
            }
            yield this.rootStore.accountObservable.setAccount(data);

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
            const { data, status } = yield LoginAPI.forgotPassword(email);
            if (status !== 200) {
                this.status = "forgotPasswordFailed";
                this.errorMsg = "Email không tồn tại!";
                return;
            }
            this.status = "forgotPasswordSuccess";
        } catch (error) {
            const errorMessage = getErrorMessage(
                error,
                "Quên mật khẩu thất bại"
            );
            this.status = "forgotPasswordFailed";
            this.errorMsg = errorMessage;
        }
    }

    *logout() {
        yield this.rootStore.accountObservable.clearAccount();
    }
}

export default LoginObservable;
