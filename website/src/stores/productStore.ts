import { makeAutoObservable } from "mobx";
import { SUCCESS_STATUSES } from "../constants";
import { paginationData, RootStore } from "./base";
import ProductAPI from "src/api/product";
import { ResponsePromise } from "src/api/order";

export enum EnumProductType {
    CARS = "Xe hơi",
    MOTOBIKES = "Xe máy điện",
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
    cars_motobikes: {
        data: any[];
    };
    dataDetail: {
        data: any;
    };
    resultOption_OptionValue: [];
    dataSKU: null;
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
        cars_motobikes: {
            data: [],
        },
        dataDetail: {
            data: "",
        },
        globalFilter: {
            search: "",
            price_max: null,
            price_min: null,
            brand: "",
            categoryName: "",
        },
        resultOption_OptionValue: [],
        dataSKU: null,
    };
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);

        this.setStatusMessage = this.setStatusMessage.bind(this);
        this.clearStatusMessage = this.clearStatusMessage.bind(this);
        this.getListProduct = this.getListProduct.bind(this);
        this.getListProductBuyMany = this.getListProductBuyMany.bind(this);
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

    *getListProduct(queryString, type) {
        try {
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

    // product cho trang home
    *getListProductHome(queryString) {
        const queryString1 = new URLSearchParams(queryString).toString();
        try {
            const response: ResponsePromise = yield ProductAPI.getListProduct(
                queryString1
            );
            const { data, status, message } = response;
            const resData = data?.data;
            if (SUCCESS_STATUSES.includes(status)) {
                this.data.cars_motobikes.data = resData;

                this.setStatusMessage(200, "", message);
            } else {
                this.setStatusMessage(0, message, "");
            }
        } catch (e: any) {
            console.error(e);
            this.setStatusMessage(0, e?.message, "");
        }
    }

    //
    *getListProductBuyMany(queryString, type) {
        const queryString1 = new URLSearchParams(queryString).toString();
        try {
            const response: ResponsePromise = yield ProductAPI.getListProduct(
                queryString1
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

    *getDetailProductByID(id) {
        try {
            const response: ResponsePromise = yield ProductAPI.getDetailProduct(
                id
            );
            const { data, status, message } = response;
            const resData = data;
            if (SUCCESS_STATUSES.includes(status)) {
                this.data.dataDetail.data = resData;
                // Chuyển dữ liệu về dạng mới kèm theo image của sku
                const result = this.data.dataDetail.data.skus.reduce(
                    (acc, sku) => {
                        sku.optionValue.forEach((optionValue) => {
                            const existingOption = acc.find(
                                (item) => item.name === optionValue.option.name
                            );
                            if (existingOption) {
                                existingOption.option_values.push({
                                    id: optionValue.id,
                                    value: optionValue.value,
                                    image: sku.image, // Thêm image của SKU vào option_value
                                });
                            } else {
                                acc.push({
                                    name: optionValue.option.name,
                                    option_values: [
                                        {
                                            id: optionValue.id,
                                            value: optionValue.value,
                                            image: sku.image, // Thêm image của SKU vào option_value
                                        },
                                    ],
                                });
                            }
                        });
                        return acc;
                    },
                    []
                );

                this.data.resultOption_OptionValue = result;

                this.setStatusMessage(200, "", message);
            } else {
                this.setStatusMessage(0, message, "");
            }
        } catch (e: any) {
            console.error(e);
            this.setStatusMessage(0, e?.message, "");
        }
    }

    *getDetailSKU_ByOptionValue(id) {
        try {
            const response: ResponsePromise = yield ProductAPI.getDetailSKU(id);
            const { data, status, message } = response;
            const resData = data;
            if (SUCCESS_STATUSES.includes(status)) {
                this.data.dataSKU = resData;
                // Chuyển dữ liệu về dạng mới kèm theo image của sku

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
