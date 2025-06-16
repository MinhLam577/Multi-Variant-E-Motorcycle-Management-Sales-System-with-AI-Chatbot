import { makeAutoObservable } from "mobx";
import { paginationData } from "./voucher";
import { RootStore } from "./base";
import { filterEmptyFields, getErrorMessage } from "src/utils";
import PermissionAPI from "src/api/permission.api";

export type PermissionResponseType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    path: string;
    method: string;
    module: string;
};

export type globalFilterPermissionType = {
    search?: string;
    method?: string;
    module?: string;
};

export default class PermissionObservable {
    status: number = null;
    errorMsg: string = "";
    successMsg: string = "";
    rootStore: RootStore;
    data: PermissionResponseType[] = [];
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    constructor(rootStore: RootStore) {
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
    }

    private validateQuery(query?: string | object): string {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: globalFilterPermissionType & paginationData = {
            ...this.pagination,
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query
                  ? query
                  : {}),
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFilterPermissionType =
            filterEmptyFields({
                ...this.pagination,
                ...parsedQuery,
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

    *getListPermission(
        query?:
            | string
            | (paginationData & globalFilterPermissionType)
            | paginationData
            | globalFilterPermissionType
    ) {
        try {
            const queryString = this.validateQuery(query);
            const response =
                yield PermissionAPI.getListPermissions(queryString);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data = data?.data || [];
                this.rootStore.setStatusMessage(
                    status,
                    "",
                    Array.isArray(message) ? message[0] : message,
                    false
                );
            } else {
                this.rootStore.setStatusMessage(
                    status,
                    Array.isArray(message) ? message.join(", ") : message,
                    "",
                    false
                );
            }
        } catch (e: any) {
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra khi lấy danh sách quyền"
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
        }
    }

    setPagination(pagination: paginationData) {
        this.pagination = {
            ...this.pagination,
            ...pagination,
        };
    }
}
