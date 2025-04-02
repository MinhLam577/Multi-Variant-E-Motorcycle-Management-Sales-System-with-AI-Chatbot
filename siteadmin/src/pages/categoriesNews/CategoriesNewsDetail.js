import {
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, message } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import RichTextEditor from "../../containers/RichTextEditor";
import UploadSinglePictureGetUrl, {
    UploadSinglePictureGetUrlRemoteMode,
} from "../../containers/UploadSinglePictureGetUrl";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints.ts";

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
    const [fileList, setFileList] = useState([]);

    const [form] = Form.useForm();

    useEffect(() => {
        const GetCategoriesBlogByid = async () => {
            const data = await apiClient.get(
                endpoints.blogcategories.details(id)
            );
            console.log(data);
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
            processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
                navigate(`/categorynews`);
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
            processWithModals(ProcessModalName.ConfirmCreateNews)(async () => {
                try {
                    const response = await apiClient.post(
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
                    message.error(
                        error?.response?.data?.message ||
                            "Có lỗi xảy ra khi gọi API."
                    );
                }
            });
        } else if (mode === NewsDetailMode.Edit) {
            // mình đang chạy vào onCallback Oki
            processWithModals(ProcessModalName.ConfirmUpdateNews)(async () => {
                try {
                    const data = await apiClient.put(
                        endpoints.blogcategories.update(id),
                        dto
                    );
                    if (data) {
                        message.success(data.message);
                        navigate("/categorynews");
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

    return (
        <>
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
                                message: "Hãy nhập slug của danh mục tin tức!",
                            },
                        ]}
                    >
                        <Input
                            readOnly={isReadOnly()}
                            placeholder="Nhập slug của danh mục  tin tức"
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

          <>
            <Button onClick={handleCancel}>{getButtonCancelText()}</Button>
            {isReadOnly() ? (
              <>
                <Divider type="vertical" />
                <Button onClick={handleEdit}>{getButtonEditText()}</Button>

                <Divider type="vertical" />
                <Button onClick={handleViewBlog}>
                  {getButtonViewBlogText()}
                </Button>
              </>
            ) : (
              <>
                <Divider type="vertical" />
                <Button onClick={handleOk}>{getButtonOkText()}</Button>
              </>
            )}
          </>
        </Form>
      </Card>
    </>
  );
};

CategoriesNewsDetail.propTypes = {
    mode: PropTypes.number,
};

export default CategoriesNewsDetail;
