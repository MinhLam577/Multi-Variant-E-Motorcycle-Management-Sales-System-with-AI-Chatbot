export type CreateBrandDto = {
    name: string;
    description?: string;
    thumbnailUrl: string;
    slug: string;
};

export type UpdateBrandDto = Partial<CreateBrandDto>;

export type BrandResponseType = {
    id: string;
    name: string;
    description: string;
    slug: string;
    thumbnailUrl: string;
    created_at: Date;
    updated_at: Date;
};

export type globalFilterBrandType = {
    search?: string;
    created_from?: string;
    created_to?: string;
};
