import { flow, makeAutoObservable } from "mobx";
import { RootStore } from "./base";
import SkusAPI from "../api/skus.api";
import { SUCCESS_STATUSES } from "src/constants";
import { ResponsePromise } from "src/api";
import { paginationData } from "./base";
import { filterEmptyFields, getErrorMessage } from "src/utils";
import {
    globalFiltersDataSkus,
    SkusDetailImportResponseType,
    SkusResponseType,
    UpdateSkusDto,
} from "src/types/skus.type";
import { CreateSkusDto } from "src/types/product.type";

export default class SkusObservable {
    rootStore: RootStore;
    pagination: paginationData = {
        current: 1,
        pageSize: 10,
    };
    loading: boolean = false;
    image = "";
    data: {
        detail_imports: SkusDetailImportResponseType[];
        skus: SkusResponseType[];
    } = {
        detail_imports: [],
        skus: [],
    };

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(
            this,
            {
                create: flow,
                update: flow,
                remove: flow,
                getDetailImportsByIds: flow,
                getList: flow,
            },
            { autoBind: true }
        );
    }

    private validateQuery(query?: string | object): string {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: globalFiltersDataSkus & paginationData = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query),
            current: Number(this.pagination.current),
            pageSize: Number(this.pagination.pageSize),
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFiltersDataSkus =
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

    *getDetailImportsByIds(ids: string[]) {
        try {
            const response: ResponsePromise =
                yield SkusAPI.getDetailImportsByIds(ids);
            const { status, message, data } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                this.rootStore.status = status;
                this.data.detail_imports = data;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = false;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
            }
        } catch (e: any) {
            console.error("Error fetching detail imports:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể lấy thông tin chi tiết nhập hàng, vui lòng thử lại sau."
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
        }
    }

    *getList(query: string | object) {
        try {
            this.loading = true;
            const queryString = this.validateQuery(query);
            const response: ResponsePromise = yield SkusAPI.list(queryString);
            const { status, message, data } = response;
            const newUrl = `${window.location.pathname}?${queryString}`;
            window.history.pushState({ path: newUrl }, "", newUrl);
            if (SUCCESS_STATUSES.includes(status)) {
                this.data.skus = data;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = false;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
            }
        } catch (e: any) {
            console.error("Error fetching SKU list:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể lấy danh sách biến thể, vui lòng thử lại sau."
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
        } finally {
            this.loading = false;
        }
    }

    *create(data: CreateSkusDto) {
        try {
            this.loading = true;
            const response: ResponsePromise = yield SkusAPI.create(data);
            const { status, message } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                yield this.getList({
                    current: this.pagination.current,
                    pageSize: this.pagination.pageSize,
                });
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
                return false;
            }
        } catch (e) {
            console.error("Error creating SKU:", e);
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình tạo mới biến thể, vui lòng thử lại sau."
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
        } finally {
            this.loading = false;
        }
    }

    *remove(id: string) {
        try {
            this.loading = true;
            const response: ResponsePromise = yield SkusAPI.remove(id);
            const { status, message } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                yield this.getList({
                    current: this.pagination.current,
                    pageSize: this.pagination.pageSize,
                });
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
                return false;
            }
        } catch (e) {
            console.error("Error removing SKU:", e);
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình xóa biến thể, vui lòng thử lại sau."
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
        } finally {
            this.loading = false;
        }
    }

    *update(id: string, data: UpdateSkusDto) {
        try {
            this.loading = true;
            const response: ResponsePromise = yield SkusAPI.update(id, data);
            const { status, message } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                yield this.getList({
                    current: this.pagination.current,
                    pageSize: this.pagination.pageSize,
                });
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
                this.rootStore.showSuccessMsg = true;
                return true;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
                return false;
            }
        } catch (e) {
            console.error("Error updating SKU:", e);
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra trong quá trình cập nhật biến thể, vui lòng thử lại sau."
            );
            this.rootStore.setStatusMessage(500, errorMessage, "", false);
        } finally {
            this.loading = false;
        }
    }

    setImage(image: string) {
        this.image = image;
    }
}
