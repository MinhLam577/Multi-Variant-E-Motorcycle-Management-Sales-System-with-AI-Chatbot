import { makeAutoObservable, toJS } from "mobx";
import { RootStore } from "./base";
import { paginationData } from "./voucher";
import { convertDate, filterEmptyFields } from "src/utils";
import { DateTimeFormat, SUCCESS_STATUSES } from "src/constants";
import ExportAPI from "src/api/exports.api";
import { SkusDataResponseType } from "./product.store";
import { warehouseResponseType } from "./warehouse.store";
import { CreateDetailExport } from "src/api/order.api";
import { DetailImportResponseType } from "./imports.store";

export type CreateExportDto = {
    note?: string | null;
    detail_export: CreateDetailExport[];
};

export type UpdateExportDetailDto = {
    detail_export_id: string;
    detail_import_id: string;
    quantity_export: number;
};

export type UpdateExportDto = {
    note?: string | null;
    export_details: UpdateExportDetailDto[];
};

export type globalFilterExportDataType = {
    search?: string;
    warehouse_id?: string;
    skus_id?: string;
    product_id?: string;
    start_date?: string;
    end_date?: string;
};

export type DetailExportResponseType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
    quantity_export: number;
    detail_import?: DetailImportResponseType;
    skus?: SkusDataResponseType;
    wareHouse?: warehouseResponseType;
};
export type ExportResponseType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null | string;
    note: string;
    detail_export: DetailExportResponseType[];
};

export default class ExportObservable {
    rootStore: RootStore;
    data: ExportResponseType[] = null;
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
        let parsedQuery: globalFilterExportDataType & paginationData = {
            current: Number(this.pagination.current),
            pageSize: Number(this.pagination.pageSize),
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query
                  ? query
                  : {}),
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFilterExportDataType =
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

    *getListExport(
        query:
            | (globalFilterExportDataType & paginationData)
            | globalFilterExportDataType
            | paginationData
    ) {
        this.setLoading(true);
        try {
            const queryString = this.validateQuery(query);
            const response = yield ExportAPI.getList(queryString);
            const { data, message, status } = response;
            const responseData = data?.data;
            const newUrl = `${window.location.pathname}?${queryString}`;
            window.history.pushState({ path: newUrl }, "", newUrl);
            if (SUCCESS_STATUSES.includes(status)) {
                this.data = responseData;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = Array.isArray(message)
                    ? message[0]
                    : message;
            }
        } catch (error) {
            console.error("Error fetching export data:", error);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = "Lỗi không xác định";
        } finally {
            this.setLoading(false);
        }
    }

    *createExport(data: CreateExportDto) {
        this.setLoading(true);
        try {
            const response = yield ExportAPI.createExport(data);
            const { message, status } = response;
            if (SUCCESS_STATUSES.includes(status)) {
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
        } catch (error) {
            console.error("Error creating export:", error);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = "Lỗi không xác định";
        } finally {
            this.setLoading(false);
        }
    }

    *updateExport(id: string, data: UpdateExportDto) {
        this.setLoading(true);
        try {
            const response = yield ExportAPI.updateExport(id, data);
            const { message, status } = response;
            if (SUCCESS_STATUSES.includes(status)) {
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
        } catch (error) {
            console.error("Error updating export:", error);
            this.rootStore.status = 500;
            this.rootStore.errorMsg =
                "Lỗi trong quá trình cập nhật phiếu xuất, vui lòng thử lại";
        } finally {
            this.setLoading(false);
        }
    }

    *deleteExport(id: string) {
        try {
            this.setLoading(true);
            const response = yield ExportAPI.deleteExport(id);
            const { message, status } = response;
            if (SUCCESS_STATUSES.includes(status)) {
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
        } catch (error) {
            console.error("Error deleting export:", error);
            this.rootStore.status = 500;
            this.rootStore.errorMsg =
                "Lỗi trong quá trình xóa phiếu xuất, vui lòng thử lại";
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading: boolean) {
        this.loading = loading;
    }
}
