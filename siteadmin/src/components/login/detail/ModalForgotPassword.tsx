import { message } from "antd";
import { forwardRef, useImperativeHandle } from "react";
import { useEmailVerifyModal } from "@/hooks/useEmailVerifyModal";
import { useStore } from "@/stores";
import { getErrorMessage } from "@/utils";
import { regexEmail } from "@/utils/regex";
import { ModalHandle } from "./ModalRetryActive";
import { observer } from "mobx-react-lite";

// export default ModalForgotPassword;
const ModalForgotPasswordCom = forwardRef<ModalHandle, any>((props, ref) => {
    const { loginObservable } = useStore();
    const onFinishForgotPassword = async (values) => {
        try {
            if (!regexEmail.test(values?.email)) {
                message.error("Email không hợp lê");
                return;
            }
            await loginObservable.forgotPassword(values?.email);
            setShowForgotPassword(false);
        } catch (error) {
            console.error("Lỗi submit quên mật khẩu", error);
            const msg = getErrorMessage(error, "Lỗi submit quên mật khẩu");
            message.error(msg);
        }
    };

    const {
        ModalEmailVerify: ModalForgotPassword,
        setShowModal: setShowForgotPassword,
    } = useEmailVerifyModal({
        title: "Quên mật khẩu?",
        onSubmit: onFinishForgotPassword,
    });

    useImperativeHandle(ref, () => ({
        open: () => setShowForgotPassword(true),
        close: () => setShowForgotPassword(false),
    }));
    return ModalForgotPassword;
});

ModalForgotPasswordCom.displayName = "ModalForgotPasswordCom";

export default observer(ModalForgotPasswordCom);
