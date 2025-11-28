import { makeAutoObservable } from "mobx";
import { SUCCESS_STATUSES } from "../constants";
import { paginationData, RootStore } from "./base";
import ProductAPI from "src/api/product";
import { ResponsePromise } from "src/api/order";

export enum EnumProductSortBy {
    CREATED_AT_DESC = "createdAtDesc",
    UPDATED_AT_DESC = "updatedAtDesc",
    PRICE_ASC = "priceAsc",
    PRICE_DESC = "priceDesc",
    BEST_SELLING = "bestSelling",
}
import SkusAPI from "../api/skus";
import { OptionGroup } from "@/app/components/listing/listing-single/listing-single-v2/Select_OptionValue";

export enum EnumProductType {
    CARS = "Xe hơi",
    MOTOBIKES = "Xe máy điện",
}

// interface OptionGroup {
//     option_value_ids: string[];
// }
export enum EnumProductStoreLabel {
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
    sort_by?: EnumProductSortBy;
};

export type OptionValueResponseType = {
    id: string;
    value: string;
    createdAt: string;
    updatedAt: string;
};
export type skus_OptionValue_ResponseType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    masku: string;
    barcode: string;
    name: string;
    price_sold: string;
    price_compare: string;
    image: string | null;
    status: boolean;
    optionValue: OptionValueResponseType[];
};

export type ConvertSkusOptionValue_UI = {
    id: string;
    createdAt: string;
    name: string;
    option_values: {
        id: string;
        value: string;
        image: string | null; // Thêm trường image
    }[];
};
export type DetailImportResponseType = {
    id: string;
    price_import: string;
    quantity_import: number;
    quantity_sold: number;
    lot_name: string;
    quantity_remaining: number;
    created_at: string;
    updated_at: string;
    deleted_at: null | string;
};
export type SkusDataResponseType = {
    id: string;
    masku: string;
    barcode: string;
    name: string;
    price_sold: string;
    price_compare: string;
    image: string | null;
    status: boolean;
    detail_import?: DetailImportResponseType[];
};
export type ProductDataResponseType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    slug_product: string;
    title: string;
    type: EnumProductStore;
    description?: string;
    images?: string[];
    status?: boolean;
    skus?: SkusDataResponseType[];
};
export type ProductType =
    | {
          products: ProductDataResponseType;
          totalSKU: number;
          totalStock: number;
      }[]
    | null;

export type ProductsSortByResponseType = {
    value: EnumProductSortBy;
    label: string;
};

type ProductData = {
    cars: {
        data: ProductType | null;
        bestSelling: ProductDataResponseType[] | null;
    };
    motobikes: {
        data: ProductType | null;
        bestSelling: ProductDataResponseType[] | null;
    };
    cars_motobikes: {
        data: any[];
    };
    dataDetail: {
        data: any;
    };
    resultOption_OptionValue: ConvertSkusOptionValue_UI[];
    optionValues: OptionGroup[];
    dataSKU: null;
    product_sort_by: ProductsSortByResponseType[];
};

