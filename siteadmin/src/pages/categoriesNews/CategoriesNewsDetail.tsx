import {
    CloseOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, message } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "../../containers/layout/index";
import Access from "../../access/access";
import { ALL_PERMISSIONS } from "../../constants/permissions";
import { ApiResponse } from "src/types/api-response.type";

export const NewsDetailMode = {
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
// Cate NewsDetail
const CategoriesNewsDetail = ({ mode }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form] = Form.useForm();

    useEffect(() => {
        const GetCategoriesBlogByid = async () => {
            const data = await apiClient.get(
                endpoints.blogcategories.details(id)
            );
            form.setFieldsValue(data.data);
        };
        GetCategoriesBlogByid();
    }, [id]);
    const getCardTitle = () => {
        if (mode === NewsDetailMode.View) {
            return "Chi tiết danh mục tin tức";
        } else if (mode === NewsDetailMode.Add) {
            return "Tạo danh mục tin tức";
        } else if (mode === NewsDetailMode.Edit) {
            return "Chỉnh sửa danh mục tin tức";
        }
    };

    const getButtonOkText = () => {
        if (mode === NewsDetailMode.Add) {
            return (
                <>
                    <PlusOutlined />
                    &nbsp;Tạo
                </>
            );
        } else if (mode === NewsDetailMode.Edit) {
            return (
                <>
                    <SaveOutlined />
                    &nbsp;Lưu
                </>
            );
        }
    };

    const getButtonCancelText = () => {
        if (mode === NewsDetailMode.Add) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Hủy
                </>
            );
        } else if (mode === NewsDetailMode.Edit) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Hủy
                </>
            );
        } else if (mode === NewsDetailMode.View) {
            return (
                <>
                    <CloseOutlined />
                    &nbsp;Đóng
                </>
            );
        }
    };

    const getButtonEditText = () => {
        if (mode === NewsDetailMode.View) {
            return (
                <>
                    <EditOutlined />
                    &nbsp;Sửa
                </>
            );
        }
    };

    const getButtonViewBlogText = () => {
        if (mode === NewsDetailMode.View) {
            return (
                <>
                    <EyeOutlined />
                    &nbsp;Xem bài viết
                </>
            );
        }
    };

    const prepareForm = (loadedData) => {
        if (mode === NewsDetailMode.View) {
            form.setFieldsValue({
                ...loadedData,
            });
        } else if (mode === NewsDetailMode.Add) {
            form.resetFields();
        } else if (mode === NewsDetailMode.Edit) {
            form.setFieldsValue({
                ...loadedData,
            });
        }
    };

    const isReadOnly = () => {
        if (mode === NewsDetailMode.Add) {
            return false;
        } else if (mode === NewsDetailMode.Edit) {
            return false;
        }

        // view thì nó true : chỉ đọc
        return true;
    };

    const handleOk = () => {
        if (mode === NewsDetailMode.Add) {
            form.submit();
        } else if (mode === NewsDetailMode.Edit) {
            form.submit();
        }
    };

    const handleCancel = () => {
        if (mode === NewsDetailMode.Edit) {
            processWithModals({
                modalName: ProcessModalName.ConfirmCancelEditing,
                title: "Xác nhận",
                content: "Bạn có chắc muốn hủy chỉnh sửa không?",
                onOk: () => {
                    navigate(`/categorynews`);
                },
            });
        } else {
            navigate("/categorynews");
        }
    };

    const handleEdit = () => {
        if (mode === NewsDetailMode.View) {
            navigate(`/categorynews/${id}/edit`, { replace: true });
        }
    };

    const handleViewBlog = () => {
        navigate(`/categorynews/${id}/news`, { replace: true });
    };

    const handleFormFinish = (values) => {
        const { id, ...createCategoriesBlog } = values;
        const dto = {
            ...createCategoriesBlog,
        };
        if (mode === NewsDetailMode.Add) {
            processWithModals({
                modalName: ProcessModalName.ConfirmCreateNews,
                title: "Xác nhận",
                content: "Bạn có chắc muốn hủy chỉnh sửa không?",
                onOk: async () => {
                    try {
                        const response: ApiResponse<any> = await apiClient.post(
                            endpoints.blogcategories.create(),
                            dto
                        );
                        if (response?.data) {
                            message.success(response.message);
                            navigate("/categorynews");
                        } else {
                            message.error(
                                "Không nhận được dữ liệu phản hồi từ server."
                            );
                        }
                    } catch (error) {
                        console.error("Lỗi khi tạo danh mục tin tức:", error);
                        message.error("Có lỗi xảy ra khi gọi API.");
                    }
                },
            });
        } else if (mode === NewsDetailMode.Edit) {
            processWithModals({
                modalName: ProcessModalName.ConfirmCreateNews,
                title: "Xác nhận",
                content: "Bạn có chắc muốn hủy chỉnh sửa không?",
                onOk: async () => {
                    try {
                        const data: ApiResponse<any> = await apiClient.put(
                            endpoints.blogcategories.update(id),
                            dto
                        );
                        if (data) {
                            message.success(data.message);
                            navigate("/categorynews");
                        } else {
                            message.error("Có lỗi xảy ra");
                        }
                    } catch (error) {
                        message.error("Lỗi khi tạo danh mục");
                    }
                },
            });
        }
    };

    return (
        <section key={`${id} - ${mode}`}>
            <div
                className={`flex justify-between items-center animate-slideDown mb-6`}
            >
                <AdminBreadCrumb
                    description="Thông tin chi tiết danh mục tin tức"
                    items={getBreadcrumbItems(location.pathname)}
                />
            </div>
            <div className="w-full animate-slideUp">
                <Card title={getCardTitle()}>
                    <Form
                        form={form}
                        {...formItemLayout}
                        layout={"vertical"}
                        autoComplete="off"
                        onFinish={handleFormFinish}
                    >
                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Tên danh mục"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Hãy nhập tiêu đề tin tức!",
                                },
                            ]}
                        >
                            <Input
                                readOnly={isReadOnly()}
                                placeholder="Nhập Tiêu đề tin tức"
                            />
                        </Form.Item>
                        <Form.Item
                            label="slug"
                            name="slug"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Hãy nhập slug của danh mục tin tức!",
                                },
                            ]}
                        >
                            <Input
                                readOnly={isReadOnly()}
                                placeholder="Nhập slug của danh mục tin tức"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Tóm tắt"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "Hãy nhập tóm tắt tin tức!",
                                },
                            ]}
                        >
                            <Input
                                maxLength={255}
                                readOnly={isReadOnly()}
                                placeholder="Nhập Tóm tắt tin tức"
                            />
                        </Form.Item>
                        <div className="flex justify-center flex-col gap-4 sm:gap-0 sm:flex-row sm:justify-end">
                            <Button onClick={handleCancel}>
                                {getButtonCancelText()}
                            </Button>
                            {isReadOnly() ? (
                                <>
                                    <Divider type="vertical" />
                                    <Access
                                        permission={
                                            ALL_PERMISSIONS.BLOGCATEGORY.UPDATE
                                        }
                                        hideChildren
                                    >
                                        <Button onClick={handleEdit}>
                                            {getButtonEditText()}
                                        </Button>
                                    </Access>
                                    <Divider type="vertical" />
                                    <Access
                                        permission={
                                            ALL_PERMISSIONS.BLOGS.GET_PAGINATE
                                        }
                                        hideChildren
                                    >
                                        <Button onClick={handleViewBlog}>
                                            {getButtonViewBlogText()}
                                        </Button>
                                    </Access>
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
            </div>
        </section>
    );
};

CategoriesNewsDetail.propTypes = {
    mode: PropTypes.number,
};

export default CategoriesNewsDetail;
