import moment from "moment";
import numbro from "numbro";
import { DateTimeFormat } from "src/constants";
import { MessageInstance } from "antd/es/message/interface";
import { MessageStore } from "src/stores/base";
import { v4 as uuidv4 } from "uuid";
export const generateFileName = (fileName) => {
    const fileExtensions = fileName.split(".");
    const fileType = "." + fileExtensions[fileExtensions.length - 1];
    const _fileName = fileName.split(fileType)[0];
    return _fileName.replace(/[^a-zA-Z0-9]/g, "_") + fileType;
};

export const sleepFuntions = async (time) => {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve("result");
        }, time)
    );
};

export const getBase64: (file: File) => Promise<string> = async (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const formatVNDMoney = (value, option = {}) => {
    if (!value) {
        return 0;
    }
    return numbro(value).format({
        mantissa: 0,
        thousandSeparated: true,
        average: false,
        ...option,
    });
};

export const convertSortFromAntToServer = (value) => {
    if (value === "ascend") {
        return "asc";
    }

    return "desc";
};

export const convertDate = (
    date: string | null,
    dateFormatCheck: DateTimeFormat = DateTimeFormat.Date,
    dateFormatToConvert: DateTimeFormat = DateTimeFormat.TIME_STAMP_POSTGRES
): string => {
    try {
        if (!date) {
            return null;
        }
        const momentDate = moment(date, dateFormatCheck, true);
        if (!momentDate.isValid()) {
            console.log(
                `Invalid date format: ${date} with format ${dateFormatCheck}`
            );
            return null;
        }
        return momentDate.format(dateFormatToConvert);
    } catch (e) {
        console.log(e);
        return null;
    }
};

export const getStatusKeyByEnumType = (
    status: number | string,
    enumType: any
) => {
    try {
        if (typeof status === "number") {
            const keys = Object.keys(enumType).filter(
                (key) => enumType[key] === status
            );
            return keys[0];
        }
        const keys = Object.keys(enumType).filter((key) => key === status);
        return keys[0];
    } catch (e) {
        console.error(e);
        throw new Error("Invalid status or enum type when get status key");
    }
};

export const displayMessage = (
    messageApi: MessageInstance,
    status: number,
    store: MessageStore,
    isDisplaySuccess: boolean = false,
    duration: number = 5
) => {
    const success_status = [200, 201, 204];
    const messageKey = "upload-message"
    if (!success_status.includes(status) && store?.errorMsg) {
      messageApi.open({
        key: messageKey,
        type: "error",
        content: store?.errorMsg,
        duration,
    });
    } else {
        if (isDisplaySuccess && store?.successMsg) {
          messageApi.open({
            key: messageKey,
            type: "success",
            content: store?.successMsg,
            duration,
        });
        }
    }
    store?.clearMessage();
};

export const calculateImageSize = (
    width: number,
    height: number,
    maxHeight: number,
    maxWidth: number
) => {
    if (width <= 0 || height <= 0) {
        return { width: maxWidth, height: maxHeight }; // Giá trị mặc định
    }

    // Nếu ảnh nhỏ hơn giới hạn, giữ nguyên kích thước
    if (width <= maxWidth && height <= maxHeight) {
        return { width, height };
    }
    const ratio = Math.min(maxWidth / width, maxHeight / height);

    return {
        width: Math.round(width * ratio),
        height: Math.round(height * ratio),
    };
};

export const getImageSize = async (file: File) => {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = (error) => {
            reject(error);
        };
        URL.revokeObjectURL(img.src);
    });
};

export const resizeImage = (
    file: File,
    width: number,
    height: number,
    quality: number = 1.0
): Promise<File> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const resizedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now(),
                            });
                            resolve(resizedFile);
                        }
                    },
                    file.type,
                    quality
                );
            }
            URL.revokeObjectURL(img.src);
        };
    });
};

export const generateUUIDV4 = () => {
    return uuidv4();
};
