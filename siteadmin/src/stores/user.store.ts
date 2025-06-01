import { makeAutoObservable, toJS } from "mobx";
import { RootStore } from "./base";
import { paginationData } from "./voucher";
import { convertDate, filterEmptyFields, getErrorMessage } from "src/utils";
import { DateTimeFormat, RoleEnum } from "src/constants";
import UserAPI from "src/api/user.api";

export type ReceiveAddressResponseType = {
    id: string;
    receiver_name: string;
    receiver_phone: string;
    address: string;
    postal_code: string;
    note: string;
};

export type PermissionType = {
    id: string;
    name: string;
    path: string;
    method: string;
    module: string;
};
export type RoleType = {
    id: string;
    name: RoleEnum;
    permissions: PermissionType[];
};

export enum GenderEnum {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other",
}

export class UpdateUserDto {
    username?: string;
    email?: string;
    age?: number;
    address?: string;
    phoneNumber?: string;
    gender?: GenderEnum;
    avatarUrl?: string;
    Roles?: RoleEnum;
    birthday?: string | null;
}

export type UpdateUserStaffType = {};

export type UserStaffResponseType = {
    id: string;
    username: string;
    email: string;
    age: number;
    address: string;
    avatarUrl: string;
    phoneNumber: string | null;
    birthday: string | null;
    gender: GenderEnum;
    joinedAt: string;
    isActive: boolean;
    roles: RoleType[];
};

export type CustomerResponseType = {
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
    avatarUrl: string;
};

export type globalFiltersDataUserStaff = {
    search?: string;
    sortOrder?: string;
    created_from?: string;
    created_to?: string;
    status?: boolean;
};

export type userStoreData = {
    listData: UserStaffResponseType[];
    detail: UserStaffResponseType | null;
};

class UserStaffObservable {
    rootStore: RootStore;
    pagination: paginationData = {
        current: 1,
        pageSize: 10,
    };
    data: userStoreData = {
        listData: [],
        detail: null,
    };
    loading: boolean = false;
    globalFilter: globalFiltersDataUserStaff = {
        search: undefined,
        sortOrder: undefined,
        created_from: undefined,
        created_to: undefined,
        status: undefined,
    };
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this, {}, { autoBind: true });
    }

    private validateQuery(query?: string | object): string {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: globalFiltersDataUserStaff & paginationData = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query),
            current: Number(this.pagination.current),
            pageSize: Number(this.pagination.pageSize),
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFiltersDataUserStaff =
            filterEmptyFields({
                ...this.globalFilter,
                ...this.pagination,
                ...parsedQuery,
                created_from: parsedQuery?.created_from
                    ? convertDate(
                          parsedQuery.created_from,
                          DateTimeFormat.Date,
                          DateTimeFormat.TIME_STAMP_POSTGRES
                      )
                    : undefined,
                created_to: parsedQuery?.created_to
                    ? convertDate(
                          parsedQuery.created_to,
                          DateTimeFormat.Date,
                          DateTimeFormat.TIME_STAMP_POSTGRES
                      )
                    : undefined,
                search: parsedQuery?.search?.trim(),
            });

        // Tạo query string
        const queryString = new URLSearchParams(
            Object.fromEntries(
                Object.entries(filters).map(([key, value]) => [
                    key,
                    String(value),
                ])
            )
        ).toString();
        return queryString;
    }

    *getListUser(query: string | object) {
        try {
            this.loading = true;
            const queryString = this.validateQuery(query);
            const response = yield UserAPI.list(queryString);
            const { data, status, message } = response;
            const resData = data?.data;
            const success_status = [200, 201, 204];
            const newUrl = `${window.location.pathname}?${queryString}`;
            window.history.pushState({ path: newUrl }, "", newUrl);
            if (success_status.includes(status)) {
                this.data.listData = resData;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = false;
            } else {
                this.data.listData = [];
                this.rootStore.status = status;
                this.rootStore.showSuccessMsg = false;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
            }
        } catch (e: any) {
            console.error(e);
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình lấy danh sách người dùng, vui lòng thử lại sau."
            );
            this.rootStore.status = 500;
            this.rootStore.errorMsg = errorMessage;
        } finally {
            this.loading = false;
        }
    }

    *getUserById(id: string) {
        try {
            this.loading = true;
            const response = yield UserAPI.getUserDetails(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.detail = data;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
                this.data.detail = null;
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = e?.response?.status || 500;
            this.rootStore.errorMsg = e?.response?.data?.message || e.message;
        } finally {
            this.loading = false;
        }
    }

    *updateUserById(id: string, data: UpdateUserDto) {
        try {
            this.loading = true;
            const response = yield UserAPI.update(id, data);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = e?.response?.status || 500;
            this.rootStore.errorMsg = e?.response?.data?.message || e.message;
            return false;
        } finally {
            this.loading = false;
        }
    }

    *removeUserById(id: string) {
        try {
            this.loading = true;
            const response = yield UserAPI.remove(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình xóa người dùng, vui lòng thử lại sau."
            );
            this.rootStore.errorMsg = errorMessage;
            return false;
        } finally {
            this.loading = false;
        }
    }

    setPagination(pagination: paginationData) {
        this.pagination = {
            ...this.pagination,
            ...pagination,
        };
        this.getListUser({
            ...this.globalFilter,
            ...this.pagination,
        });
    }
}

export default UserStaffObservable;
