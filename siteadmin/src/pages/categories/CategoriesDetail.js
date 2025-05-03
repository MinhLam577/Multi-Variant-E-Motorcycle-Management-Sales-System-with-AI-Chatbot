import {
    CloseOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Divider,
    Form,
    Input,
    InputNumber,
    message,
    Select,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import UploadSinglePictureGetUrl, {
    UploadSinglePictureGetUrlRemoteMode,
} from "../../containers/UploadSinglePictureGetUrl";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints.ts";

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

const CategoriesDetail = ({ mode }) => {
    const [categories, setData] = useState([]);
    const { id } = useParams();
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const { data } = await apiClient.get(
                    endpoints.category.details(id)
                );
                console.log(data);
                const { parentCategory, ...values } = data;
                if (parentCategory) {
                    form.setFieldsValue({
                        ...values,
                        parentCategoryId: parentCategory.id,
                    });
                } else {
                    form.setFieldsValue({
                        ...values,
                        parentCategoryId: "",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };

        if (id) {
            fetchCategory();
        }
    }, [id]);

    const navigate = useNavigate();

    const [loading] = useState(false);

    const [form] = Form.useForm();

    const getCardTitle = () => {
        if (mode === CategoriesDetailMode.View) {
            return "Chi tiết danh mục";
        } else if (mode === CategoriesDetailMode.Add) {
            return "Tạo danh mục";
        } else if (mode === CategoriesDetailMode.Edit) {
            return "Chỉnh sửa danh mục";
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
        // mode === CategoriesDetailMode.View
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
                navigate(`/categories`);
            });
        } else {
            navigate("/categories");
        }
    };

    const handleEdit = () => {
        if (mode === CategoriesDetailMode.View) {
            navigate(`/categories/${id}/edit`, { replace: true });
        }
    };

    const handleFormFinish = (values) => {
        const dto = {
            ...values,
        };

        //
        if (mode === CategoriesDetailMode.Add) {
            console.log(mode + "" + CategoriesDetailMode);
            processWithModals(ProcessModalName.ConfirmCreateNews)(async () => {
                try {
                    const response = await apiClient.post(
                        endpoints.category.create,
                        dto
                    );
                    console.log(response);
                    if (response?.data) {
                        message.success(response.message);
                        navigate("/categories");
                    } else {
                        message.error(
                            "Không nhận được dữ liệu phản hồi từ server."
                        );
                    }
                } catch (error) {
                    console.error("Lỗi khi tạo danh mục sản phẩm:", error);
                    message.error(
                        error?.response?.data?.message ||
                            "Có lỗi xảy ra khi gọi API."
                    );
                }
            });
        } else if (mode === CategoriesDetailMode.Edit) {
            // mình đang chạy vào onCallback Oki
            processWithModals(ProcessModalName.ConfirmUpdateNews)(async () => {
                try {
                    const data = await apiClient.patch(
                        endpoints.category.update(id),
                        dto
                    );
                    console.log(data);
                    if (data) {
                        message.success(data.message);
                        navigate("/categories");
                    } else {
                        message.error(data.error);
                    }
                } catch (error) {
                    message.error(
                        "Lỗi khi tạo danh mục: " +
                            (error.response?.data?.message || "Không xác định")
                    );
                }
            });
        }
    };
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await apiClient.get(endpoints.category.list);
                setData(data);
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <>
            <Card loading={loading} title={getCardTitle()}>
                <Form
                    form={form}
                    {...formItemLayout}
                    layout={"vertical"}
                    autoComplete="off"
                    onFinish={handleFormFinish}
                >
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập tên danh mục!",
                            },
                        ]}
                    >
                        <Input
                            readOnly={isReadOnly()}
                            placeholder="Nhập tên danh mục"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[
                            {
                                required: true,
                                message: "VD: Xe-Máy-Điện",
                            },
                        ]}
                    >
                        <Input
                            readOnly={isReadOnly()}
                            placeholder="Nhập tên slug"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập mô tả danh mục!",
                            },
                        ]}
                    >
                        <Input
                            readOnly={isReadOnly()}
                            placeholder="Nhập mô tả danh mục"
                        />
                    </Form.Item>

                    <Form.Item label="Parent Category" name="parentCategoryId">
                        <Select
                            allowClear
                            optionFilterProp="label"
                            options={[
                                { value: "", label: "Mặc định default" },
                                ...categories.map((category) => ({
                                    value: category.id,
                                    label: category.name,
                                })),
                            ]}
                            readOnly={isReadOnly()}
                            placeholder="Mặc định default"
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

CategoriesDetail.propTypes = {
    mode: PropTypes.number,
};

export default CategoriesDetail;