class ProductObservable {
    status: number | null = null;
    errorMessage: string = null;
    successMessage: string = null;
    showSuccessMessage: boolean = false;
    rootStore: RootStore;
    loading: boolean = false;
    pagination: paginationData = {
        current: 1,
        pageSize: 10,
    };
    data: ProductData = {
        cars: {
            data: [],
            bestSelling: [],
        },
        motobikes: {
            data: [],
            bestSelling: [],
        },
        cars_motobikes: {
            data: [],
        },
        dataDetail: {
            data: "",
        },
        resultOption_OptionValue: [],
        dataSKU: null,
        optionValues: null,
        product_sort_by: [],
    };
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this, {}, { autoBind: true });
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

    private validateQuery(query: string | object): string {
        const parseQuery: paginationData & globalFilterType = {
            ...this.pagination,
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query))
                : query
                ? query
                : {}),
        };

        const {
            search,
            price_max,
            price_min,
            brandID,
            categoryID,
            status,
            type,
            sort_by,
        } = parseQuery;
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
        if (sort_by) queryParams.append("sort_by", sort_by);
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
            const queryString = this.validateQuery(query);
            const response: ResponsePromise = yield ProductAPI.getListProduct(
                queryString
            );
            const { data, status, message } = response;
            const resData = data?.data;
            if (SUCCESS_STATUSES.includes(status)) {
                if (type === EnumProductStore.CAR) {
                    this.data.cars.data = resData;
                } else if (type === EnumProductStore.MOTORBIKE) {
                    this.data.motobikes.data = resData;
                }
                this.setStatusMessage(200, "", message);
            } else {
                this.setStatusMessage(0, message, "");
            }
        } catch (e: any) {
            console.error(e);
            this.setStatusMessage(0, e?.message, "");
        } finally {
            this.loading = false;
        }
    }

    *getBestSellingProducts(type: EnumProductStore) {
        try {
            const response: ResponsePromise =
                yield ProductAPI.getBestSellingProducts(type);
            const { data, status, message } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                if (type === EnumProductStore.CAR) {
                    this.data.cars.bestSelling = data;
                } else if (type === EnumProductStore.MOTORBIKE) {
                    this.data.motobikes.bestSelling = data;
                }
                this.setStatusMessage(200, "", message);
            } else {
                this.setStatusMessage(0, message, "");
            }
            return response;
        } catch (e: any) {
            console.error(e);
            this.setStatusMessage(0, e?.message, "");
            throw e;
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
                const result: ConvertSkusOptionValue_UI[] =
                    this.data.dataDetail.data.skus.reduce((acc, sku) => {
                        sku.optionValue.forEach((optionValue) => {
                            const existingOption = acc.find(
                                (item) => item.name === optionValue.option.name
                            );
                            if (existingOption) {
                                existingOption.option_values.push({
                                    id: optionValue.id,
                                    value: optionValue.value,
                                    image: sku.image,
                                });
                            } else {
                                acc.push({
                                    name: optionValue.option.name,
                                    id: optionValue.option.id,
                                    option_values: [
                                        {
                                            id: optionValue.id,
                                            value: optionValue.value,
                                            image: sku.image,
                                        },
                                    ],
                                });
                            }
                        });
                        return acc;
                    }, []);
                this.data.resultOption_OptionValue = result;
                yield this.get_detailProducts_user_page_id(id);
                this.setStatusMessage(200, "", message);
            } else {
                this.setStatusMessage(0, message, "");
            }
        } catch (e: any) {
            console.error(e);
            this.setStatusMessage(0, e?.message, "");
        }
    }

    //     {
    //   "optionValues": [
    //     {
    //       "option_value_ids": [
    //         "ce74692b-f3d5-4cb5-8131-4ea892d17ddc",
    //         "8f5b8356-8f7f-45b1-83e2-eb5568fa4eb9"
    //       ]
    //     },
    //     {
    //       "option_value_ids": [
    //         "7e963a8a-4d82-4fa2-a5a0-783884c1a345",
    // "ec30fb2f-ff38-4469-b489-abae0397d0ae"
    //       ]
    //     }
    //   ]
    // }

    *getDetailSKU_ByOptionValue(id) {
        try {
            const response: ResponsePromise = yield ProductAPI.getDetailSKU(id);
            const { data, status, message } = response;
            const resData = data;
            if (SUCCESS_STATUSES.includes(status)) {
                this.data.dataSKU = resData;
                this.setStatusMessage(200, "", message);
            } else {
                this.setStatusMessage(0, message, "");
            }
        } catch (e: any) {
            console.error(e);
            this.setStatusMessage(0, e?.message, "");
        }
    }
    *GetSkusByOptionValueIdsNoneLogin(optionValuesPayload: {
        optionValues: { option_value_ids: string[] }[];
    }) {
        try {
            const { data, status, message } =
                yield SkusAPI.GetSkusByOptionValueIdsNoneLogin(
                    optionValuesPayload
                );
            console.log("dataSKU_None_Login: ", data);
            if (SUCCESS_STATUSES.includes(status)) {
                this.data.dataSKU = data[0];
                this.setStatusMessage(200, "", message);
            } else {
                this.setStatusMessage(0, message, "");
            }
        } catch (error) {
            console.error("Lỗi khi gọi GetSkusByOptionValueIds:", error);
            this.setStatusMessage(0, "Lỗi gọi API", "");
        }
    }

    *GetSkusByOptionValueIdsAlreadyLogin(optionValuesPayload: {
        optionValues: { option_value_ids: string[] }[];
    }) {
        try {
            const { data, status, message } =
                yield SkusAPI.GetSkusByOptionValueIdsAlreadyLogin(
                    optionValuesPayload
                );

            if (SUCCESS_STATUSES.includes(status)) {
                this.data.dataSKU = data?.[0];
                this.setStatusMessage(200, "", message);
            } else {
                this.setStatusMessage(0, message, "");
            }
        } catch (error) {
            console.error("Lỗi khi gọi GetSkusByOptionValueIds:", error);
            this.setStatusMessage(0, "Lỗi gọi API", "");
        }
    }

    *get_detailProducts_user_page_id(id: string) {
        try {
            const response: ResponsePromise =
                yield ProductAPI.getDetailProduct_getOptionValue(id);
            const { data, status, message } = response;
            this.data.optionValues = data.optionValues;
        } catch (error) {}
    }

    *getProductSortBy() {
        try {
            const response: ResponsePromise =
                yield ProductAPI.getProductsSortBy();
            const { data, status, message } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                this.data.product_sort_by = data;
                this.setStatusMessage(200, "", message);
            } else {
                this.setStatusMessage(0, message, "");
            }
        } catch (e: any) {
            console.error(e);
            this.setStatusMessage(0, e?.message, "");
        }
    }

    setPagination(current: number, pageSize: number) {
        this.pagination.current = Number(current) || 1;
        this.pagination.pageSize = Number(pageSize) || 10;
    }
}

export default ProductObservable;
