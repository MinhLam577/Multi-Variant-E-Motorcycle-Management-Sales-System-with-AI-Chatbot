import { flow, makeAutoObservable } from "mobx";
import { SUCCESS_STATUSES } from "../constants";
import { paginationData, RootStore } from "./base";
import ProductAPI from "@/api/product.api";
import { ResponsePromise } from "@/api";
import { getErrorMessage } from "@/utils";
import {
    CreateProductDto,
    globalFilterType,
    ProductData,
    UpdateProductDto,
} from "@/types/product.type";

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
        makeAutoObservable(
            this,
            {
                getListProduct: flow,
                createProduct: flow,
                updateProduct: flow,
                softDeleteProduct: flow,
                hardDeleteProduct: flow,
                restoreDeleteProduct: flow,
                detailProduct: flow,
            },
            { autoBind: true }
        );
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
