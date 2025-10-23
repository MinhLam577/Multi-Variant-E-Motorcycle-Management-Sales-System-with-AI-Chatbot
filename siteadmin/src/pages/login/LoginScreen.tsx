import {
    Button,
    Card,
    Col,
    Form,
    Image,
    Input,
    Modal,
    Row,
    Typography,
    Grid,
} from "antd";
const { useBreakpoint } = Grid;

const LoginScreen = ({
    onFinish,
    onFinishFailed,
    isLoading,
    onFinishForgotPassword,
    showForgotPasswordModal,
    setShowForgotPasswordModal,
    form,
    forgotPasswordForm,
    isForgotLoading,
}) => {
    const backgroundImage = "/images/login-background.png";
    const screens = useBreakpoint();
    return (
        <>
            <Row className="h-screen fixed w-full">
                <Col
                    xl={12}
                    lg={12}
                    md={12}
                    sm={0}
                    xs={0}
                    className="hidden md:block h-full"
                >
                    <div
                        className="w-full flex flex-col justify-center items-center space-y-4"
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            height: "100vh",
                        }}
                    >
                        <Image
                            src="/logo2048.png"
                            alt="logo"
                            width={180}
                            height={80}
                        />
                        <span className="font-bold text-2xl text-white">
                            Welcome to
                        </span>
                        <span className="font-bold text-4xl text-white">
                            Hồng Sơn Auto
                        </span>
                    </div>
                </Col>
                <Col
                    xl={12}
                    lg={12}
                    md={12}
                    sm={24}
                    xs={24}
                    className="flex items-center justify-center"
                >
                    <div
                        className="w-full flex flex-col justify-center items-center px-4"
                        style={
                            !screens.md
                                ? {
                                      backgroundImage: `url(${backgroundImage})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      backgroundRepeat: "no-repeat",
                                      minHeight: "100vh",
                                  }
                                : {}
                        }
                    >
                        <Card
                            className="w-full max-w-96 shadow"
                            title="Vui lòng nhập thông tin đăng nhập"
                        >
                            <div className="content">
                                <Form
                                    name="basic"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 24 }}
                                    layout={"vertical"}
                                    initialValues={{
                                        remember: false,
                                    }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="on"
                                    form={form}
                                >
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Hãy nhập Email!",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Nhập Email" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Mật khẩu"
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Hãy nhập Mật khẩu!",
                                            },
                                        ]}
                                    >
                                        <Input.Password placeholder="Nhập mật khẩu" />
                                    </Form.Item>
                                    <Form.Item name="forgotPassword">
                                        <Typography.Paragraph
                                            style={{
                                                color: "blue",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                setShowForgotPasswordModal(
                                                    true
                                                );
                                            }}
                                        >
                                            Quên mật khẩu?
                                        </Typography.Paragraph>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            className="w-full"
                                            type="primary"
                                            htmlType="submit"
                                            loading={isLoading}
                                        >
                                            Đăng Nhập
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
            <Modal
                title="Quên mật khẩu?"
                open={showForgotPasswordModal}
                confirmLoading={isForgotLoading}
                onOk={() => {
                    forgotPasswordForm.submit();
                }}
                onCancel={() => {
                    forgotPasswordForm.resetFields();
                    setShowForgotPasswordModal(false);
                }}
            >
                <Form
                    form={forgotPasswordForm}
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
        </>
    );
};

export default LoginScreen;
