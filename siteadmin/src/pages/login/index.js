import { Form, message } from "antd";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";
import { useStore } from "../../stores";
import { regexEmail } from "../../utils/regex";
import LoginScreen from "./LoginScreen";

const Login = () => {
  const { loginObservable } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const auth = useAuth();

  useEffect(() => {
    return reaction(
      () => loginObservable.status,
      (status, prevStatus) => {
        handleLoginEvents(prevStatus, status);
      }
    );
  }, []);

  const handleLoginEvents = (prevStatus, status) => {
    if (prevStatus === "submitting") {
      setIsLoading(false);
    }
    switch (status) {
      case "submitting": {
        setIsLoading(true);
        break;
      }

      case "loginSuccess": {
        auth.loginAction();
        break;
      }
      case "loginFailed": {
        message.error(loginObservable.errorMsg);
        break;
      }

      case "forgotPasswordSuccess": {
        message.success("Email đã được gửi đi!");
        break;
      }
      case "forgotPasswordFailed": {
        message.error(loginObservable.errorMsg);
        break;
      }
      default: {
        break;
      }
    }
  };

  const formSubmit = (values) => {
    if (!regexEmail.test(values.email)) {
      message.error("Email không hợp lệ!");
      return;
    }

    loginObservable.login(values?.email, values?.password);
  };

  const onFinishForgotPassword = (values) => {
    if (!regexEmail.test(values?.email)) {
      message.error("Email không hợp lệ!");
      return;
    }
    loginObservable.forgotPassword(values?.email);
  };

  const onFinish = (values) => {
    formSubmit({
      ...values,
      email: values?.email.trim(),
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <LoginScreen
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      isLoading={isLoading}
      onFinishForgotPassword={onFinishForgotPassword}
      showForgotPasswordModal={showForgotPasswordModal}
      setShowForgotPasswordModal={() => setShowForgotPasswordModal(true)}
      form={form}
    />
  );
};

export default observer(Login);
