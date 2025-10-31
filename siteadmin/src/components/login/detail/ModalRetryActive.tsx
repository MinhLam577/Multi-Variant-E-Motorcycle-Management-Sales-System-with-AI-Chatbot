import { Button, message } from "antd";
import { observer } from "mobx-react-lite";
import { forwardRef, useImperativeHandle } from "react";
import { useEmailVerifyModal } from "src/hooks/useEmailVerifyModal";
import { useStore } from "src/stores";
import { getErrorMessage } from "src/utils";
import { regexEmail } from "src/utils/regex";

export interface ModalHandle {
    open: () => void;
    close: () => void;
}
const ModalRetryActive = forwardRef<ModalHandle, any>((props, ref) => {
    const { loginObservable } = useStore();
    const onFinishRetryActive = async (values) => {
        try {
            if (!regexEmail.test(values?.email)) {
                message.error("Email không hợp lệ");
                return;
            }
            await loginObservable.retryAccount(values?.email);
            if (loginObservable.errorMsg) {
                message.error(loginObservable.errorMsg);
                return;
            }
        } catch (error) {
            console.error("Lỗi submit tái kích hoạt tài khoản", error);
            const msg = getErrorMessage(
                error,
                "Lỗi submit tái kích hoạt tài khoản"
            );
            message.error(msg);
        }
    };

    const { ModalEmailVerify, setShowModal } = useEmailVerifyModal({
        title: "Tái kích hoạt tài khoản",
        onSubmit: onFinishRetryActive,
    });

    useImperativeHandle(ref, () => ({
        open: () => setShowModal(true),
        close: () => setShowModal(false),
    }));
    return ModalEmailVerify;
});

ModalRetryActive.displayName = "ModalRetryActive";

export default observer(ModalRetryActive);
