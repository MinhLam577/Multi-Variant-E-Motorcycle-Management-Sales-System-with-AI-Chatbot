export type ResponsePromise = {
    status: number;
    message: string;
    data: any;
};

export type ResponseImage = {
    public_id: string;
    url: string;
};

export type ResponseFailure = {
    status: number;
    message: string[] | string;
    path: string;
    success: boolean;
};

export type ResponseImageUpload = {
    status: number;
    message: string;
    data: ResponseImage[];
};

export enum MethodType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}
export enum HeaderContentType {
    JSON = "application/json",
    FORM_URLENCODED = "application/x-www-form-urlencoded",
    FORM_DATA = "multipart/form-data",
}
