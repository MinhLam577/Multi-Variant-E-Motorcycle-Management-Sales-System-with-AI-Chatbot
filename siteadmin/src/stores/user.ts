import { action, makeObservable, observable } from "mobx";
import secureLocalStorage from "react-secure-storage";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";
import { keyStorageAccount } from "../constants";
import { paginationData, RootStore } from "./base";
import { getErrorMessage } from "src/utils";
import { LoginStatus, UpdateProfileStatus } from "src/types/userLogin.type";

class UserObservable {
    roles = null;
    me = null;
    status: UpdateProfileStatus = null;
    rootStore: RootStore = null;
    errorMsg: string = "";
    account = null;
    pagination: paginationData = {
        current: 1,
        pageSize: 10,
    };
    constructor(rootStore: RootStore) {
        makeObservable(this, {
            // getMe: action.bound,
            me: observable,
            status: observable,
            updateUserProfile: action.bound,
        });
        this.rootStore = rootStore;
    }

    async updateUserProfile(dto, userId) {
        this.status = UpdateProfileStatus.SUBMITTING;
        try {
            const { data, status } = await apiClient.patch(
                endpoints.user.update(userId),
                dto
            );
            if (status !== 200) {
                this.status = UpdateProfileStatus.UPDATE_FAILED;
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
            this.status = UpdateProfileStatus.UPDATE_SUCCESS;
        } catch (error) {
            console.log("error", error);
            const errorMessage = getErrorMessage(
                error,
                "Cập nhật thông tin người dùng thất bại"
            );
            this.status = UpdateProfileStatus.UPDATE_FAILED;
            this.errorMsg = errorMessage;
        }
    }

    clearAccount() {
        secureLocalStorage.removeItem(keyStorageAccount);
        this.account = null;
    }
}

export default UserObservable;
