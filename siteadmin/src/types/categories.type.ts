import { EnumProductStore } from "./product.type";

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
    type: EnumProductStore;
    children?: CategoryResponseType[];
};
