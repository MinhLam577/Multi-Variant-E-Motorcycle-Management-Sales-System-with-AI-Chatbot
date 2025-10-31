import { message } from "antd";
import { forwardRef, useImperativeHandle } from "react";
import { useEmailVerifyModal } from "src/hooks/useEmailVerifyModal";
import { useStore } from "src/stores";
import { getErrorMessage } from "src/utils";
import { regexEmail } from "src/utils/regex";
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
            if (loginObservable.errorMsg) {
                message.error({
                    content: loginObservable.errorMsg,
                });
            }
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
