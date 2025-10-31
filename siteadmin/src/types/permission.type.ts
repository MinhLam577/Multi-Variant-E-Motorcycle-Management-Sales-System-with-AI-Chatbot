export type PermissionResponseType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    name: string;
    path: string;
    method: string;
    module: string;
};

export type globalFilterPermissionType = {
    search?: string;
    method?: string;
    module?: string;
};
