import {
    CloseOutlined,
    EditOutlined,
    PlusOutlined,
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
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints.ts";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb.tsx";
import { getBreadcrumbItems } from "../../containers/layout/index.tsx";

export const CategoriesDetailMode = {
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

const WareHouseDetail = ({ mode }) => {
    const { id } = useParams();
    console.log(mode);
    useEffect(() => {
        if (id) {
            const getWarehouseByid = async (id) => {
                const data = await apiClient.get(
                    endpoints.warehouse.details(id)
                );
                form.setFieldsValue(data.data);
            };
            getWarehouseByid(id);
        }
    }, [id]);

    const navigate = useNavigate();
    const [loading] = useState(false);

    const [form] = Form.useForm();

    const getCardTitle = () => {
        if (mode === CategoriesDetailMode.View) {
            return "Chi tiết kho";
        } else if (mode === CategoriesDetailMode.Add) {
            return "Tạo kho mới";
        } else if (mode === CategoriesDetailMode.Edit) {
            return "Chỉnh sửa kho";
        }
    };

    const getButtonOkText = () => {
        if (mode === CategoriesDetailMode.Add) {
            return (
                <>
                    <PlusOutlined />
                    &nbsp;Tạo
                </>
            );
        } else if (mode === CategoriesDetailMode.Edit) {
            return (
                <>
                    <SaveOutlined />
                    &nbsp;Lưu
                </>
            );
        }
    };

    const getButtonCancelText = () => {
        if (mode === CategoriesDetailMode.Add) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Hủy
                </>
            );
        } else if (mode === CategoriesDetailMode.Edit) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Hủy
                </>
            );
        } else if (mode === CategoriesDetailMode.View) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Đóng
                </>
            );
        }
    };

    const getButtonEditText = () => {
        if (mode === CategoriesDetailMode.View) {
            return (
                <>
                    <EditOutlined />
                    &nbsp;Sửa
                </>
            );
        }
    };

    const prepareForm = (loadedData) => {
        if (mode === CategoriesDetailMode.View) {
            form.setFieldsValue({
                ...loadedData,
            });
        } else if (mode === CategoriesDetailMode.Add) {
            form.resetFields();
        } else if (mode === CategoriesDetailMode.Edit) {
            form.setFieldsValue({
                ...loadedData,
            });
        }
    };

    const isReadOnly = () => {
        if (mode === CategoriesDetailMode.Add) {
            return false;
        } else if (mode === CategoriesDetailMode.Edit) {
            return false;
        }

        // if (mode === CategoriesDetailMode.View) {
        //   return false;
        // }
        return true;
    };

    const handleOk = () => {
        if (mode === CategoriesDetailMode.Add) {
            form.submit();
        } else if (mode === CategoriesDetailMode.Edit) {
            form.submit();
        }
    };

    const handleCancel = () => {
        if (mode === CategoriesDetailMode.Edit) {
            processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
                navigate(`/warehouse`);
            });
        } else {
            navigate("/warehouse");
        }
    };

    const handleEdit = () => {
        if (mode === CategoriesDetailMode.View) {
            navigate(`/warehouse/${id}/edit`, { replace: true });
        }
    };

    const handleFormFinish = async (values) => {
        // gọi api chỉnh sửa
        if (mode == 3) {
            console.log(values);
            const data = await apiClient.patch(
                endpoints.warehouse.update(id),
                values
            );
            if (data) {
                message.success("Cập nhật thành công");
            }
            navigate(`/warehouse`, { replace: true });
        } else {
            const data = await apiClient.post(
                endpoints.warehouse.create(),
                values
            );
            console.log(data);
            if (data) {
                message.success("Tạo thành công");
                navigate(`/warehouse`, { replace: true });
            }
        }
    };

    return (
        <section key={`${id} - ${mode}`}>
            <div className="flex justify-between items-center animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin chi tiết kho"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
            </div>
            <Card
                loading={loading}
                title={getCardTitle()}
                className="mt-6 animate-slideUp"
            >
                <Form
                    form={form}
                    {...formItemLayout}
                    layout={"vertical"}
                    autoComplete="off"
                    onFinish={handleFormFinish}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                label="Tên kho"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Hãy nhập tên kho!",
                                    },
                                ]}
                            >
                                <Input
                                    readOnly={isReadOnly()}
                                    placeholder="Nhập tên kho"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Hãy nhập tên kho!",
                                    },
                                ]}
                            >
                                <Input
                                    readOnly={isReadOnly()}
                                    placeholder="Nhập tên kho"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: "Hãy nhập địa chỉ!",
                                    },
                                ]}
                            >
                                <Input
                                    readOnly={isReadOnly()}
                                    placeholder="Nhập địa chỉ"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div className="flex justify-end">
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
                    </div>
                </Form>
            </Card>
        </section>
    );
};

WareHouseDetail.propTypes = {
    mode: PropTypes.number,
};

export default WareHouseDetail;
