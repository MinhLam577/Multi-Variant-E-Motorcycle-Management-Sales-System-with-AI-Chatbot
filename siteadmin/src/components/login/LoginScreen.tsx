import ModalForgotPassword from "./detail/ModalForgotPassword";
import LoginForm from "./detail/LoginForm";
import ModalRegister from "./detail/ModalRegister";
import { observer } from "mobx-react-lite";

const LoginScreen = ({
    onFinish,
    isLoading,
    setShowForgotPasswordModal,
    setShowRetryActive,
    form,
    setShowRegisterModal,
    showRegisterModal,
}) => {
    return (
        <>
            <LoginForm
                form={form}
                isLoading={isLoading}
                onFinish={onFinish}
                setShowForgotPasswordModal={setShowForgotPasswordModal}
                setShowRetryActive={setShowRetryActive}
                setShowRegisterModal={setShowRegisterModal}
            />
            <ModalRegister
                showRegisterForm={showRegisterModal}
                setShowRegisterForm={setShowRegisterModal}
            />
        </>
    );
};

export default observer(LoginScreen);
