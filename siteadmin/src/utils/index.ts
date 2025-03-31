import moment from "moment";
import numbro from "numbro";
import { DateTimeFormat } from "../constants";

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
