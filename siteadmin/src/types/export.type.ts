import { DetailImportResponseType } from "@/types/import.type";
import { SkusDataResponseType } from "./product.type";
import { warehouseResponseType } from "@/stores/warehouse.store";
import { CreateDetailExport } from "./order.type";

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
