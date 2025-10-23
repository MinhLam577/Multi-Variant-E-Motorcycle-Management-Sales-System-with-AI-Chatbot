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
import endpoints from "../api/endpoints";
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
import { LoginStatus, UpdateProfileStatus } from "src/types/userLogin.type";
import { Navigate, useNavigate } from "react-router";
const Profile = () => {
    const [form] = Form.useForm();
    const { accountObservable, userObservable } = useStore();
    const user = accountObservable?.account;
    const [isEditing, setIsEditing] = useState(false);
    const [openChangePasswordModal, setOpenChangePasswordModal] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formInit, setFormInit] = useState(null);

    const fetchUser = async () => {
        const user_data = await accountObservable.getAccount();
        if (!user_data) {
            message.error("Không tìm thấy người dùng, vui lòng đăng nhập lại");
            navigate("/login");
            return;
        }
        console.log("user_Data", user_data);
        form.setFieldsValue(user_data);
        setFormInit(user_data);
    };
    useEffect(() => {
        fetchUser();
        return reaction(
            () => userObservable.status,
            (status, prevStatus) => {
                handleFetchProfileData(prevStatus, status);
            }
        );
    }, []);

    const handleFetchProfileData = (prevStatus, status) => {
        if (prevStatus === UpdateProfileStatus.SUBMITTING) {
            setLoading(false);
        }
        switch (status) {
            case UpdateProfileStatus.SUBMITTING: {
                setLoading(true);
                break;
            }

            case UpdateProfileStatus.UPDATE_SUCCESS: {
                message.success("Thay đổi thông tin người dùng thành công!");
                const updatedData = toJS(userObservable.me); // Lấy dữ liệu mới nhất
                runInAction(() => {
                    form.setFieldsValue(updatedData);
                });
                switchMode(false); // Đóng chế độ chỉnh sửa
                break;
            }
            case UpdateProfileStatus.UPDATE_FAILED: {
                message.error("Cập nhật thông tin thất bại!");
                break;
            }
            default: {
                break;
            }
        }
    };

    const switchMode = (enableEditing, values?: any) => {
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
                                    processWithModals({
                                        modalName:
                                            ProcessModalName.ConfirmCancelEditing,
                                        onOk: () => switchMode(false),
                                    })
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
                        processWithModals({
                            modalName: ProcessModalName.ConfirmSaveEditing,
                            onOk: () => handleUpdateUserProfile(values),
                        })
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
                            folder={endpoints.user.uploadAvatar()}
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
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
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <Form.Item name={"email"} label={"Email"}>
                                <Input disabled placeholder="Nhập Email" />
                            </Form.Item>
                        </Col>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
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
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
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
