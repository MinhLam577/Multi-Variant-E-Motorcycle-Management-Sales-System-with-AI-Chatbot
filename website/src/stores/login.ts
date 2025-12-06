import { makeAutoObservable } from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";
import { RootStore } from "./base";
import axios, { AxiosResponse } from "axios";
import {
    ForgotPasswordStatusProps,
    LoginData,
    LoginResponse,
    LoginStatusProps,
} from "@/types/auth-validate.type";
import { getErrorMessage } from "@/utils/handle-error.utils";
import { SUCCESS_STATUSES } from "../constants";
import { ApiResponse } from "@/types/api-response.type";

export class LoginObservable {
    errorMsg: string = "";
    successMsg: string = "";
    status: LoginStatusProps | ForgotPasswordStatusProps | number;
    data: LoginResponse;
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    // Hàm tổng quát để xử lý API call
    private *handleApiCall<T extends object>({
        apiCall,
        successStatus,
        errorStatus,
        defaultErrorMessage,
        onSuccess,
    }: {
        apiCall: () => Promise<AxiosResponse<ApiResponse<T>, any>>;
        successStatus: LoginStatusProps | ForgotPasswordStatusProps | number;
        errorStatus: LoginStatusProps | ForgotPasswordStatusProps | number;
        defaultErrorMessage: string;
        onSuccess?: (data: T, message: string) => Promise<void> | void;
    }) {
        try {
            const { data, status, message } = yield apiCall();
            const msg =
                typeof message === "string" ? message : message?.join(", ");
            const isSuccess =
                status ||
                (typeof status === "number" &&
                    SUCCESS_STATUSES.includes(status));
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
    *login(loginData: LoginData) {
        this.status = LoginStatusProps.SUBMITTING;
        const { email, password } = loginData;
        yield this.handleApiCall<LoginResponse>({
            apiCall: async () => {
                return await apiClient.post(endpoints.auth.login, {
                    email,
                    password,
                });
            },
            successStatus: LoginStatusProps.LOGIN_SUCCESS,
            errorStatus: LoginStatusProps.LOGIN_FAILED,
            defaultErrorMessage: "Đăng nhập thất bại",
            onSuccess: (data) => {
                if (data && data.user?.userId) {
                    this.rootStore.accountObservable.setAccount(
                        data,
                        loginData.remember
                    );
                    this.data = data;
                    return;
                }
                this.status = LoginStatusProps.LOGIN_FAILED;
                this.errorMsg = "Không tìm thấy thông tin người dùng";
            },
        });
    }
    //forgot password
    *forgotPassword(email: string) {
        yield this.handleApiCall<null>({
            apiCall: async () => {
                return await apiClient.post(endpoints.auth.forgotPassword, {
                    email,
                });
            },
            successStatus: ForgotPasswordStatusProps.FORGOT_PASSWORD_SUCCESS,
            errorStatus: ForgotPasswordStatusProps.FORGOT_PASsWORD_FAILED,
            defaultErrorMessage: "Yêu cầu quên mật khẩu thất bại",
        });
    }

    *changePassword(data) {
        yield this.handleApiCall<null>({
            apiCall: async () => {
                return await apiClient.post(
                    endpoints.auth.changePassword,
                    data
                );
            },
            successStatus: 200,
            errorStatus: 400,
            defaultErrorMessage: "Đổi mật khẩu thất bại",
        });
    }

    // // call api login
    // *getProfile_ByGoogle(token) {
    //     this.status = LoginStatusProps.LOGIN_SUCCESS;
    //     try {
    //         const { data } = yield axios.get(
    //             process.env.NEXT_PUBLIC_BACK_END_API_BASE_URL +
    //                 endpoints.customers.loginGoogle,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );
    //         yield this.rootStore.accountObservable.setAccount(data.data, );
    //         this.status = LoginStatusProps.LOGIN_SUCCESS;
    //         this.successMsg = "Đăng nhập thành công";
    //     } catch (error) {
    //         this.status = LoginStatusProps.LOGIN_FAILED;
    //         this.errorMsg = error?.message;
    //     }
    // }

    *logout() {
        yield this.rootStore.accountObservable.clearAccount();
    }
}

export default LoginObservable;
