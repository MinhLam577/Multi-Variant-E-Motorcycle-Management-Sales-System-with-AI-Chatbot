import { SUCCESS_STATUSES } from "src/constants";
import apiClient from "./apiClient";

export type ResponsePromise = {
    status: number;
    message: string;
    data: any;
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

const validateFetchData = (
    endpoint: string,
    options?: {
        method?: string;
        body?: any;
        headers?: string;
    }
): void => {
    if (!endpoint) {
        throw new Error("Endpoint bắt buộc phải có");
    }
    if (
        options?.method &&
        !Object.values(MethodType).includes(options.method as MethodType)
    ) {
        throw new Error("Method không hợp lệ");
    }
    if (options?.body && typeof options.body !== "object") {
        throw new Error("Body phải là một object");
    }
    if (
        options?.headers &&
        !Object.values(HeaderContentType).includes(
            options.headers as HeaderContentType
        )
    ) {
        throw new Error("Header không hợp lệ hoặc không được hỗ trợ");
    }
};

const processResponse = (result: any): ResponsePromise => {
    if (SUCCESS_STATUSES.includes(result?.status) && "data" in result) {
        return {
            data: result?.data,
            status: result?.status,
            message: Array.isArray(result?.message)
                ? result?.message?.join(", ")
                : result?.message || "Thành công",
        };
    }
    return {
        data: null,
        message: Array.isArray(result?.message)
            ? result?.message?.join(", ")
            : result?.message || "",
        status: result?.status,
    };
};

export const fetchData = async (
    endpoint: string,
    options?: {
        method?: string;
        body?: any;
        headers?: string;
    }
): Promise<ResponsePromise> => {
    validateFetchData(endpoint, options);
    const method = (options?.method || MethodType.GET).toUpperCase();
    const contentType = options?.headers || HeaderContentType.JSON;
    const defaultHeaders = {
        "Content-Type": contentType,
    };

    let requestBody: any;
    if (options?.body) {
        switch (contentType) {
            case HeaderContentType.JSON:
                requestBody = JSON.stringify(options.body);
                break;
            case HeaderContentType.FORM_URLENCODED:
                requestBody = new URLSearchParams(options.body).toString();
                break;
            case HeaderContentType.FORM_DATA: {
                const formData = new FormData();
                for (const [key, value] of Object.entries(options.body)) {
                    formData.append(key, value as string);
                }
                requestBody = formData;
                break;
            }
            default:
                requestBody = options.body;
        }
    }

    const config = {
        method: method,
        headers: defaultHeaders,
        ...(options?.body && { body: requestBody }),
    };

    const response = (await apiClient(endpoint, config)) as ResponsePromise;
    return processResponse(response);
};
