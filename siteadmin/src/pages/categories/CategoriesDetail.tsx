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
    message,
    Select,
    TreeSelect,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { CategoryResponseTypeEnum } from "@/types/categories.type";
import { getErrorMessage } from "../../utils";

import { getCategoriesTreeSelect } from "../products";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "../../containers/layout";
import { EnumProductStore, EnumProductType } from "@/types/product.type";
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
    const store = useStore();
    const categoriesStore = store.categoriesObservable;
    const { id } = useParams();
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                await categoriesStore.getCategoryDetail(id);
                const { parentCategory, ...values } =
                    categoriesStore.detailData;
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
            processWithModals({
                modalName: ProcessModalName.ConfirmCancelEditing,
                onOk: () => {
                    navigate(`/categories`);
                },
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
        if (mode === CategoriesDetailMode.Add) {
            processWithModals({
                modalName: ProcessModalName.ConfirmCreateNews,
                onOk: async () => {
                    try {
                        const response =
                            await categoriesStore.createCategory(dto);

                        if (response) {
                            // message.success("Tạo danh mục thành công.");
                            navigate("/categories");
                        } else {
                            throw new Error(
                                "Có lỗi xảy ra khi tạo danh mục sản phẩm."
                            );
                        }
                    } catch (error) {
                        console.error("Lỗi khi tạo danh mục sản phẩm:", error);
                        const errorMessage = getErrorMessage(
                            error,
                            "Lỗi khi tạo danh mục sản phẩm."
                        );
                        message.error(errorMessage);
                    }
                },
            });
        } else if (mode === CategoriesDetailMode.Edit) {
            processWithModals({
                modalName: ProcessModalName.ConfirmUpdateNews,
                onOk: async () => {
                    try {
                        const res = await categoriesStore.updateCategory(
                            id,
                            dto
                        );
                        if (res) {
                            // message.success("Cập nhật danh mục thành công.");
                            navigate("/categories");
                        }
                    } catch (error) {
                        const errorMessage = getErrorMessage(
                            error,
                            "Lỗi khi cập nhật danh mục sản phẩm."
                        );
                        message.error(errorMessage);
                    }
                },
            });
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                await categoriesStore.getListCategories({
                    ...categoriesStore.pagination,
                    responseType: CategoryResponseTypeEnum.TREE,
                });
                const convertData = getCategoriesTreeSelect(
                    toJS(categoriesStore.data),
                    id,
                    2
                );
                setData(convertData);
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <section className="flex flex-col gap-4">
            <div className="animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin chi tiết danh mục"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
            </div>
            <Card
                loading={loading}
                title={getCardTitle()}
                className="animate-slideUp"
            >
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
                    <Form.Item label="Kiểu danh mục" name="type">
                        <Select
                            defaultValue={
                                form.getFieldValue("type") ||
                                EnumProductStore.MOTORBIKE
                            }
                            options={Object.keys(EnumProductType).map(
                                (key) => ({
                                    label: EnumProductType[key],
                                    value: EnumProductStore[key],
                                })
                            )}
                        />
                    </Form.Item>

                    <Form.Item label="Parent Category" name="parentCategoryId">
                        <TreeSelect
                            allowClear
                            showSearch
                            disabled={isReadOnly()}
                            treeData={[
                                {
                                    title: "Root Category",
                                    value: "",
                                    key: "",
                                },
                                ...categories,
                            ]}
                            treeDefaultExpandAll
                            treeNodeFilterProp="title"
                            placeholder="Root Category"
                        />
                    </Form.Item>

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

export default observer(CategoriesDetail);
