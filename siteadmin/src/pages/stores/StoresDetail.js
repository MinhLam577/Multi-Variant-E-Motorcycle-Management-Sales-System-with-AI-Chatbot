import {
    CloseOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, message, Select } from "antd";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router";
import { NewsStatusLabel } from "../../constants";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import UploadAvatarGetUrlWithImgCrop, {
    UploadAvatarGetUrlWithImgCropRemoteMode,
} from "../../containers/UploadAvatarGetUrlWithImgCrop";
import endpoints from "../../api/endpoints.ts";
import WarehouseSelect from "../../containers/WarehouseSelect";
import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";

export const StoresDetailMode = {
    View: 1,
    Add: 2,
    Edit: 3,
};

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
    },
    wrapperCol: {
        xs: { span: 24 },
    },
};

const StoresDetail = ({ mode }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const getCardTitle = () => {
        if (mode === StoresDetailMode.View) {
            return "Chi tiết cửa hàng";
        } else if (mode === StoresDetailMode.Add) {
            return "Tạo cửa hàng";
        } else if (mode === StoresDetailMode.Edit) {
            return "Chỉnh sửa cửa hàng";
        }
    };

    const getButtonOkText = () => {
        if (mode === StoresDetailMode.Add) {
            return (
                <>
                    <PlusOutlined />
                    &nbsp;Tạo
                </>
            );
        } else if (mode === StoresDetailMode.Edit) {
            return (
                <>
                    <SaveOutlined />
                    &nbsp;Lưu
                </>
            );
        }
    };

    const getButtonCancelText = () => {
        if (mode === StoresDetailMode.Add) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Hủy
                </>
            );
        } else if (mode === StoresDetailMode.Edit) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Hủy
                </>
            );
        } else if (mode === StoresDetailMode.View) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Đóng
                </>
            );
        }
    };

    const getButtonEditText = () => {
        if (mode === StoresDetailMode.View) {
            return (
                <>
                    <EditOutlined />
                    &nbsp;Sửa
                </>
            );
        }
    };

    const isReadOnly = () => {
        if (mode === StoresDetailMode.Add) {
            return false;
        } else if (mode === StoresDetailMode.Edit) {
            return false;
        }

        // mode === StoresDetailMode.View
        return true;
    };

    const handleOk = () => {
        if (mode === StoresDetailMode.Add) {
            form.submit();
        } else if (mode === StoresDetailMode.Edit) {
            form.submit();
        }
    };

    const handleCancel = () => {
        if (mode === StoresDetailMode.Edit) {
            processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
                navigate(`/stores`);
            });
        } else {
            navigate("/stores");
        }
    };

    const handleEdit = () => {
        if (mode === StoresDetailMode.View) {
            navigate(`/stores/${id}/edit`, { replace: true });
        }
    };
    const handleFormFinish = async (values) => {
        const { wareHouses, id, ...data } = values;
        const warehouseObjects = wareHouses.map((id) => ({ id }));

        try {
            const dto = { ...data, wareHouses: warehouseObjects };

            if (mode === StoresDetailMode.Add) {
                if (!dto.logo) {
                    dto.logo = "default";
                }
                const data = await apiClient.post(endpoints.branch.create, dto);
                if (data.status == 200) {
                    message.success(data.message);
                    navigate("/stores");
                } else {
                    data.error("Thêm mới thất bại");
                }
            } else if (mode === StoresDetailMode.Edit) {
                const data = await apiClient.patch(
                    endpoints.branch.update(id),
                    dto
                );
                if (data.status == 200) {
                    message.success(data.message);
                    navigate("/stores");
                } else {
                    data.error("Cập nhật chi nhánh thất bại");
                }
            }
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            message.error("Có lỗi xảy ra, vui lòng thử lại!"); // Hiển thị thông báo lỗi
        }
    };

    const [wareHouses, setWarehose] = useState([]);
    useEffect(() => {
        const GetStoreById = async () => {
            try {
                const { data } = await apiClient.get(
                    endpoints.branch.details(id)
                );
                form.setFieldsValue({
                    ...data,
                    wareHouses: data.wareHouses?.map((wh) => wh.id) || [], // Đặt danh sách kho theo ID
                });
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu danh mục blog:", error);
            }
        };

        if (id) {
            GetStoreById();
        }
    }, [id, form]);

    useEffect(() => {
        const GetWareHouse = async () => {
            try {
                const { data } = await apiClient.get(
                    endpoints.warehouse.list()
                );
                setWarehose(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu danh mục blog:", error);
            }
        };

        GetWareHouse();
    }, [form]);

    return (
        <>
            <Card loading={false} title={getCardTitle()}>
                <Form
                    form={form}
                    {...formItemLayout}
                    layout={"vertical"}
                    autoComplete="off"
                    onFinish={handleFormFinish}
                >
                    <Form.Item
                        name="logo"
                        label="Hình đại diện"
                        tooltip="Hình đại diện"
                    >
                        <UploadAvatarGetUrlWithImgCrop
                            showUploadList={{
                                showRemoveIcon: mode !== StoresDetailMode.View, // ẩn nút xóa nếu đang ở chế độ View
                                showPreviewIcon: true,
                            }}
                            remoteMode={
                                UploadAvatarGetUrlWithImgCropRemoteMode.Private
                            }
                            //   uploadUrl={endpoints.user.uploadAvatar()}
                            uploadUrl={endpoints.branch.upload}
                        />
                    </Form.Item>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Tên cửa hàng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập tên cửa hàng!",
                            },
                        ]}
                    >
                        <Input
                            readOnly={isReadOnly()}
                            placeholder="Nhập Tên cửa hàng"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ cửa hàng"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập địa chỉ cửa hàng!",
                            },
                        ]}
                    >
                        <Input
                            readOnly={isReadOnly()}
                            placeholder="Nhập địa chỉ cửa hàng"
                        />
                    </Form.Item>
                    <Form.Item
                        readOnly={isReadOnly()}
                        label="Chọn kho"
                        name="wareHouses" // Tên field trong form
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn ít nhất một kho!",
                            },
                        ]}
                    >
                        <WarehouseSelect
                            wareHouses={wareHouses}
                            disabled={isReadOnly()}
                        />
                    </Form.Item>
                    <>
                        <Button onClick={handleCancel}>
                            {getButtonCancelText()}
                        </Button>
                        {isReadOnly() ? (
                            <>
                                <Divider type="vertical" />
                                <Button onClick={handleEdit}>
                                    {getButtonEditText()}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Divider type="vertical" />
                                <Button onClick={handleOk}>
                                    {getButtonOkText()}
                                </Button>
                            </>
                        )}
                    </>
                </Form>
            </Card>
        </>
    );
};

StoresDetail.propTypes = {
    mode: PropTypes.number,
};

export default StoresDetail;
// <Form.Item
//               label="Kho hàng"
//               name="status"
//               rules={[{ required: true, message: "Hãy chọn kho hàng!" }]}
//             >
//               <Select
//                 disabled={isReadOnly()}
//                 options={Object.keys(NewsStatusLabel).map((item) => {
//                   return {
//                     value: item,
//                     label: NewsStatusLabel[item],
//                   };
//                 })}
//                 placeholder="Nhập kho hàng "
//                 optionFilterProp="label"
//               />
//             </Form.Item>

// <Form.Item name="logo" label="Hình đại diện" tooltip="Hình đại diện">
//             <UploadAvatarGetUrlWithImgCrop
//               remoteMode={UploadAvatarGetUrlWithImgCropRemoteMode.Private}
//               uploadUrl={endpoints.user.uploadAvatar()}
//             />
//           </Form.Item>

// {mode !== StoresDetailMode.Add ? (
