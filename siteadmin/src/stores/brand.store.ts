import { makeAutoObservable } from "mobx";
import { MessageStore, paginationData, RootStore } from "./base";
import BrandAPI from "src/api/brand.api";

export type BrandResponseType = {
    id: string;
    name: string;
    description: string;
    slug: string;
    thumbnailUrl: string;
    created_at: Date;
    updated_at: Date;
};

class BrandObservable implements MessageStore {
    status: number = null;
    errorMsg: string = null;
    successMsg: string = null;
    showSuccessMsg: boolean = false;
    rootStore: RootStore;
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    data: BrandResponseType[] = [];
    loading: boolean = false;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
        this.setStatusMessage = this.setStatusMessage.bind(this);
        this.clearMessage = this.clearMessage.bind(this);
    }
    setStatusMessage(
        status: number,
        errorMsg: string,
        successMsg: string
    ): void {
        if (status) this.status = status;
        if (errorMsg) this.errorMsg = errorMsg;
        if (successMsg) this.successMsg = successMsg;
        this.showSuccessMsg = true;
    }
    clearMessage(): void {
        this.errorMsg = null;
        this.successMsg = null;
        this.status = null;
        this.showSuccessMsg = false;
    }

    private validateQuery(query?: string | object): string {
        const parseQuery: paginationData = {
            ...this.pagination,
        };

        const queryString = new URLSearchParams(
            Object.fromEntries(
                Object.entries(parseQuery).map(([key, value]) => [
                    key,
                    value.toString(),
                ])
            )
        ).toString();
        return queryString;
    }

    *getListBrands(query: string | object) {
        try {
            const queryString = this.validateQuery(query);
            const response = yield BrandAPI.list(queryString);
            const { data, status, message } = response;
            const resData = data?.result;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data = resData;
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
}

export default BrandObservable;
