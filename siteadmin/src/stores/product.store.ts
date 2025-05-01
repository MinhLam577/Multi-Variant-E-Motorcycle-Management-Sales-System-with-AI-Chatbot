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

export type CreateProductSpecificationDto = {
    name: string;
    value: string;
};

export type VariantCombinationDto = {
    option_id: string;
    value: string;
};

export type SkusDetailImportDto = {
    warehouse_id: string;
    quantity_import: number;
    price_import: number;
};

export type CreateSkusDto = {
    masku?: string;
    barcode?: string;
    name?: string;
    image?: string;
    price_sold: number;
    price_compare: number;
    detail_import: SkusDetailImportDto[];
    variant_combinations?: VariantCombinationDto[];
};
export type OptionValueDataResponseType = {
    id: string;
    value: string;
    createdAt: string;
    updatedAt: string;
    option: OptionDataResponseType;
};
export type OptionDataResponseType = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
};
export type WarehouseDataResponseType = {
    id: string;
    name: string;
    address: string;
    description?: string | null;
    created_at: string;
    updated_at: string;
};
export type DetailImportResponseType = {
    id: string;
    price_import: string;
    quantity_import: number;
    quantity_sold: number;
    quantity_remaining: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    warehouse: WarehouseDataResponseType | null;
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
    detail_import: DetailImportResponseType[];
    optionValue: OptionValueDataResponseType[];
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
    specifications?: CreateProductSpecificationDto[];
    brand?: {
        id: string;
        name: string;
        slug: string;
        description: string;
        thumbnailUrl: string;
        created_at: string;
        updated_at: string;
    };
    category?: {
        id: string;
        slug: string;
        name: string;
        description?: string | null;
        deletedAt?: any | null;
    };
};

export type CreateProductDto = {
    type: EnumProductStore;
    slug_product: string;
    title: string;
    description?: string;
    brand_id: string;
    category_id: string;
    specifications?: CreateProductSpecificationDto[];
    images?: string[];
    skus: CreateSkusDto[];
};

type ProductData = {
    products: {
        data: ProductType;
        detailProductData: ProductDataResponseType | null;
    };
    globalFilter: globalFilterType;
};

class ProductObservable {
    rootStore: RootStore;
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    data: ProductData = {
        products: {
            data: null,
            detailProductData: null,
        },
        globalFilter: {
            search: "",
            price_max: null,
            price_min: null,
            brandID: "",
            categoryID: "",
            type: null,
        },
    };
    loading: boolean = false;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this, {}, { autoBind: true });
    }

    private validateQuery(query: string | object): string {
        const parseQuery: paginationData & globalFilterType = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query))
                : query),
            ...this.pagination,
        };

        const {
            search,
            price_max,
            price_min,
            brandID,
            categoryID,
            status,
            type,
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
        queryParams.append("current", parseQuery.current.toString());
        queryParams.append("pageSize", parseQuery.pageSize.toString());
        return queryParams.toString();
    }

    *getListProduct(
        query:
            | string
            | (paginationData & globalFilterType)
            | paginationData
            | globalFilterType
    ) {
        try {
            this.loading = true;
            const queryString = this.validateQuery(query);
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
                this.data.products.data = resData;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
            }
        } catch (e: any) {
            console.error("Error fetching product list:", e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *detailProduct(id: string) {
        try {
            this.loading = true;
            const response: ResponsePromise =
                yield ProductAPI.detailProduct(id);
            const { status, message, data } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.data.products.detailProductData = data;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                this.data.products.detailProductData = null;
            }
        } catch (e: any) {
            console.error("Error fetching product details:", e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
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

    *createProduct(createData: CreateProductDto) {
        try {
            this.rootStore.loading = true;
            const response: ResponsePromise =
                yield ProductAPI.createProduct(createData);
            const { status, message } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error("Error creating product:", e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.rootStore.loading = false;
        }
    }

    *updateProduct(id: string, updateData: CreateProductDto) {
        try {
            this.rootStore.loading = true;
            const response: ResponsePromise = yield ProductAPI.updateProduct(
                id,
                updateData
            );
            const { status, message } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error("Error updating product:", e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.rootStore.loading = false;
        }
    }

    *softDeleteProduct(id: string) {
        try {
            const response: ResponsePromise =
                yield ProductAPI.softDeleteProduct(id);
            const { status, message } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e) {
            console.error("Error soft deleting product:", e);
            const errorMsg =
                typeof e === "object" && e instanceof Error
                    ? e.message
                    : typeof e === "object" && "message" in e
                      ? (e.message as string)
                      : "Có lỗi xảy ra trong quá trình xóa sản phẩm";
            this.rootStore.status = 500;
            this.rootStore.errorMsg = errorMsg;
            return false;
        }
    }

    *restoreDeleteProduct(id: string) {
        try {
            const response: ResponsePromise =
                yield ProductAPI.restoreDeleteProduct(id);
            const { status, message } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e) {
            console.error("Error restoring deleted product:", e);
            const errorMsg =
                e instanceof Error
                    ? e.message
                    : "Có lỗi xảy ra trong quá trình khôi phục sản phẩm";
            this.rootStore.status = 500;
            this.rootStore.errorMsg = errorMsg;
            return false;
        }
    }
}

export default ProductObservable;
