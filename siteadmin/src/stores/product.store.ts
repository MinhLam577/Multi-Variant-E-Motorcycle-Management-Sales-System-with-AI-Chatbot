import { makeAutoObservable, toJS } from "mobx";
import { SUCCESS_STATUSES } from "../constants";
import { MessageStore, paginationData, RootStore } from "./base";
import ProductAPI from "src/api/product.api";
import { ResponsePromise } from "src/api";

export enum EnumProductType {
    CAR = "Xe hơi",
    MOTORBIKE = "Xe máy điện",
}

export enum EnumProductStore {
    CAR = "car",
    MOTORBIKE = "motorbike",
}

export type globalFilterType = {
    search?: string;
    price_max?: number;
    price_min?: number;
    brandID?: string;
    categoryID?: string;
    status?: boolean;
    type?: EnumProductStore;
};

export type ProductType =
    | {
          products: any;
          totalSKU: number;
          totalStock: number;
      }[]
    | null;

type ProductData = {
    cars: {
        data: ProductType;
    };
    motobikes: {
        data: ProductType;
    };
    globalFilter: globalFilterType;
};

class ProductObservable implements MessageStore {
    status?: number;
    errorMsg?: string;
    successMsg?: string;
    showSuccessMsg: boolean = false;
    rootStore: RootStore;
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    data: ProductData = {
        cars: {
            data: null,
        },
        motobikes: {
            data: null,
        },
        globalFilter: {
            search: "",
            price_max: null,
            price_min: null,
            brandID: "",
            categoryID: "",
        },
    };
    loading: boolean = false;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
        this.setStatusMessage = this.setStatusMessage.bind(this);
        this.clearMessage = this.clearMessage.bind(this);
        this.getListProduct = this.getListProduct.bind(this);
        this.setGlobalFilter = this.setGlobalFilter.bind(this);
        this.setPagination = this.setPagination.bind(this);
    }
    setStatusMessage(
        status: number,
        errorMsg: string,
        successMsg: string,
        showSuccess: boolean = false
    ) {
        if (status) this.status = status;
        if (errorMsg) this.errorMsg = errorMsg;
        if (successMsg) this.successMsg = successMsg;
        this.showSuccessMsg = showSuccess;
    }

    clearMessage() {
        this.errorMsg = null;
        this.successMsg = null;
        this.status = null;
        this.showSuccessMsg = false;
    }

    private validateQuery(query: string | object, type: string): string {
        const parseQuery: paginationData & globalFilterType = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query))
                : query),
            ...this.pagination,
        };

        const { search, price_max, price_min, brandID, categoryID, status } =
            parseQuery;
        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (price_max) queryParams.append("price_max", price_max.toString());
        if (price_min) queryParams.append("price_min", price_min.toString());
        if (brandID) queryParams.append("brandID", brandID);
        if (categoryID) queryParams.append("categoryID", categoryID);
        if (type) queryParams.append("type", type);
        if (status !== undefined) {
            queryParams.append("status", status.toString());
        }
        queryParams.append("current", parseQuery.current.toString());
        queryParams.append("pageSize", parseQuery.pageSize.toString());
        return queryParams.toString();
    }

    *getListProduct(
        query:
            | string
            | (paginationData & globalFilterType)
            | paginationData
            | globalFilterType,
        type: EnumProductStore = EnumProductStore.CAR
    ) {
        try {
            this.loading = true;
            const queryString = this.validateQuery(query, type);
            const response: ResponsePromise =
                yield ProductAPI.getListProduct(queryString);
            const { data, status, message } = response;
            const resData: {
                products: any;
                totalSKU: number;
                totalStock: number;
            }[] = data?.data;
            const newUrl = `${window.location.pathname}?${queryString}`;
            window.history.pushState({ path: newUrl }, "", newUrl);
            if (SUCCESS_STATUSES.includes(status)) {
                if (type === EnumProductStore.CAR) {
                    this.data.cars.data = resData;
                } else if (type === EnumProductStore.MOTORBIKE) {
                    this.data.motobikes.data = resData;
                }

                this.status = status;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = Array.isArray(message)
                    ? message.join(", ")
                    : message;
            }
        } catch (e: any) {
            console.error("Lỗi", e);
            this.setStatusMessage(500, e?.message || "Lỗi không xác định", "");
        } finally {
            this.loading = false;
        }
    }

    setGlobalFilter(filter: globalFilterType) {
        this.data.globalFilter = {
            ...this.data.globalFilter,
            ...filter,
        };
    }

    setPagination(pagination: paginationData) {
        this.pagination = {
            ...this.pagination,
            ...pagination,
        };
        this.getListProduct({
            ...this.data.globalFilter,
            ...pagination,
        });
    }
}

export default ProductObservable;
