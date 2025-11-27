import { flow, makeAutoObservable } from "mobx";
import { RootStore } from "./base";
import { flattenObject, getErrorMessage } from "@/utils";
import LoginAPI from "@/api/login.api";
import { ApiResponse } from "@/types/api-response.type";
import {
    ForgotPassword,
    LoginResponse,
    LoginStatus,
    RegisterDto,
} from "@/types/userLogin.type";
import { ResetPassword, VerifyResetPassword } from "@/types/auth-validate.type";
import { SUCCESS_STATUSES } from "@/constants";
import { AxiosResponse } from "axios";
import { VerifyCodeDto } from "../types/userLogin.type";

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
                register: flow,
                verifyResetPassword: flow,
                verifyCode: flow,
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
        showSuccessMsg = false,
        onSuccess,
    }: {
        apiCall: () => Promise<AxiosResponse<ApiResponse<T>, any>>;
        successStatus: LoginStatus | ForgotPassword | number;
        errorStatus: LoginStatus | ForgotPassword | number;
        defaultErrorMessage: string;
        showSuccessMsg?: boolean;
        onSuccess?: (data: T, message: string) => Promise<void> | void;
    }) {
        try {
            const { data, status, message }: ApiResponse<T> = yield apiCall();
            const msg = typeof message === "string" ? message : message?.[0];
            const isSuccess =
                (typeof status === "number" &&
                    SUCCESS_STATUSES.includes(status)) ||
                (typeof status === "boolean" && status);
            if (!isSuccess) {
                this.status = errorStatus;
                this.errorMsg = msg;
                this.rootStore.errorMsg = msg;
                this.rootStore.status = errorStatus as number;
                return;
            }

            if (onSuccess) {
                yield onSuccess(data, msg);
            }

            this.status = successStatus;
            this.successMsg = msg;
            this.rootStore.status = successStatus as number;
            this.rootStore.successMsg = msg;
            this.rootStore.showSuccessMsg = showSuccessMsg;
        } catch (error) {
            const errorMessage = getErrorMessage(error, defaultErrorMessage);
            this.status = errorStatus;
            this.errorMsg = errorMessage;
            this.rootStore.status = errorStatus as number;
            this.rootStore.errorMsg = errorMessage;
            console.error(defaultErrorMessage, error);
        }
    }

    // call api login
    *login(email: string, password: string, remember: boolean) {
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
                        flattenObject({
                            ...data,
                            remember,
                        })
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
            showSuccessMsg: true,
            defaultErrorMessage: "Quên mật khẩu thất bại",
        });
    }

    *verifyResetPassword(verifyData: VerifyResetPassword) {
        yield this.handleApiCall({
            apiCall: () => LoginAPI.verifyResetPassword(verifyData),
            defaultErrorMessage:
                "Xác thực người dùng thất bại. Vui lòng thử lại sau",
            errorStatus: 400,
            showSuccessMsg: true,
            successStatus: 200,
        });
    }
    *resetPassword(resetData: ResetPassword) {
        yield this.handleApiCall({
            apiCall: () => LoginAPI.resetPassword(resetData),
            defaultErrorMessage: "Reset mật khẩu thất bại",
            errorStatus: 500,
            showSuccessMsg: true,
            successStatus: 200,
        });
    }
    *register(data: RegisterDto) {
        yield this.handleApiCall({
            apiCall: async () => {
                return await LoginAPI.register(data);
            },
            errorStatus: 400,
            successStatus: 200,
            showSuccessMsg: true,
            defaultErrorMessage:
                "Có lỗi xảy ra khi đăng kí. Vui lòng thử lại sau",
        });
    }
    *verifyCode(data: VerifyCodeDto) {
        yield this.handleApiCall({
            apiCall: async () => {
                return await LoginAPI.verifyCode(data);
            },
            successStatus: 200,
            errorStatus: 400,
            defaultErrorMessage:
                "Xảy ra lỗi khi xác thực mã đăng kí. Vui lòng thử lại sau",
        });
    }
    *retryAccount(email: string) {
        yield this.handleApiCall({
            apiCall: async () => {
                return LoginAPI.retryAccount(email);
            },
            errorStatus: 400,
            successStatus: 200,
            showSuccessMsg: true,
            defaultErrorMessage:
                "Lỗi xảy ra khi tái kích hoạt tài khoản. Vui lòng thử lại sau",
        });
    }
    *logout() {
        yield this.rootStore.accountObservable.clearAccount();
    }
}

export default LoginObservable;
