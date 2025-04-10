import { makeAutoObservable } from "mobx";
import OrderAPI, { ExportOrder } from "src/api/order.api";

import { paginationData, RootStore } from "./base";
import voucherApi from "src/api/voucher";
import { IPermission, IRole } from "src/types/backend";
import RoleApi from "src/api/setting";
import { ResponsePromise } from "src/api";

export type OrderStatus = {
    key?: string;
};

export type globalFiltersData = {
    search?: string;
    sortOrder?: string;
    sortBy?: string;
    order_status?: string;
    payment_status?: string;
    payment_method?: string;
    created_from?: string;
    created_to?: string;
};
export type TypeVoucher = {
    id: string;
    name_type_voucher: string;
};

export type orderData = {
    orders: any[];
    order_status: OrderStatus[];
    order_status_selected?: string;
    order_selected?: string;
    order_detail?: any;
    confirm_order_data?: ExportOrder;
};

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
    dataListCustomer_no_voucher = [];
    idRole: string = "";

    globalFilters: globalFiltersData = {
        search: null,
        sortOrder: null,
        sortBy: null,
        order_status: null,
        payment_status: null,
        payment_method: null,
        created_from: null,
        created_to: null,
    };
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    loading: boolean = false;
    isOpenDetail: boolean = false;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this);

        this.rootStore = rootStore;
        this.setGlobalFilters = this.setGlobalFilters.bind(this);
        this.setPagination = this.setPagination.bind(this);
        this.getListRole = this.getListRole.bind(this);
        this.fetchRoleById = this.fetchRoleById.bind(this);
        this.deleteRoleByID = this.deleteRoleByID.bind(this);
        this.createVoucher = this.createVoucher.bind(this);
        this.editRole = this.editRole.bind(this);
        this.resetSingleRole = this.resetSingleRole.bind(this);
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
            console.log(response);
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
            console.log(response);
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
            console.log(response);
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
            console.log(response);
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

    setGlobalFilters(filters: globalFiltersData) {
        this.globalFilters = {
            ...this.globalFilters,
            ...filters,
        };
    }

    setPagination(page: number, pageSize: number) {
        if (page < 1 || pageSize < 1) return;

        this.pagination = {
            ...this.pagination,
            current: page,
            pageSize: pageSize,
        };
    }
}
