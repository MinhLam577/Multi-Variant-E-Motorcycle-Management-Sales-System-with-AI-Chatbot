import { DetailImportResponseType } from "./import.type";
import {
    OptionValueDataResponseType,
    SkusDetailImportDto,
    VariantCombinationDto,
} from "./product.type";

export class UpdateSkusDto {
    product_id: string;
    masku: string;
    barcode: string;
    image: string;
    price_sold: number;
    price_compare: number;

    variant_combinations: VariantCombinationDto[];
}

export class CreateSkusDto {
    product_id: string;
    masku: string;
    barcode: string;
    image: string;
    price_sold: number;
    price_compare: number;
    variant_combinations: VariantCombinationDto[];
    detail_import: SkusDetailImportDto[];
}

export type SkusResponseType = {
    id: string;
    masku: string;
    barcode: string;
    name: string;
    price_sold: string;
    price_compare: string;
    image: string;
    status: boolean;
    optionValue: OptionValueDataResponseType[];
    detail_import?: DetailImportResponseType[];
    product?: {
        id: string;
        title: string;
    };
};

export type globalFiltersDataSkus = {
    search?: string;
    product_id?: string;
    brand_id?: string;
    warehouse_id?: string;
};
export type SkusDetailImportResponseType = {
    id: string;
    detail_import: DetailImportResponseType[];
};
