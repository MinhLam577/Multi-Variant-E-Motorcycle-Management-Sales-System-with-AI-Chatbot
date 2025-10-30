"use client";

import { useHasMounted } from "@/utils/customhook";
import { Button, Form, Input, message, Modal, notification, Steps } from "antd";
import {
    SmileOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import authAPI from "@/src/api/authAPI";
import { ApiResponse } from "@/types/api-response.type";
import { RetryActiveResponse } from "@/types/auth-response.type";
import { AxiosResponse } from "axios";
import { SUCCESS_STATUSES } from "@/app/constants";
import { getErrorMessage } from "@/utils/handle-error.utils";

interface ModalReactiveProps {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    userEmail: string;
    onCloseReactivate: () => void;
}

const ModalReactive = (props: ModalReactiveProps) => {
    const { isModalOpen, setIsModalOpen, userEmail, onCloseReactivate } = props;
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [userId, setUserId] = useState("");

    const hasMounted = useHasMounted();

    useEffect(() => {
        if (userEmail) {
            form.setFieldValue("email", userEmail);
        }
    }, [userEmail]);

    if (!hasMounted) return <></>;

    const onFinishStep0 = async (values) => {
        try {
            const { email } = values;
            const res: ApiResponse<RetryActiveResponse> =
                await authAPI.retry_active(email);
            if (SUCCESS_STATUSES.includes(res.status as number)) {
                setUserId(res.data?.id);
                setCurrent(1);
                message.success(
                    "Gửi lại email thành công. Vui lòng kiểm tra hộp thư để lấy mã xác nhận."
                );
            } else {
                message.error(res.message);
            }
        } catch (error) {
            console.error("Lỗi khi resend email: ", error);
            const errorMessage = getErrorMessage(
                error,
                "Đã có lỗi xảy ra khi gửi lại email. Vui lòng thử lại sau"
            );
            message.error(errorMessage);
        }
    };

    const onFinishStep1 = async (values) => {
        try {
            const { code } = values;
            const res: ApiResponse<null> = await authAPI.checkCode({
                codeId: code,
                id: userId,
            });
            if (SUCCESS_STATUSES.includes(res.status as number)) {
                setCurrent(2);
                message.success("Kích hoạt tài khoản thành công.");
            } else {
                message.error(res.message);
            }
        } catch (error) {
            console.error("Lỗi khi kích hoạt tài khoản: ", error);
            const errorMessage = getErrorMessage(
                error,
                "Đã có lỗi xảy ra khi kích hoạt tài khoản. Vui lòng thử lại sau"
            );
            message.error(errorMessage);
        }
    };
    return (
        <>
            <Modal
                title="Kích hoạt tài khoản"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => {
                    setCurrent(0);
                    onCloseReactivate();
                }}
                maskClosable={false}
                footer={null}
                destroyOnHidden={true}
            >
                <Steps
                    current={current}
                    items={[
                        {
                            title: "Login",
                            // status: 'finish',
                            icon: <UserOutlined />,
                        },
                        {
                            title: "Verification",
                            // status: 'finish',
                            icon: <SolutionOutlined />,
                        },

                        {
                            title: "Done",
                            // status: 'wait',
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current === 0 && (
                    <>
                        <div style={{ margin: "20px 0" }}>
                            <p>Tải khoản của bạn chưa được kích hoạt</p>
                        </div>
                        <Form
                            name="verify"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout="vertical"
                            form={form}
                        >
                            <Form.Item label="" name="email">
                                <Input disabled value={userEmail} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Resend
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {current === 1 && (
                    <>
                        <div style={{ margin: "20px 0" }}>
                            <p>
                                Vui lòng kiểm tra lại gmail và nhập mã xác nhận
                            </p>
                        </div>

                        <Form
                            name="verify2"
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
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Active
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {current === 2 && (
                    <div style={{ margin: "20px 0" }}>
                        <p>
                            Tải khoản của bạn đã được kích hoạt thành công. Vui
                            lòng đăng nhập lại
                        </p>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ModalReactive;
