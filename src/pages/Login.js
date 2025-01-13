import { Button, Form, Image, Input, message, Modal, Typography } from "antd";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import logo from '../images/logo.png';
import queryString from "query-string";
import { loginRequest } from "../api/auth";
import { regexEmail } from "../utils/regex";

const Login = memo(() => {
  const [isLoading, setIsLoading] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/statistic");
      return;
    }
  }, []);

  const formSubmit = async (values) => {
    if (!regexEmail.test(values.email)) {
      message.error("Email không hợp lệ!");
      return;
    }
    setIsLoading(true);
    try {
      const resLogin = await loginRequest({
        email: values?.email,
        password: values?.password,
      });
      if (resLogin && resLogin?.access_token) {
        localStorage.setItem("token", resLogin.access_token);
        localStorage.setItem("user", JSON.stringify(resLogin));

        const redirect = queryString.parse(window.location.search, {
          ignoreQueryPrefix: true,
        }).redirect;
        window.location.href = redirect || window.location.origin;
        navigate("/");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      message.error("Đăng nhập thất bại!", error);
      setIsLoading(false);
    }
  };

  const onFinishForgotPassword = (values) => {
    if (values?.email) {
      // forgotPassword({ variables: { email: values.email } });
      return;
    }
    message.error("Nhập thiếu thông tin!");
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
    <div className="w-full flex justify-center items-center ">
      <div className="header"></div>
      <div className="w-1/2 md:w-4/12 flex justify-center flex-col">
        <div className="w-full flex justify-center flex-col items-center">
          <Image src="/logo192.png" alt="logo" width={200} height={200} />
          <h4 className="font-bold text-lg">Đăng nhập vào tài khoản của bạn</h4>
        </div>
        <div className="content">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            layout={"vertical"}
            initialValues={{
              remember: true,
              email: "tuananhnguyen.se@gmail.com",
              password: ".Hongs2on@2025",
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Hãy nhập Email!" }]}
            >
              <Input placeholder="Nhập Email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Hãy nhập Mật khẩu!" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item
              name="forgotPassword"
              wrapperCol={{ offset: 0, span: 16 }}
            >
              <Typography.Paragraph
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  setShowForgotPasswordModal(true);
                }}
              >
                Quên mật khẩu?
              </Typography.Paragraph>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        title="Quên mật khẩu?"
        open={showForgotPasswordModal}
        onOk={() => {
          form.submit();
          setShowForgotPasswordModal(false);
        }}
        onCancel={() => {
          setShowForgotPasswordModal(false);
        }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 24 }}
          layout={"vertical"}
          initialValues={{ remember: true }}
          onFinish={onFinishForgotPassword}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Hãy nhập Email!" }]}
          >
            <Input placeholder="Nhập Email" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

Login.displayName = "Login";
export default Login;
