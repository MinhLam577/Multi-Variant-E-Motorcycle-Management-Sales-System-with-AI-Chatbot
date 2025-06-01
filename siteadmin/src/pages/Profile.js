import {
    CloseOutlined,
    EditOutlined,
    KeyOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    message,
    Row,
    Select,
} from "antd";
import { reaction, toJS, values } from "mobx";
import { useEffect, useState } from "react";
import endpoints from "../api/endpoints.ts";
import ChangePasswordModal from "../containers/ChangePasswordModal";
import {
    ProcessModalName,
    processWithModals,
} from "../containers/processWithModals";
import UploadAvatarGetUrlWithImgCrop, {
    UploadAvatarGetUrlWithImgCropRemoteMode,
} from "../containers/UploadAvatarGetUrlWithImgCrop";
import { useStore } from "../stores";
import { regexPhone, regexUsername } from "../utils/regex";
import { runInAction } from "mobx";
const Profile = () => {
    const [form] = Form.useForm();
    const { accountObservable, userObservable } = useStore();
    const user = accountObservable?.account;
    const [isEditing, setIsEditing] = useState(false);
    const [openChangePasswordModal, setOpenChangePasswordModal] =
        useState(false);
    const [loading, setLoading] = useState(false);
    // Đồng bộ form với dữ liệu từ userObservable khi mount hoặc khi user thay đổi
    useEffect(() => {
        form.setFieldsValue(user); // Cập nhật form với dữ liệu ban đầu
    }, [user, form]);
    useEffect(() => {
        return reaction(
            () => userObservable.status,
            (status, prevStatus) => {
                handleLoginEvents(prevStatus, status);
            }
        );
    }, []);

    const handleLoginEvents = (prevStatus, status) => {
        if (prevStatus === "submitting") {
            setLoading(false);
        }
        switch (status) {
            case "submitting": {
                setLoading(true);
                break;
            }

            case "updateSuccess": {
                message.success("Thay đổi thông tin người dùng thành công!");
                const updatedData = toJS(userObservable.me); // Lấy dữ liệu mới nhất
                runInAction(() => {
                    form.setFieldsValue(updatedData);
                });
                switchMode(false); // Đóng chế độ chỉnh sửa
                break;
            }
            case "updateFailed": {
                message.error("Cập nhật thông tin thất bại!");
                break;
            }
            default: {
                break;
            }
        }
    };

    const switchMode = (enableEditing, values) => {
        if (!enableEditing) {
            form.setFieldsValue(values || user);
        }
        setIsEditing(enableEditing);
    };

    const handleUpdateUserProfile = async (values) => {
        const dto = {
            ...values,
        };
        await userObservable.updateUserProfile(dto, user?.userId || user?.id);
    };

    return (
        <>
            <Card
                title="Thông tin cơ bản"
                extra={
                    isEditing ? (
                        <>
                            <Button
                                title="Hủy"
                                onClick={() =>
                                    processWithModals(
                                        ProcessModalName.ConfirmCancelEditing
                                    )(() => switchMode(false))
                                }
                            >
                                <CloseOutlined />
                            </Button>
                            <Divider type="vertical" />
                            <Button title="Lưu" onClick={() => form.submit()}>
                                <SaveOutlined />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                title="Chỉnh sửa"
                                onClick={() => switchMode(true)}
                            >
                                <EditOutlined />
                            </Button>
                        </>
                    )
                }
                actions={[
                    <Button
                        key={1}
                        title="Thay đổi mật khẩu"
                        onClick={() => setOpenChangePasswordModal(true)}
                    >
                        <KeyOutlined />
                        &nbsp;Thay đổi mật khẩu
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    disabled={!isEditing}
                    onFinish={(values) =>
                        processWithModals(ProcessModalName.ConfirmSaveEditing)(
                            () => handleUpdateUserProfile(values)
                        )
                    }
                >
                    <Form.Item
                        name="avatarUrl"
                        label="Hình đại diện"
                        tooltip={`Hình đại diện`}
                    >
                        <UploadAvatarGetUrlWithImgCrop
                            remoteMode={
                                UploadAvatarGetUrlWithImgCropRemoteMode.Private
                            }
                            uploadUrl={endpoints.user.uploadAvatar()}
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Họ tên không được để trống",
                                    },
                                    {
                                        pattern: regexUsername,
                                        message: "Họ tên không hợp lệ",
                                    },
                                ]}
                                name={"username"}
                                label={"Họ và tên"}
                            >
                                <Input placeholder="Nhập Họ và tên" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={"email"} label={"Email"}>
                                <Input disabled placeholder="Nhập Email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Số điện thoại không được để trống",
                                    },
                                    {
                                        pattern: regexPhone,
                                        message: "Số điện thoại không hợp lệ",
                                    },
                                ]}
                                name={"phoneNumber"}
                                label={"Số điện thoại"}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={"Roles"} label={"Role"}>
                                <Select
                                    options={[
                                        { value: "admin", label: "Admin" },
                                        { value: "user", label: "User" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name={"address"} label={"Địa chỉ"}>
                                <Input placeholder="Nhập Địa chỉ" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
            <ChangePasswordModal
                open={openChangePasswordModal}
                cancelCallback={() => setOpenChangePasswordModal(false)}
            />
        </>
    );
};

export default Profile;
