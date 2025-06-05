import { makeAutoObservable, toJS } from "mobx";
import { paginationData, RootStore } from "./base";
import CategoriesAPI from "src/api/categories.api";
import { filterEmptyFields, getErrorMessage } from "src/utils";

export enum CategoryResponseTypeEnum {
    TREE = "tree",
    FLAT = "flat",
}

export enum CategoryResponseLabel {
    TREE = "Cây danh mục",
    FLAT = "Danh sách",
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
    children?: CategoryResponseType[];
};
export default class CategoriesObservable {
    rootStore: RootStore;
    data: CategoryResponseType[] | null = null;
    detailData: any | null = null;
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

    *getListCategories(query?: string | object) {
        try {
            this.loading = true;
            const queryString = this.validateQuery(query);
            const response = yield CategoriesAPI.list(queryString);
            const { data: resData, status, message } = response;
            const success_status = [200, 201, 204];
            const data = resData.data;
            if (success_status.includes(status)) {
                this.data = data;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = getErrorMessage(
                e,
                "Lỗi khi lấy danh mục"
            );
        } finally {
            this.loading = false;
        }
    }

    *getCategoryDetail(id: string) {
        try {
            this.loading = true;
            const response = yield CategoriesAPI.detail(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.detailData = data;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.isOpenDetail = true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = getErrorMessage(
                e,
                "Lỗi khi lấy chi tiết danh mục"
            );
        } finally {
            this.loading = false;
        }
    }

    *createCategory(data: any) {
        try {
            this.loading = true;
            const response = yield CategoriesAPI.create(data);
            const { data: resData, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.isOpenDetail = false;
                yield this.getListCategories({
                    ...this.pagination,
                    responseType: CategoryResponseTypeEnum.TREE,
                });
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = getErrorMessage(
                e,
                "Lỗi khi tạo danh mục"
            );
            return false;
        } finally {
            this.loading = false;
        }
    }

    *updateCategory(id: string, data: any) {
        try {
            this.loading = true;
            const response = yield CategoriesAPI.update(id, data);
            const { data: resData, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.isOpenDetail = false;
                yield this.getListCategories({
                    ...this.pagination,
                    responseType: CategoryResponseTypeEnum.TREE,
                });
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = getErrorMessage(
                e,
                "Lỗi khi cập nhật danh mục"
            );
            return false;
        } finally {
            this.loading = false;
        }
    }

    *removeCategory(id: string) {
        try {
            this.loading = true;
            const response = yield CategoriesAPI.remove(id);
            const { data: resData, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                yield this.getListCategories({
                    ...this.pagination,
                    responseType: CategoryResponseTypeEnum.TREE,
                });
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = getErrorMessage(
                e,
                "Lỗi khi xóa danh mục"
            );
            return false;
        } finally {
            this.loading = false;
        }
    }

    setPagination(pagination: paginationData) {
        this.pagination = pagination;
    }
}
