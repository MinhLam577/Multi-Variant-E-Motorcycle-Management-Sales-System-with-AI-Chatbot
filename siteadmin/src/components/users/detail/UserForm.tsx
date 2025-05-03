import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Select,
    Row,
    InputNumber,
} from "antd";
import React, { useEffect } from "react";
import { GenderType, RegExps, UserType } from "../../../constants";
import UploadAvatarGetUrlWithImgCrop, {
    UploadAvatarGetUrlWithImgCropRemoteMode,
} from "../../../containers/UploadAvatarGetUrlWithImgCrop";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { useStore } from "src/stores";
import { UpdateUserDto, UserStaffResponseType } from "src/stores/user.store";
import { observer } from "mobx-react-lite";
import UserAPI from "src/api/user.api";
interface UserFormProps {
    userBasicInfo: UserStaffResponseType;
}
type UserFormType = Omit<UserStaffResponseType, "birthday" | "roles"> & {
    birthday: dayjs.Dayjs | null;
    roles: string | null;
};
const UserForm: React.FC<UserFormProps> = ({ userBasicInfo }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm<UserFormType>();
    const store = useStore();
    const handleFormFinish = async (values: UserFormType) => {
        const updateInfo: UpdateUserDto = {
            username: values.username || userBasicInfo.username,
            age: values.age || userBasicInfo.age,
            address: values.address || userBasicInfo.address,
            phoneNumber: values.phoneNumber || userBasicInfo.phoneNumber,
            gender: values.gender || userBasicInfo.gender,
            Roles: values.roles as keyof typeof UserType,
            birthday: values.birthday
                ? values.birthday.format("YYYY-MM-DD")
                : null,
        };
        try {
            const res = await UserAPI.update(values.id, updateInfo);
            if (res) {
                store.setStatusMessage(
                    200,
                    "",
                    "Cật nhật thông tin người dùng thành công",
                    true
                );
                navigate("/users", { replace: true });
            } else {
                store.setStatusMessage(
                    500,
                    "Có lỗi xảy ra khi cập nhật thông tin người dùng.",
                    "",
                    false
                );
            }
        } catch (error) {
            console.error("Lỗi cập nhật thông tin người dùng:", error);
            store.setStatusMessage(
                500,
                "Có lỗi xảy ra khi cập nhật thông tin người dùng.",
                "",
                false
            );
        }
    };

    useEffect(() => {
        if (userBasicInfo) {
            form.setFieldsValue({
                ...userBasicInfo,
                birthday: userBasicInfo.birthday
                    ? dayjs(userBasicInfo.birthday)
                    : null,
                roles: userBasicInfo.roles?.[0]?.name || null,
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
                            format="DD/MM/YYYY"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Địa chỉ" name="address">
                        <Input placeholder="Địa chỉ" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Email" name="email">
                        <Input placeholder="Email" disabled={true} />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        label="Tuổi"
                        name="age"
                        rules={[{ required: true, message: "Hãy nhập tuổi" }]}
                    >
                        <InputNumber
                            placeholder="Nhập số tuổi"
                            style={{ width: "100%" }}
                            min={1} // Giới hạn số tuổi không âm
                        />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Giới tính" name="gender">
                        <Select
                            allowClear
                            optionFilterProp="label"
                            options={Object.keys(GenderType).map((item) => ({
                                value: item,
                                label: UserType[item],
                            }))}
                            placeholder="Chọn giới tính"
                        />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        label="Loại người dùng"
                        name="roles"
                        initialValue={
                            form.getFieldValue("roles")
                                ? form.getFieldValue("roles")
                                : undefined
                        }
                    >
                        <Select
                            allowClear
                            optionFilterProp="label"
                            options={Object.keys(UserType).map((item) => ({
                                value: item,
                                label: UserType[item],
                            }))}
                            placeholder="Chọn loại người dùng"
                        />
                    </Form.Item>
                </Col>
                <Col push={12} span={12} className="flex justify-end">
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

export default observer(UserForm);
