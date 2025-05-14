import { makeAutoObservable, toJS } from "mobx";
import { paginationData, RootStore } from "./base";
import CategoriesAPI from "src/api/categories.api";

export type CategoryResponseType = {
    id: string;
    name: string;
    description: string;
    parentCategoryId: string | null;
    deletedAt: string | null;
    slug: string;
    children?: CategoryResponseType[];
};
export default class CategoriesObservable {
    status: number | null = null;
    errorMsg: string | null = null;
    successMsg: string | null = null;
    showSuccessMsg: boolean = false;
    rootStore: RootStore;
    data: CategoryResponseType[] | null = null;
    globalFilters: any;
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    loading: boolean = false;
    isOpenDetail: boolean = false;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        this.setPagination = this.setPagination.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.setStatusMessage = this.setStatusMessage.bind(this);
        this.clearStatusMessage = this.clearStatusMessage.bind(this);
        this.getListCategories = this.getListCategories.bind(this);
    }

    *getListCategories() {
        try {
            const response = yield CategoriesAPI.list();
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data = data;
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

    setPagination(pagination: paginationData) {
        this.pagination = pagination;
    }

    setStatusMessage(
        status: number,
        errorMsg: string,
        successMsg: string,
        showSuccessMsg: boolean = false
    ) {
        if (status) this.status = status;
        if (errorMsg) this.errorMsg = errorMsg;
        if (successMsg) this.successMsg = successMsg;
        this.showSuccessMsg = showSuccessMsg;
    }
    clearStatusMessage() {
        this.errorMsg = null;
        this.successMsg = null;
        this.status = null;
    }
    setLoading(loading: boolean) {
        this.loading = loading;
    }
}
