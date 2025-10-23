export type ApiResponse<T extends object = undefined> = {
    data: T;
    message: string | string[];
    status: number | boolean;
};
