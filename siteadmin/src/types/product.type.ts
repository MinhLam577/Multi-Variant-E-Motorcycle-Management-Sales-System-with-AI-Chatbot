import { BrandResponseType } from "@/types/brand.type";
import { CategoryResponseType } from "./categories.type";
import { DetailImportResponseType } from "./import.type";
export enum EnumProductType {
    MOTORBIKE = "Xe máy điện",
}

export enum EnumProductStore {
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

export type ProductData = {
    products: {
        data: ProductType;
        detailProductData: ProductDataResponseType | null;
    };
    globalFilter: globalFilterType;
};
