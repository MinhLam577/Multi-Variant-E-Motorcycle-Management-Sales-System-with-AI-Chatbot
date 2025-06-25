import { makeAutoObservable, toJS } from "mobx";
import { SUCCESS_STATUSES } from "../constants";
import { MessageStore, paginationData, RootStore } from "./base";
import ProductAPI from "src/api/product.api";
import { ResponsePromise } from "src/api";
import { warehouseResponseType } from "./warehouse.store";
import { BrandResponseType } from "./brand.store";
import { CategoryResponseType } from "./categories.store";
import { DetailImportResponseType } from "./imports.store";
import { getErrorMessage } from "src/utils";

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
          products: ProductDataResponseType;
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
    lot_name?: string;
    name?: string;
};

export type SkusDetailImportDtoV2 = {
    warehouses: {
        warehouse_id: string;
        quantity_import: number;
        detail_import_id: string;
        lot_name?: string;
    }[];
    skus_id: string;
    price_import: number;
    product_title: string;
};

export type UpdateDetailImportDto = {
    detail_import_id: string;
    price_import?: number;
    quantity_import?: number;
    warehouse_id?: string;
    lot_name?: string;
};

export type UpdateImportDto = {
    note?: string;
    detail_import: UpdateDetailImportDto[];
};

export type CreateSkusDto = {
    masku?: string;
    barcode?: string;
    image?: string;
    price_sold: number;
    price_compare: number;
    detail_import: SkusDetailImportDto[];
    variant_combinations?: VariantCombinationDto[];
    lot_name?: string;
};

export type UpdateProductDto = {
    type: EnumProductStore;
    slug_product: string;
    title: string;
    description?: string;
    brand_id: string;
    category_id: string;
    specifications?: CreateProductSpecificationDto[];
    images?: string[];
};
export type OptionValueDataResponseType = {
    id: string;
    value: string;
    createdAt: string;
    updatedAt: string;
    option?: OptionDataResponseType;
};
export type OptionDataResponseType = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
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
    optionValue?: OptionValueDataResponseType[];
    product?: ProductDataResponseType;
    total_remaining?: number;
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
    brand?: BrandResponseType;
    category?: CategoryResponseType;
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
        pageSize: 10,
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
            if (newUrl.includes("products")) {
                window.history.replaceState({}, "", newUrl); // Cập nhật URL nếu có tham số truy vấn
            }
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
            const errorMsg = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình lấy danh sách sản phẩm"
            );
            console.error("Error fetching product list:", errorMsg);
            this.rootStore.setStatusMessage(500, errorMsg, "", false);
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
            }
        } catch (e: any) {
            const errorMsg = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình lấy chi tiết sản phẩm"
            );
            console.error("Error fetching product details:", errorMsg);
            this.rootStore.setStatusMessage(500, errorMsg, "", false);
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
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình tạo sản phẩm"
            );
            console.error("Error creating product:", errorMessage);
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
        } finally {
            this.rootStore.loading = false;
        }
    }

    *updateProduct(id: string, updateData: UpdateProductDto) {
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
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình cập nhật sản phẩm"
            );
            console.error("Error updating product:", errorMessage);
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
            return false;
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
            const errorMsg = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình xóa sản phẩm"
            );
            console.error("Error soft deleting product:", errorMsg);
            this.rootStore.setStatusMessage(500, errorMsg, "", false);
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
            const errorMsg = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình khôi phục sản phẩm"
            );
            console.error("Error restoring deleted product:", errorMsg);
            this.rootStore.setStatusMessage(500, errorMsg, "", false);
            return false;
        }
    }

    *hardDeleteProduct(id: string) {
        try {
            const response: ResponsePromise =
                yield ProductAPI.hardDeleteProduct(id);
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
            console.error("Error hard deleting product:", e);
            const errorMsg = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình xóa sản phẩm"
            );
            this.rootStore.setStatusMessage(500, errorMsg, "", false);
            return false;
        }
    }
}

export default ProductObservable;
