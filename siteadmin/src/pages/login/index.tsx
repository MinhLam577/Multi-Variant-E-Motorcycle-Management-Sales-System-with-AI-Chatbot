import { Form, message, MessageArgsProps } from "antd";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { useStore } from "../../stores";
import { regexEmail } from "../../utils/regex";
import LoginScreen from "../../components/login/LoginScreen";
import { ForgotPassword, LoginStatus } from "@/types/userLogin.type";
import ModalForgotPassword from "@/components/login/detail/ModalForgotPassword";
import ModalRetryActive, {
    ModalHandle,
} from "@/components/login/detail/ModalRetryActive";

const Login = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { loginObservable } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    // Retry active
    const [form] = Form.useForm();
    const auth = useAuth();
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const displayMessage = ({
        content,
        duration = 5,
        status = 200,
        type,
        defaultType = true,
    }: MessageArgsProps & { status?: number; defaultType?: boolean }) => {
        const success_status = [200, 201, 204];
        const messageKey = "upload-message";
        const messageObj: MessageArgsProps = {
            content: content,
            duration: duration,
            key: messageKey,
            type: "success",
        };
        if (defaultType && content) {
            if (success_status.includes(status)) {
                messageApi.open({
                    ...messageObj,
                });
            } else {
                messageApi.open({
                    ...messageObj,
                    type: "error",
                });
            }
            return;
        }
        messageApi.open({
            ...messageObj,
            type: type,
        });
    };
    useEffect(() => {
        const loginReaction = reaction(
            () => loginObservable.status,
            (status, prevStatus) => {
                handleLoginEvents(prevStatus, status);
            }
        );
        return () => {
            loginReaction();
        };
    }, []);

    const handleLoginEvents = (prevStatus, status) => {
        if (prevStatus === LoginStatus.SUBMITTING) {
            setIsLoading(false);
        }

        switch (status) {
            case LoginStatus.SUBMITTING: {
                setIsLoading(true);
                break;
            }
            case LoginStatus.LOGIN_SUCCESS: {
                auth.loginAction();
                break;
            }
            case LoginStatus.LOGIN_FAILED: {
                displayMessage({
                    status: 400,
                    content: loginObservable.errorMsg,
                });
                break;
            }

            case ForgotPassword.FORGOT_PASSWORD_SUCCESS: {
                displayMessage({
                    content: "Email đã được gửi đi",
                });
                break;
            }
            case ForgotPassword.FORGOT_PASSWORD_FAILED: {
                displayMessage({
                    content: loginObservable.errorMsg,
                    status: 400,
                });
                break;
            }
            default: {
                break;
            }
        }
    };

    const formSubmit = (values) => {
        const { email, password, remember } = values;
        if (!regexEmail.test(email)) {
            displayMessage({ content: "Email không hợp lệ", status: 400 });
            return;
        }
        loginObservable.login(email, password, remember);
    };

    const onFinish = (values) => {
        formSubmit({
            ...values,
            email: values?.email.trim(),
        });
    };

    // Tạo ref cho ModalForgotPassword
    const forgotPasswordModalRef = useRef<ModalHandle>(null);

    const retryActiveModalRef = useRef<ModalHandle>(null);

    return (
        <>
            {contextHolder}
            <LoginScreen
                onFinish={onFinish}
                isLoading={isLoading}
                form={form}
                setShowForgotPasswordModal={() =>
                    forgotPasswordModalRef.current?.open()
                }
                setShowRetryActive={() => retryActiveModalRef.current?.open()}
                setShowRegisterModal={setShowRegisterModal}
                showRegisterModal={showRegisterModal}
            />
            <ModalForgotPassword ref={forgotPasswordModalRef} />
            <ModalRetryActive ref={retryActiveModalRef} />
        </>
    );
};

export default observer(Login);
