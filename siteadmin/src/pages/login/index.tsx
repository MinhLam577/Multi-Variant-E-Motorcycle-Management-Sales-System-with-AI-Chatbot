import { Form, message, MessageArgsProps } from "antd";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { useStore } from "../../stores";
import { regexEmail } from "../../utils/regex";
import LoginScreen from "./LoginScreen";
import { ForgotPassword, LoginStatus } from "src/types/userLogin.type";
import { getErrorMessage } from "src/utils";

const Login = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { loginObservable } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] =
        useState(false);
    const [form] = Form.useForm();
    const [forgotPasswordForm] = Form.useForm();
    const auth = useAuth();
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
        if (!regexEmail.test(values.email)) {
            displayMessage({ content: "Email không hợp lệ", status: 400 });
            return;
        }
        loginObservable.login(values?.email, values?.password);
    };

    const onFinish = (values) => {
        formSubmit({
            ...values,
            email: values?.email.trim(),
        });
    };

    const onFinishForgotPassword = async (values) => {
        try {
            setIsForgotLoading(true);
            if (!regexEmail.test(values?.email)) {
                displayMessage({ content: "Email không hợp lệ", status: 400 });
                return;
            }
            await loginObservable.forgotPassword(values?.email);
            if (
                loginObservable.status === ForgotPassword.FORGOT_PASSWORD_FAILED
            ) {
                displayMessage({
                    content: loginObservable.errorMsg,
                    status: 400,
                });
                return;
            }
            forgotPasswordForm.resetFields();
            setIsForgotLoading(false);
            setShowForgotPasswordModal(false);
        } catch (error) {
            console.error("Lỗi submit quên mật khẩu", error);
            const msg = getErrorMessage(error, "Lỗi submit quên mật khẩu");
            message.error(msg);
        } finally {
            setIsForgotLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {};

    return (
        <>
            {contextHolder}
            <LoginScreen
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                isLoading={isLoading}
                isForgotLoading={isForgotLoading}
                onFinishForgotPassword={onFinishForgotPassword}
                showForgotPasswordModal={showForgotPasswordModal}
                setShowForgotPasswordModal={setShowForgotPasswordModal}
                form={form}
                forgotPasswordForm={forgotPasswordForm}
            />
        </>
    );
};

export default observer(Login);
