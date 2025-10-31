import { flow, makeAutoObservable } from "mobx";
import { RootStore } from "./base";
import { flattenObject, getErrorMessage } from "src/utils";
import LoginAPI from "src/api/login.api";
import { ApiResponse } from "src/types/api-response.type";
import {
    ForgotPassword,
    LoginResponse,
    LoginStatus,
} from "src/types/userLogin.type";
import {
    ResetPassword,
    VerifyResetPassword,
} from "src/types/auth-validate.type";
import { SUCCESS_STATUSES } from "src/constants";
import { AxiosResponse } from "axios";

export class LoginObservable {
    errorMsg: string = "";
    status: LoginStatus | ForgotPassword | number = LoginStatus.INITIAL;
    successMsg: string = "";
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(
            this,
            {
                handleApiCall: flow,
                login: flow,
                forgotPassword: flow,
                resetPassword: flow,
                verifyResetPassword: flow,
            },
            { autoBind: true }
        );
    }

    // Hàm tổng quát để xử lý API call
    *handleApiCall<T extends object>({
        apiCall,
        successStatus,
        errorStatus,
        defaultErrorMessage,
        onSuccess,
    }: {
        apiCall: () => Promise<AxiosResponse<ApiResponse<T>, any>>;
        successStatus: LoginStatus | ForgotPassword | number;
        errorStatus: LoginStatus | ForgotPassword | number;
        defaultErrorMessage: string;
        onSuccess?: (data: T, message: string) => Promise<void> | void;
    }) {
        try {
            const { data, status, message }: ApiResponse<T> = yield apiCall();
            const msg =
                typeof message === "string" ? message : message?.join(", ");
            const isSuccess =
                status &&
                typeof status === "number" &&
                SUCCESS_STATUSES.includes(status);
            if (!isSuccess) {
                this.status = errorStatus;
                this.errorMsg = msg;
                return;
            }

            if (onSuccess) {
                yield onSuccess(data, msg);
            }

            this.status = successStatus;
            this.successMsg = msg;
        } catch (error) {
            const errorMessage = getErrorMessage(error, defaultErrorMessage);
            this.status = errorStatus;
            this.errorMsg = errorMessage;
            console.error(defaultErrorMessage, error);
        }
    }

    // call api login
    *login(email: string, password: string) {
        yield this.handleApiCall<LoginResponse>({
            apiCall: () => {
                this.status = LoginStatus.SUBMITTING;
                return LoginAPI.login(email, password);
            },
            successStatus: LoginStatus.LOGIN_SUCCESS,
            errorStatus: LoginStatus.LOGIN_FAILED,
            defaultErrorMessage: "Đăng nhập thất bại",
            onSuccess: (data) => {
                if (data && data.user?.userId) {
                    return this.rootStore.accountObservable.setAccount(
                        flattenObject(data)
                    );
                }
                this.status = LoginStatus.LOGIN_FAILED;
                this.errorMsg = "Không tìm thấy thông tin người dùng";
            },
        });
    }

    *forgotPassword(email: string) {
        yield this.handleApiCall({
            apiCall: () => LoginAPI.forgotPassword(email),
            errorStatus: ForgotPassword.FORGOT_PASSWORD_FAILED,
            successStatus: ForgotPassword.FORGOT_PASSWORD_SUCCESS,
            defaultErrorMessage: "Quên mật khẩu thất bại",
        });
    }

    *verifyResetPassword(verifyData: VerifyResetPassword) {
        yield this.handleApiCall({
            apiCall: () => LoginAPI.verifyResetPassword(verifyData),
            defaultErrorMessage:
                "Xác thực người dùng thất bại. Vui lòng thử lại sau",
            errorStatus: 500,
            successStatus: 200,
        });
    }
    *resetPassword(resetData: ResetPassword) {
        yield this.handleApiCall({
            apiCall: () => LoginAPI.resetPassword(resetData),
            defaultErrorMessage: "Reset mật khẩu thất bại",
            errorStatus: 500,
            successStatus: 200,
        });
    }
    *logout() {
        yield this.rootStore.accountObservable.clearAccount();
    }
}

export default LoginObservable;
