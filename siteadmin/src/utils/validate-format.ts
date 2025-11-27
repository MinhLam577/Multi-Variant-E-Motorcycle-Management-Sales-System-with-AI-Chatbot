import { RuleObject } from "antd/es/form";
import { regexEmail } from "./regex";

export const validateEmail = async (_: RuleObject, value: string) => {
    if (!value) return Promise.reject("Vui lòng nhập email");
    if (!regexEmail.test(value)) return Promise.reject("Email không hợp lệ");
    return Promise.resolve();
};
