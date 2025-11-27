import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Select,
    Row,
    message,
    InputNumber,
    notification,
} from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import {
    CustomerType,
    GenderType,
    RegExps,
    RoleEnum,
    RoleEnumValue,
} from "../../../constants";
import UploadAvatarGetUrlWithImgCrop, {
    UploadAvatarGetUrlWithImgCropRemoteMode,
} from "../../../containers/UploadAvatarGetUrlWithImgCrop";
import dayjs from "dayjs";
import apiClient from "../../../api/apiClient";
import endpoints from "../../../api/endpoints";
import { useNavigate } from "react-router";
import { ApiResponse } from "@/types/api-response.type";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
    },
    wrapperCol: {
        xs: { span: 24 },
    },
};

const UserForm = ({ userBasicInfo }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleFormFinish = async (values) => {
        const updateInfo = {
            username: values.username || userBasicInfo.username,
            phoneNumber: values.phoneNumber || userBasicInfo.phoneNumber,
            gender: values.gender || userBasicInfo.gender,
            Roles: values.Roles,
            birthday: values.birthday
                ? values.birthday.format("YYYY-MM-DD")
                : null,
        };

        try {
            const data: ApiResponse = await apiClient.patch(
                endpoints.customers.update(values.id),
                updateInfo
            );
            if (data.status == 200) {
                message.success(data.message);
                navigate("/customer");
            } else {
                message.error(data?.message[0] || data?.message);
            }
        } catch (error) {
            message.error("Lỗi cập nhật, vui lòng thử lại sau");
            throw new Error("Lỗi cập nhật");
        }
    };

    useEffect(() => {
        if (userBasicInfo && Object.keys(userBasicInfo).length > 0) {
            form.setFieldsValue({
                ...userBasicInfo,
                birthday: userBasicInfo?.birthday
                    ? dayjs(userBasicInfo.birthday)
                    : null,
                Roles: userBasicInfo?.Roles?.name,
            });
        }
    }, [userBasicInfo, form]);

    return (
        <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            onFinish={handleFormFinish}
        >
            {/* Avatar */}
            <Form.Item className="flex justify-center" name="avatarUrl">
                <UploadAvatarGetUrlWithImgCrop
                    remoteMode={UploadAvatarGetUrlWithImgCropRemoteMode.Private}
                    disabled={true}
                />
            </Form.Item>

            {/* Chia thành 2 cột */}
            <Col span={12}>
                <Form.Item
                    label="id"
                    name="id"
                    hidden
                    rules={[{ required: true, message: "id!" }]}
                >
                    <Input placeholder="id" />
                </Form.Item>
            </Col>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Họ và tên"
                        name="username"
                        rules={[
                            { required: true, message: "Hãy nhập họ và tên!" },
                        ]}
                    >
                        <Input placeholder="Nhập Họ và tên" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập số điện thoại!",
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
                        <Input placeholder="Nhập Số điện thoại" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Ngày sinh" name="birthday">
                        <DatePicker
                            placeholder="Chọn ngày sinh"
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Email" name="email">
                        <Input placeholder="Email" disabled={true} />
                    </Form.Item>
                </Col>

                <Col push={12} span={12}>
                    <Form.Item label="Giới tính" name="gender">
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
                </Col>

                <Col span={24} className="flex justify-end">
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default UserForm;
