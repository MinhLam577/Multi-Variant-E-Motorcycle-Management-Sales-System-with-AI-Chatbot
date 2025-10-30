import { AxiosError } from "axios";

export const getErrorMessage = (e: unknown, customMessage?: string) => {
    const defaultMessage = "Có lỗi xảy ra, vui lòng thử lại sau.";
    if (e instanceof AxiosError) {
        const responseData = e?.response?.data;
        return responseData?.message;
    }

    if (typeof e === "object" && "message" in e) {
        return Array.isArray(e.message) ? e.message[0] : e.message;
    }

    if (typeof e === "object" && "errorFields" in e) {
        return Array.isArray(e.errorFields)
            ? "Vui lòng nhập đầy đủ và đúng thông tin"
            : customMessage || defaultMessage;
    }
    if (e instanceof Error) {
        return e.message;
    }
    return customMessage || defaultMessage;
};
