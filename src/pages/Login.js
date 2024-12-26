import { memo, useEffect, useState } from "react";
import { Button, Form, Input, Typography, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
// import logo from '../images/logo.png';
import queryString from "query-string";
import { UserRoleConstant } from "../constants";
import { useMutation } from "@apollo/client";
import { FORGOT_PASSWORD, LOGIN } from "../graphql/users";
import Logo from "../components/Logo";

const Login = memo(() => {
  const [login] = useMutation(LOGIN, {
    onCompleted: (res) => {
      if (res && res.authenticate?.data?.accessToken) {
        const redirect = queryString.parse(window.location.search, {
          ignoreQueryPrefix: true,
        }).redirect;

        window.location.href = redirect || window.location.origin;

        return;
        // if (
        //   res.authenticate.data.role === UserRoleConstant.ADMIN ||
        //   res.authenticate.data.role === UserRoleConstant.SALES
        // ) {
        //   localStorage.setItem("token", res.authenticate.data?.accessToken);
        //   localStorage.setItem(
        //     "user",
        //     JSON.stringify({
        //       email: res.authenticate.data?.email,
        //       fullname: res.authenticate.data?.fullname,
        //       userId: res.authenticate.data?.userId,
        //       role: res.authenticate.data?.role,
        //       avatar: res.authenticate.data?.avatar,
        //       userCode: res.authenticate.data?.userCode,
        //     })
        //   );
        //   message.success("Đăng nhập thành công!");
        //   window.location.href = redirect || window.location.origin;
        // }
      }
    },
  });
  const [forgotPassword] = useMutation(FORGOT_PASSWORD, {
    onCompleted: (response) => {
      if (response) {
        Modal.success({
          title: "Một email đã được gửi tới, hãy kiểm tra hòm thư của bạn! ",
        });
      }
    },
  });
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/statistic");
      return;
    }
  }, []);

  const formSubmit = (values) => {
    localStorage.setItem(
      "token",
      Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: "example@example.com",
        fullname: "John Doe",
        userId: "12345",
        role: "guest",
        avatar: "",
        userCode: "default",
      })
    );

    // // navigate("/");
    // const redirect = queryString.parse(window.location.search, {
    //   ignoreQueryPrefix: true,
    // }).redirect;
    // window.location.href = redirect || window.location.origin;

    navigate("/");
  };

  const onFinishForgotPassword = (values) => {
    if (values?.email) {
      forgotPassword({ variables: { email: values.email } });
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
    <div className="w-full flex justify-center items-center mt-40">
      <div className="header"></div>
      <div className="w-1/2 md:w-4/12 flex justify-center flex-col">
        <div className="w-full flex justify-center flex-col items-center">
          <Logo handleClick={() => {}} bgColor="#FFFFFF" />
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
              email: "adminotohongson",
              password: "hognson2024",
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

            <Form.Item name="sfsdfsd" wrapperCol={{ offset: 0, span: 16 }}>
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
              <Button type="primary" htmlType="submit">
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Modal
        title="Forgot password?"
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
