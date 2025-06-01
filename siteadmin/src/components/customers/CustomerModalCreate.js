import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Button,
    DatePicker,
    Divider,
    Form,
    Input,
    message,
    Modal,
    notification,
    Select,
} from "antd";
import {
    CustomerType,
    GenderType,
    RegExps,
    RoleEnum,
    RoleEnumValue,
} from "../../constants";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import { getErrorMessage } from "../../utils/index";
const CustomerModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            setIsSubmit(true);
            const updateInfo = {
                ...values,
                role: RoleEnum.USER,
                birthday: values.birthday
                    ? values.birthday.format("YYYY-MM-DD")
                    : null,
            };

            setIsSubmit(true);

            const res = await apiClient
                .post(endpoints.customers.create, updateInfo)
                .catch((error) => {
                    throw error;
                });
            if (res && res.data) {
                message.success("Tạo mới user thành công");
                form.resetFields();
                setOpenModalCreate(false);
                await props.fetchUser();
            } else {
                const errorMessage = getErrorMessage(
                    res,
                    "Lỗi khi tạo người dùng"
                );
                notification.error({
                    message: errorMessage,
                });
            }
        } catch (e) {
            const errorMessage = getErrorMessage(e, "Lỗi khi tạo người dùng");
            notification.error({
                message: errorMessage,
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <>
            <Modal
                title="Thêm mới người dùng"
                open={openModalCreate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => setOpenModalCreate(false)}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên hiển thị"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên hiển thị!",
                            },
                        ]}
                        style={{ marginBottom: "10px" }} // Giảm khoảng cách xuống 8px
                    >
                        <Input placeholder="Nhập tên hiển thị" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                        ]}
                        style={{ marginBottom: "10px" }} // Giảm khoảng cách xuống 8px
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phoneNumber"
                        style={{ marginBottom: "10px" }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                            {
                                pattern: /^\d{10}$/,
                                message: "Số điện thoại phải có đúng 10 số!",
                            },
                            () => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        RegExps.PhoneNumber.test(value)
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Số điện thoại không đúng định dạng."
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        style={{ marginBottom: "10px" }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập địa chỉ!",
                            },
                        ]}
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>

                    <Form.Item
                        label="Ngày sinh"
                        name="birthday"
                        style={{ marginBottom: "10px" }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ngày sinh!",
                            },
                        ]}
                    >
                        <DatePicker
                            placeholder="Chọn ngày sinh"
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        style={{ marginBottom: "10px" }}
                    >
                        <Select
                            allowClear
                            optionFilterProp="label"
                            options={Object.keys(GenderType).map((item) => ({
                                value: item,
                                label: GenderType[item],
                            }))}
                            placeholder="Chọn giới tính"
                        />
                    </Form.Item>

                    {/* <Form.Item
                        label="Loại người dùng"
                        name="role"
                        style={{ marginBottom: "10px" }}
                    >
                        <Select
                            allowClear
                            optionFilterProp="label"
                            options={Object.keys(CustomerType).map((item) => ({
                                value: item,
                                label: CustomerType[item],
                            }))}
                            placeholder="Chọn loại người dùng"
                        />
                    </Form.Item> */}
                </Form>
            </Modal>
        </>
    );
};

export default CustomerModalCreate;
