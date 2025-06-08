import { makeAutoObservable } from "mobx";
import { SUCCESS_STATUSES } from "../constants";
import { paginationData, RootStore } from "./base";
import ProductAPI from "src/api/product";
import { ResponsePromise } from "src/api/order";

export enum EnumProductType {
    CARS = "Xe hơi",
    MOTOBIKES = "Xe máy điện",
}

export enum EnumProductStore {
    CAR = "car",
    MOTORBIKE = "motorbike",
}

export type globalFilterType = {
    search?: string;
    price_max?: number;
    price_min?: number;
    brand?: string;
    categoryName?: string;
};

type ProductData = {
    cars: {
        data: any[] | null;
    };
    motobikes: {
        data: any[] | null;
    };
    globalFilter: globalFilterType;
};

class ProductObservable {
    status: number | null = null;
    errorMessage: string = null;
    successMessage: string = null;
    showSuccessMessage: boolean = false;
    rootStore: RootStore;
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    data: ProductData = {
        cars: {
            data: [],
        },
        motobikes: {
            data: [],
        },
        globalFilter: {
            search: "",
            price_max: null,
            price_min: null,
            brand: "",
            categoryName: "",
        },
    };
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
        this.setStatusMessage = this.setStatusMessage.bind(this);
        this.clearStatusMessage = this.clearStatusMessage.bind(this);
        this.getListProduct = this.getListProduct.bind(this);
    }
    setStatusMessage(
        status: number,
        errorMessage: string,
        successMessage: string,
        showSuccess: boolean = false
    ) {
        if (status) this.status = status;
        if (errorMessage) this.errorMessage = errorMessage;
        if (successMessage) this.successMessage = successMessage;
        this.showSuccessMessage = showSuccess;
    }

    clearStatusMessage() {
        this.errorMessage = null;
        this.successMessage = null;
        this.status = null;
        this.showSuccessMessage = false;
    }

    private validateQuery(query: string | object, type: string): string {
        const parseQuery: paginationData & globalFilterType = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query))
                : query),
            ...this.pagination,
        };

        const { search, price_max, price_min, brand, categoryName } =
            parseQuery;
        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (price_max) queryParams.append("price_max", price_max.toString());
        if (price_min) queryParams.append("price_min", price_min.toString());
        if (brand) queryParams.append("brand", brand);
        if (categoryName) queryParams.append("categoryName", categoryName);
        else queryParams.append("categoryName", type);
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
        type: EnumProductType = EnumProductType.CARS
    ) {
        try {
            const queryString = this.validateQuery(query, type);
            const response: ResponsePromise = yield ProductAPI.getListProduct(
                queryString
            );
            const { data, status, message } = response;
            const resData = data?.data;
            if (SUCCESS_STATUSES.includes(status)) {
                if (type === EnumProductType.CARS) {
                    this.data.cars.data = resData;
                } else if (type === EnumProductType.MOTOBIKES) {
                    this.data.motobikes.data = resData;
                }
                this.setStatusMessage(200, "", message);
            } else {
                this.setStatusMessage(0, message, "");
            }
        } catch (e: any) {
            console.error(e);
            this.setStatusMessage(0, e?.message, "");
        }
    }
}

export default ProductObservable;
