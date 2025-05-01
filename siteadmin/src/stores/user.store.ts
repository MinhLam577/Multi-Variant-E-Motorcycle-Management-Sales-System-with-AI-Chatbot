import { makeAutoObservable, toJS } from "mobx";
import { RootStore } from "./base";
import { paginationData } from "./voucher";
import { convertDate, filterEmptyFields } from "src/utils";
import { DateTimeFormat } from "src/constants";
import UserAPI from "src/api/user.api";

const mockUser = {
    id: "b71f1d04-f8ad-439f-bfa0-b1935b415ac1",
    username: "Ngô Đình ",
    email: "ngodinhphuoc1050@gmail.com",
    age: 22,
    address: "Gia ninh quảng ninh ",
    avatarUrl:
        "https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png",
    phoneNumber: "0865448896",
    birthday: "2000-12-31",
    gender: "male",
    joinedAt: "2025-03-31T02:41:09.013Z",
    isActive: true,
    roles: ["admin"],
};
export enum GenderType {
    MALE = "male",
    FEMALE = "female",
}
export enum RoleEnum {
    STAFF = "staff", // Nhân viên
    STORE_MANAGER = "manager", // Quản lý cửa hàng
    ACCOUNTANT = "sale", // Kế toán
    USER = "user", // Customer
    CUSTOMER = "customer", // Khách hàng
    ADMIN = "admin", // Admin
    WAREHOUSE_MANGER = "warehouseManager", // Quản lý kho
    SALES = "sales", // Nhân viên bán hàng
}
export type UserStaffResponseType = {
    id: string;
    username: string;
    email: string;
    age: number;
    address: string;
    avatarUrl: string;
    phoneNumber: string | null;
    birthday: string | null;
    gender: GenderType;
    joinedAt: string;
    isActive: boolean;
    roles: RoleEnum[];
};

export type globalFiltersDataUserStaff = {
    search?: string;
    sortOrder?: string;
    created_from?: string;
    created_to?: string;
    status?: boolean;
};

class UserStaffObservable {
    rootStore: RootStore;
    pagination: paginationData = {
        current: 1,
        pageSize: 10,
    };
    data: UserStaffResponseType[] = [];
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
        console.log("parsedQuery", toJS(parsedQuery));

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
                this.data = resData;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
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
}

export default UserStaffObservable;
