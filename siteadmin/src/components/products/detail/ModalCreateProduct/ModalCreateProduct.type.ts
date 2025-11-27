import { FormInstance } from "antd";
import { CategoryResponseType } from "@/types/categories.type";
import { VariantCombinationDto } from "@/types/product.type";

export type TreeSelectType = {
    title: string;
    value: string;
    children?: TreeSelectType[];
};

export type SelectType = {
    label: string;
    value: string;
};

export const DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT = 5;

export interface IModalCreateProductProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    loadingData?: () => Promise<void>;
    okText?: string;
    cancelText?: string;
    title?: string;
    formInitialValues?: Record<string, any>;
    form: FormInstance;
    subForm: FormInstance;
    categorySelectData: CategoryResponseType[];
    brandSelectData: SelectType[];
    warehouseSelectData: SelectType[];
    optionSelectData: SelectType[];
    productId?: string;
    messageWhenSave?: string;
}

export interface IVariantCombination {
    name: string;
    details: { option_id: string; value: string }[];
}

export interface IFormListRowData {
    name: string;
    values: {
        value: string;
    }[];
}

export interface IFormSkuCustomData {
    name: string;
    price_sold?: number;
    price_compare?: number;
    price_import?: number;
    barcode?: string;
    masku?: string;
    image?: string;
    variant_combinations?: VariantCombinationDto[];
    detail_import?: Array<{
        warehouse_id: string;
        quantity_import: number;
        lot_name: string;
    }>;
}

export interface ISkuCustomInputData {
    price_sold?: string;
    price_compare?: string;
    price_import?: string;
    barcode?: string;
    masku?: string;
    image?: string;
    variant_combinations?: VariantCombinationDto[];
    detail_import?: Array<{
        warehouse_id: string;
        quantity_import: string;
        lot_name: string;
    }>;
}
export type UpdateProductPriceType =
    | "quantity_import"
    | "price_sold"
    | "price_import"
    | "price_compare"
    | "barcode"
    | "masku";
export type UpdateProductValueFunc = (
    field: UpdateProductPriceType,
    value: string,
    warehouseId?: string
) => void;
