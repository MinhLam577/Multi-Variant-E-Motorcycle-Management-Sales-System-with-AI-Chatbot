import { warehouseResponseType } from "src/stores/warehouse.store";
import { SkusDataResponseType } from "./product.type";

export type globalFiltersImportDataType = {
    search?: string;
    warehouse_id?: string;
    start_date?: string;
    end_date?: string;
    product_id?: string;
    skus_id?: string;
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
    warehouse?: warehouseResponseType;
    skus?: SkusDataResponseType;
};
export type ImportResponseType = {
    id: string;
    createdAt: string;
    note: string;
    updatedAt: string;
    detail_imports: DetailImportResponseType[];
};

export type CreateDetailImportDto = {
    skus_id: string;
    price_import: number;
    quantity_import: number;
    warehouse_id: string;
    lot_name?: string;
};

export type CreateImportDto = {
    note?: string;
    detail_import: CreateDetailImportDto[];
};
