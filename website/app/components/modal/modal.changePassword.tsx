"use client";

import { Button, Form, Input, message, Modal, notification, Steps } from "antd";
import {
    SmileOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { useHasMounted } from "@/utils/customhook";
import authAPI from "@/src/api/authAPI";
import { ApiResponse } from "@/types/api-response.type";
import { getErrorMessage } from "@/utils/handle-error.utils";
import { SUCCESS_STATUSES } from "@/app/constants";
interface ModalChangePasswordProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    onCloseModal?: () => void;
}
const ModalChangePassword = (props: ModalChangePasswordProps) => {
    const { isModalOpen, setIsModalOpen, onCloseModal } = props;
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [userEmail, setUserEmail] = useState("");

    const hasMounted = useHasMounted();

    if (!hasMounted) return <></>;

    const onFinishStep0 = async (values) => {
        try {
            const { email } = values;
            const res: ApiResponse<any> = await authAPI.retry_password(email);

            if (SUCCESS_STATUSES.includes(res.status as number)) {
                setUserEmail(res?.data?.email);
                setCurrent(1);
                notification.success({
                    message: "Gửi mail thành công",
                    description: "Vui lòng kiểm tra hộp thư để lấy mã xác nhận",
                });
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description:
                        "Gửi mail không thành công, vui lòng thử lại sau",
                });
                message.error(res.message);
            }
        } catch (error) {
            console.error("Lỗi khi gửi email: ", error);
            const errorMessage = getErrorMessage(
                error,
                "Đã có lỗi xảy ra khi gửi email. Vui lòng thử lại sau"
            );
            notification.error({
                message: "Có lỗi xảy ra",
                description: errorMessage,
            });
        }
    };

    const onFinishStep1 = async (values) => {
        try {
            const { code, password, confirmPassword } = values;

            if (password !== confirmPassword) {
                notification.error({
                    message: "Thông tin nhập không chính xác",
                    description:
                        "Mật khẩu và xác nhận mật khẩu không chính xác",
                });
                return;
            }
            const res: ApiResponse<any> = await authAPI.change_password({
                codeId: code,
                password: password,
                confirmpassword: confirmPassword,
                email: userEmail,
            });

            if (SUCCESS_STATUSES.includes(res.status as number)) {
                setCurrent(2);
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res?.message,
                });
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu: ", error);
            const errorMessage = getErrorMessage(
                error,
                "Đã có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại sau"
            );
            notification.error({
                message: "Có lỗi xảy ra",
                description: errorMessage,
            });
        }
    };
    return (
        <>
            <Modal
                title="Quên mật khẩu"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => {
                    setCurrent(0);
                    setIsModalOpen(false);
                    if (onCloseModal) onCloseModal();
                }}
                maskClosable={false}
                footer={null}
            >
                <Steps
                    current={current}
                    items={[
                        {
                            title: "Email",
                            icon: <UserOutlined />,
                        },
                        {
                            title: "Verification",
                            icon: <SolutionOutlined />,
                        },

                        {
                            title: "Done",
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current === 0 && (
                    <>
                        <div style={{ margin: "20px 0" }}>
                            <p>
                                Để thực hiện thay đổi mật khẩu, vui lòng nhập
                                email tài khoản của bạn.
                            </p>
                        </div>
                        <Form
                            name="change-password"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout="vertical"
                            form={form}
                        >
                            <Form.Item label="" name="email">
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {current === 1 && (
                    <>
                        <div style={{ margin: "20px 0" }}>
                            <p>Vui lòng thực hiện đổi mật khẩu</p>
                        </div>

                        <Form
                            name="change-pass-2"
                            onFinish={onFinishStep1}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                label="Code"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your code!",
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu mới"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please input your new password!",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please input your new password!",
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Confirm
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {current === 2 && (
                    <div style={{ margin: "20px 0" }}>
                        <p>
                            Tải khoản của bạn đã được thay đổi mật khẩu thành
                            công. Vui lòng đăng nhập lại
                        </p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ModalChangePassword;
