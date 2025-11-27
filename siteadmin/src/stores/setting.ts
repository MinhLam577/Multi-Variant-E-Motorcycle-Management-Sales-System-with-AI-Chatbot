import { flow, makeAutoObservable } from "mobx";

import { paginationData, RootStore } from "./base";
import voucherApi from "@/api/voucher";
import { IPermission, IRole } from "@/types/backend";
import RoleApi from "@/api/setting";
import { ResponsePromise } from "@/api";

export default class SettingObservable {
    status: number | null = null;
    errorMsg: string | null = null;
    successMsg: string | null = null;
    showSuccessMsg: boolean = false;
    rootStore: RootStore;
    dataRole: IRole[] = [];
    dataPermission: IPermission[];
    dataUser = null;
    typeVoucher: [];
    dataRoleDetail: IRole = {
        id: "",
        name: "",
        description: "",
        isActive: false,
        permissions: [],
    };

    meta = {
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    };
    dataListCustomer_no_voucher = [];
    idRole: string = "";

    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    loading: boolean = false;
    isOpenDetail: boolean = false;
    constructor(rootStore: RootStore) {
        makeAutoObservable(
            this,
            {
                getListRole: flow,
                fetchRoleById: flow,
                editRole: flow,
                deleteRoleByID: flow,
                createVoucher: flow,
            },
            { autoBind: true }
        );

        this.rootStore = rootStore;
    }

    *getListRole() {
        try {
            this.loading = true;
            const response = yield RoleApi.getList();
            this.loading = false;
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.dataRole = data;
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = Array.isArray(message)
                    ? message.join(", ")
                    : message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *fetchRoleById(id: string) {
        try {
            this.idRole = id;
            const response: ResponsePromise = yield RoleApi.getById(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.dataRoleDetail = data;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    // * : generator function
    *deleteRoleByID(id: string) {
        try {
            // gọi một hàm bất đồng bộ (API)
            const response: ResponsePromise = yield RoleApi.delete(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // ✅ Gọi lại API để refresh data
                yield this.getListRole();
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *createVoucher(body: any) {
        try {
            // gọi một hàm bất đồng bộ (API)
            const response: ResponsePromise = yield voucherApi.create(body);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // ✅ Gọi lại API để refresh data
                yield this.getListRole();
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    *editRole(id: string, body: any) {
        try {
            // gọi một hàm bất đồng bộ (API)
            const response = yield RoleApi.update(id, body);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                // ✅ Gọi lại API để refresh data
                yield this.getListRole();
                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = e?.message || "Lỗi không xác định";
        }
    }

    clearMessage() {
        this.showSuccessMsg = false;
        this.status = null;
        this.errorMsg = null;
        this.successMsg = null;
    }

    resetSingleRole() {
        this.dataRoleDetail = {
            id: "",
            name: "",
            description: "",
            isActive: false,
            permissions: [],
        };
    }

    setStatusMessage(
        status?: number,
        errorMsg?: string,
        successMsg?: string,
        showSuccessMsg?: boolean
    ) {
        if (showSuccessMsg) {
            this.showSuccessMsg = showSuccessMsg;
        }
        if (status) {
            this.status = status;
        }
        if (errorMsg) {
            this.errorMsg = errorMsg;
        }
        if (successMsg) {
            this.successMsg = successMsg;
        }
    }

    setPagination(page: number, pageSize: number) {
        if (page < 1 || pageSize < 1) return;

        this.pagination = {
            ...this.pagination,
            current: page,
            pageSize: pageSize,
        };
    }

    setMeta(page: number, pageSize: number) {
        if (page < 1 || pageSize < 1) return;

        this.meta = {
            ...this.meta,
            current: page,
            pageSize: pageSize,
        };
    }
}
