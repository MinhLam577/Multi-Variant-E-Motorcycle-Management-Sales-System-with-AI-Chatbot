import { flow, makeAutoObservable } from "mobx";
import { paginationData, RootStore } from "./base";
import ImportAPI from "src/api/imports.api";
import { convertDate, filterEmptyFields } from "src/utils";
import { DateTimeFormat } from "src/constants";
import { UpdateImportDto } from "src/types/product.type";
import {
    CreateImportDto,
    globalFiltersImportDataType,
    ImportResponseType,
} from "src/types/import.type";

export default class ImportObservable {
    rootStore: RootStore;
    data: ImportResponseType[] | null = null;
    details: any | null = null;
    pagination: paginationData = {
        current: 1,
        pageSize: 10,
    };
    loading: boolean = false;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(
            this,
            {
                getImportDetails: flow,
                getListImports: flow,
                createImport: flow,
                updateImport: flow,
                deleteImport: flow,
            },
            { autoBind: true }
        );
    }
    private validateQuery(query?: string | object): string {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: globalFiltersImportDataType & paginationData = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query),
            current: Number(this.pagination.current),
            pageSize: Number(this.pagination.pageSize),
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFiltersImportDataType =
            filterEmptyFields({
                ...this.pagination,
                ...parsedQuery,
                start_date: parsedQuery?.start_date
                    ? convertDate(
                          parsedQuery.start_date,
                          DateTimeFormat.Date,
                          DateTimeFormat.TIME_STAMP_POSTGRES
                      )
                    : undefined,
                end_date: parsedQuery?.end_date
                    ? convertDate(
                          parsedQuery.end_date,
                          DateTimeFormat.Date,
                          DateTimeFormat.TIME_STAMP_POSTGRES
                      )
                    : undefined,
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

    *getListImports(query: object) {
        try {
            this.loading = true;
            const queryString = this.validateQuery({
                ...query,
            });
            const response = yield ImportAPI.getList(queryString);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            const newUrl = `${window.location.pathname}?${queryString}`;
            window.history.pushState({ path: newUrl }, "", newUrl);
            if (success_status.includes(status)) {
                this.data = data;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *createImport(data: CreateImportDto) {
        try {
            this.loading = true;
            const response = yield ImportAPI.createImport(data);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
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
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *getImportDetails(id: string) {
        try {
            this.loading = true;
            const response = yield ImportAPI.details(id);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.details = data;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
                this.details = null;
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *updateImport(id: string, data: UpdateImportDto) {
        try {
            this.loading = true;
            const response = yield ImportAPI.updateImport(id, data);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
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
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    *deleteImport(id: string) {
        try {
            this.loading = true;
            const response = yield ImportAPI.deleteImport(id);
            const { status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
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
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        } finally {
            this.loading = false;
        }
    }

    setPagination(pagination: paginationData) {
        this.pagination = {
            ...this.pagination,
            ...pagination,
        };
    }

    setLoading(loading: boolean) {
        this.loading = loading;
    }
}
