import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const toCurrency = (value, currency = "VND", locale = "vi-VN") => {
    if (!value) return "Báo giá";
    const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    });
    return formatter.format(value);
};

export const toMileage = (value) => {
    return value;
};
export const formatCurrency = (data) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(data ?? 0);
};
const removeSpecialCharacter = (stri) => {
    return stri
        .normalize("NFD") // Chuẩn hóa ký tự Unicode
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
        .replace(/[^a-zA-Z0-9\s]/g, "") // Loại bỏ ký tự đặc biệt, giữ lại chữ cái, số và khoảng trắng
        .trim(); // Xóa khoảng trắng thừa ở đầu/cuối
};

export const generateNameId = (str, id) => {
    return (
        removeSpecialCharacter(str)
            .replace(/\s+/g, "-") // Chuyển khoảng trắng thành dấu gạch ngang
            .toLowerCase() + `-id,${id}`
    ); // Định dạng slug: thêm -id-
};

export const getIdfromNameId = (nameId) => {
    const match = nameId.match(/-id,(\d+)$/); // Tìm ID với định dạng -id,
    return match ? match[1] : null; // Trả về ID nếu tìm thấy, nếu không thì null
};

export const filterEmptyFields = <T extends Record<string, any>>(obj: T): T => {
    const cleanedObj = Object.fromEntries(
        Object.entries(obj).filter(
            ([, value]) => value !== undefined && value !== null && value !== ""
        )
    );
    return cleanedObj as T;
};

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

export const convertPxToRem = (value: number): string => {
    return `${value / 16}rem`;
};
