"use client";
import React, { useState } from "react";
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    message,
    notification,
    Row,
    Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authAPI from "@/src/api/authAPI";
import { SUCCESS_STATUSES } from "@/app/constants";
import { ApiResponse } from "@/types/api-response.type";
import { getErrorMessage } from "@/utils/handle-error.utils";
export default function Verify(props) {
    const { id } = props;
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onFinish = async (values) => {
        try {
            setIsLoading(true);
            const res: ApiResponse<any> = await authAPI.checkCode(values);
            if (SUCCESS_STATUSES.includes(res.status as number)) {
                message.success("Kích hoạt tài khoản thành công.");
                router.push(`/login`);
            } else {
                notification.error({
                    message: "Verify error",
                    description: res?.message,
                });
            }
        } catch (error) {
            console.error("Lỗi khi kích hoạt tài khoản: ", error);
            const errorMessage = getErrorMessage(
                error,
                "Đã có lỗi xảy ra khi kích hoạt tài khoản. Vui lòng thử lại sau"
            );
            notification.error({
                message: "Có lỗi xảy ra",
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <Spin tip="Đang quay trở lại trang đăng nhập..." size="large" />
            </div>
        );
    }

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset
                    style={{
                        padding: "15px",
                        margin: "5px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                >
                    <legend>Kích hoạt tài khoản</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Id"
                            name="id"
                            initialValue={id}
                            hidden
                        >
                            <Input disabled />
                        </Form.Item>
                        <div>
                            Mã code đã được gửi tới email đăng ký, vui lòng kiểm
                            tra email.
                        </div>
                        <Divider />

                        <Form.Item
                            label="Code"
                            name="codeId"
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
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link href={"/signup"}>
                        <ArrowLeftOutlined /> Quay lại trang đăng kí
                    </Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Đã có tài khoản? <Link href={"/login"}>Đăng nhập</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
}
