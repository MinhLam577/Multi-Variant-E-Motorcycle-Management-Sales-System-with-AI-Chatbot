import { makeAutoObservable } from "mobx";
import { ExportOrder, ResponsePromise } from "../api/order";
import { RootStore } from "./base";
import { getAllCategory } from "../api/categories";
import { filterEmptyFields } from "../lib/utils";
import { EnumProductStore } from "./productStore";

export type OrderStatus = {
    key?: string;
};

export type paginationData = {
    current: number;
    pageSize: number;
};
export enum CategoryResponseTypeEnum {
    TREE = "tree",
    FLAT = "flat",
}
export type globalFilterCategoryType = {
    search?: string;
    type?: string;
    status?: boolean;
    responseType?: CategoryResponseTypeEnum;
};

export type CategoryResponseType = {
    id: string;
    name: string;
    description: string;
    parentCategoryId: string | null;
    deletedAt: string | null;
    slug: string;
    type: EnumProductStore;
    children?: CategoryResponseType[];
};
export type orderData = {
    orders: any[];
    order_status: OrderStatus[];
    order_status_selected?: string;
    order_selected?: string;
    order_detail?: any;
    confirm_order_data?: ExportOrder;
    categories?: CategoryResponseType[];
};

export default class CategoryObservable {
    status: number | null = null;
    errorMsg: string | null = null;
    successMsg: string | null = null;
    showSuccessMsg: boolean = false;
    rootStore: RootStore;
    data: orderData = {
        orders: [],
        categories: [],
        order_status: [],
        order_status_selected: null,
        order_selected: null,
        order_detail: null,
        confirm_order_data: null,
    };
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    loading: boolean = false;
    isOpenDetail: boolean = false;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
    }

    private validateQuery(query?: string | object): string {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: globalFilterCategoryType & paginationData = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query
                ? query
                : {}),
            current: Number(this.pagination.current),
            pageSize: Number(this.pagination.pageSize),
            responseType: CategoryResponseTypeEnum.TREE,
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFilterCategoryType =
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

    *getListOrder(query?: string | object) {
        try {
            this.loading = true;
            const queryString = this.validateQuery(query);
            const response: ResponsePromise = yield getAllCategory(queryString);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data.categories = data?.data;
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

    clearMessage() {
        this.showSuccessMsg = false;
        this.status = null;
        this.errorMsg = null;
        this.successMsg = null;
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

    setOrderDetail(orderDetail) {
        this.data.order_detail = orderDetail;
    }

    setOpenDetail(isOpen: boolean) {
        this.isOpenDetail = isOpen;
    }

    setOrderSelected(order_selected: string) {
        this.data.order_selected = order_selected;
    }

    setOrderStatusSelected(order_status_selected: string) {
        this.data.order_status_selected = order_status_selected;
    }
}
