import moment from "moment";
import numbro from "numbro";
import { DateTimeFormat } from "src/constants";
import { MessageInstance } from "antd/es/message/interface";
import { MessageStore } from "src/stores/base";

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

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
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
    if (!success_status.includes(status) && store?.errorMsg) {
        messageApi.error(store?.errorMsg, duration);
    } else {
        if (isDisplaySuccess && store?.successMsg) {
            messageApi.success(store?.successMsg, duration);
        }
    }
    store?.clearMessage();
};
