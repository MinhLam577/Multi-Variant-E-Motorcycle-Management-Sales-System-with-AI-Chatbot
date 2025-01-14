import { Button, Form, Image, Input, Modal, Typography } from "antd";
import PropTypes from "prop-types";
const LoginScreen = ({
  onFinish,
  onFinishFailed,
  isLoading,
  showForgotPasswordModal,
  setShowForgotPasswordModal,
  onFinishForgotPassword,
  form,
}) => {
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
              password: ".Hongson@2025",
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
};

LoginScreen.propTypes = {
  onFinish: PropTypes.func,
  onFinishFailed: PropTypes.func,
  isLoading: PropTypes.bool,
  showForgotPasswordModal: PropTypes.bool,
  setShowForgotPasswordModal: PropTypes.func,
  onFinishForgotPassword: PropTypes.func,
  form: PropTypes.object,
};
export default LoginScreen;
