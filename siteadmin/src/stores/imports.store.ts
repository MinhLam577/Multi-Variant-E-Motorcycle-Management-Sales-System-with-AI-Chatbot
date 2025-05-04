import { makeAutoObservable } from "mobx";
import { paginationData, RootStore } from "./base";
import ImportAPI from "src/api/imports.api";
import { convertDate, filterEmptyFields } from "src/utils";
import { DateTimeFormat } from "src/constants";

export type globalFiltersImportDataType = {
    search?: string;
    warehouse_id?: string;
    start_date?: string;
    end_date?: string;
};
export type ImportType = {
    id: string;
    createdAt: string;
    note: string;
    updatedAt: string;
    detail_imports: {
        id: string;
        price_import: string;
        quantity_import: number;
        quantity_sold: number;
        quantity_remaining: number;
        created_at: string;
        updated_at: string;
        deleted_at: null | string;
    }[];
};
export default class ImportObservable {
    rootStore: RootStore;
    data: ImportType[] | null = null;

    pagination: paginationData = {
        current: 1,
        pageSize: 10,
    };
    loading: boolean = false;
    constructor(rootStore: RootStore) {
        makeAutoObservable(this, {}, { autoBind: true });
        this.rootStore = rootStore;
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

    *getListImports(query: string | object) {
        try {
            this.loading = true;
            const queryString = this.validateQuery(query);
            const response = yield ImportAPI.getList(queryString);
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
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
