import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Form, Input, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ForgotPassword } from "@/types/userForgotPassword.type";
import { useStore } from "@/stores";
import { ResetPassword } from "@/types/auth-validate.type";
import { delayFunction } from "@/utils";

const ResetPasswordPage = () => {
    const [params] = useSearchParams();
    const token = params.get("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [isLoadingToken, setIsLoadingToken] = useState(true);
    const [form] = Form.useForm<ForgotPassword>();
    const [isSuccess, setIsSuccess] = useState(false);
    const { loginObservable: loginStore } = useStore();
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsLoadingToken(false);
                setIsTokenValid(false);
                message.error("Liên kết không hợp lệ");
                return;
            }
            try {
                await loginStore.verifyResetPassword({ token });
                if (loginStore.status === 200) {
                    setIsTokenValid(true);
                    return;
                }
                setIsTokenValid(false);
            } catch (error) {
                setIsTokenValid(false);
            } finally {
                setIsLoadingToken(false);
            }
        };
        verifyToken();
    }, [token]);
    const onFinish = async (values: ForgotPassword) => {
        setLoading(true);
        try {
            // Simulate API call
            await loginStore.resetPassword({
                token: token,
                newPassword: values.password,
            });
            if (loginStore.status === 200) {
                setIsSuccess(true);
                form.resetFields();
                return;
            }
            message.error(loginStore.errorMsg);
        } catch (error) {
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            const delayFunc = delayFunction({
                time: 3000,
                callback: () => navigate("/"),
            });
            return () => clearTimeout(delayFunc);
        }
    }, [isSuccess, navigate]);

    const validateConfirmPassword = (_: any, value: string) => {
        if (value && value !== form.getFieldValue("password")) {
            return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
        }
        return Promise.resolve();
    };

    if (isLoadingToken) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <Spin size="large" tip="Đang kiểm tra liên kết..." />
            </div>
        );
    }

    if (!isTokenValid) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-600">
                        Liên kết không hợp lệ
                    </h2>
                    <p className="mt-4">
                        Vui lòng kiểm tra lại liên kết hoặc yêu cầu đặt lại mật
                        khẩu mới.
                    </p>
                    <a
                        href="/"
                        className="text-blue-600 hover:underline mt-4 inline-block no-underline"
                    >
                        Trở lại trang đăng nhập
                    </a>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
                    <Spin size="large" />
                    <h2 className="text-2xl font-bold text-green-600 mt-4">
                        Mật khẩu đã được đặt lại thành công!
                    </h2>
                    <p className="mt-4">
                        Đang quay trở lại trang đăng nhập trong giây lát...
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Đặt Lại Mật Khẩu
                </h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Mật khẩu mới"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu mới!",
                            },
                            {
                                min: 8,
                                message: "Mật khẩu phải có ít nhất 8 ký tự!",
                            },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                message:
                                    "Mật khẩu phải chứa chữ hoa, chữ thường và số!",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu mới"
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng xác nhận mật khẩu!",
                            },
                            { validator: validateConfirmPassword },
                        ]}
                    >
                        <Input.Password
                            placeholder="Xác nhận mật khẩu mới"
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            Đặt lại mật khẩu
                        </Button>
                    </Form.Item>
                    <div className="text-center mt-4">
                        <a
                            href="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Quay lại trang đăng nhập
                        </a>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
