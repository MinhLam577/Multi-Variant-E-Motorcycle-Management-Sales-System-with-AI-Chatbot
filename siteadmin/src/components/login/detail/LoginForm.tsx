import {
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    Grid,
    Image,
    Input,
    Row,
    Typography,
} from "antd";
import { observer } from "mobx-react-lite";
const { useBreakpoint } = Grid;

const LoginForm = ({
    onFinish,
    form,
    setShowForgotPasswordModal,
    setShowRetryActive,
    isLoading,
    setShowRegisterModal,
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
                            src="/logo-test.svg"
                            alt="logo"
                            width={180}
                            height={80}
                        />
                        <span className="font-bold text-2xl text-white">
                            Welcome to
                        </span>
                        <span className="font-bold text-4xl text-white">
                            minhdeptrai.site
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
                                    <Form.Item noStyle>
                                        <div className="flex justify-between items-center !mb-4">
                                            <Form.Item
                                                name="remember"
                                                valuePropName="checked"
                                                noStyle
                                            >
                                                <Checkbox>
                                                    Ghi nhớ đăng nhập
                                                </Checkbox>
                                            </Form.Item>

                                            <Typography.Paragraph
                                                style={{
                                                    color: "blue",
                                                    cursor: "pointer",
                                                    margin: 0,
                                                }}
                                                onClick={() =>
                                                    setShowForgotPasswordModal(
                                                        true
                                                    )
                                                }
                                            >
                                                Quên mật khẩu?
                                            </Typography.Paragraph>
                                        </div>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            className="w-full"
                                            type="primary"
                                            htmlType="submit"
                                            loading={isLoading}
                                        >
                                            Đăng nhập
                                        </Button>
                                    </Form.Item>
                                    {/* Đăng ký & Kích hoạt lại tài khoản */}
                                    <div className="flex justify-between items-center mt-2">
                                        <Typography.Paragraph
                                            style={{
                                                color: "blue",
                                                cursor: "pointer",
                                                margin: 0,
                                            }}
                                            onClick={() =>
                                                setShowRegisterModal(true)
                                            }
                                        >
                                            Người mới? Đăng ký
                                        </Typography.Paragraph>

                                        <Typography.Paragraph
                                            style={{
                                                color: "blue",
                                                cursor: "pointer",
                                                margin: 0,
                                            }}
                                            onClick={() => {
                                                setShowRetryActive(true);
                                            }}
                                        >
                                            Kích hoạt tài khoản
                                        </Typography.Paragraph>
                                    </div>
                                </Form>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default observer(LoginForm);
