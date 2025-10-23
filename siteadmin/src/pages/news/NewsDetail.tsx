import {
    CloseOutlined,
    EditOutlined,
    LoadingOutlined,
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
    Modal,
    Upload,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    ProcessModalName,
    processWithModals,
} from "../../containers/processWithModals";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import CustomizeEditor from "../../components/common/CustomizeEditor";
import { CheckFileInput, getBase64, handleUploadFileUtils } from "../../utils";
import { UploadFile, GetProp } from "antd";
import { UploadProps } from "antd/lib";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { RootStore } from "src/stores/base";
import BaseAPI from "src/api/base";
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

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const NewsDetail = ({ mode }) => {
    const { id: idblogcategory } = useParams();
    const { idblog } = useParams();

    const [loading, setLoading] = useState(false);

    const [dataThumbnail, setDataThumbnail] = useState<UploadFile[]>([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const [initForm, setInitForm] = useState({});

    const fetchBlogDetail = async () => {
        try {
            const response = await apiClient.get(
                endpoints.blogs.details(idblog)
            );
            if (response.data) {
                const arrThumbnail = [
                    {
                        uid: "s",
                        name: response.data.thumbnail,
                        status: "done",
                        url: response.data.thumbnail,
                        thumbUrl: response.data.thumbnail,
                    },
                ] as UploadFile[];
                const init = {
                    id: response.data.id,
                    title: response.data.title,
                    slug: response.data.slug,
                    content: response.data.content,
                    thumbnail: { fileList: arrThumbnail },
                };
                setInitForm(init);
                setDataThumbnail(arrThumbnail);
                form.setFieldsValue(init);
            }
            return () => {
                form.resetFields();
            };
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết blog:", error);
        }
    };

    useEffect(() => {
        fetchBlogDetail();
    }, [idblog]);

    useEffect(() => {}, [initForm]);

    const navigate = useNavigate();

    const [form] = Form.useForm();

    const getCardTitle = () => {
        if (mode === NewsDetailMode.View) {
            return "Chi tiết tin tức";
        } else if (mode === NewsDetailMode.Add) {
            return "Tạo tin tức";
        } else if (mode === NewsDetailMode.Edit) {
            return "Chỉnh sửa tin tức";
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
                onOk: () => {
                    navigate(`/categorynews/${idblogcategory}/news`);
                },
            });
        } else {
            navigate(`/categorynews/${idblogcategory}/news`);
        }
    };

    const handleEdit = () => {
        if (mode === NewsDetailMode.View) {
            navigate(`/categorynews/${idblogcategory}/news/${idblog}/edit`, {
                replace: true,
            });
        }
    };

    const handleFormFinish = async (values) => {
        try {
            const { thumbnail, id, ...data } = values;

            let responseUploadThumbnail: string[] | File = [];

            if (thumbnail instanceof File)
                responseUploadThumbnail =
                    await handleUploadFileUtils(thumbnail);
            else {
                responseUploadThumbnail = thumbnail?.fileList?.map(
                    (f: UploadFile) => f?.url
                );
            }
            const dto = {
                ...data,
                thumbnail: responseUploadThumbnail[0] || "",
                blogCategoryId: idblogcategory,
            };

            if (mode === NewsDetailMode.Add) {
                processWithModals({
                    modalName: ProcessModalName.ConfirmCreateNews,
                    onOk: async () => {
                        try {
                            const response = await apiClient.post(
                                endpoints.blogs.create(),
                                dto
                            );
                            if (response) {
                                message.success("Tạo bài viết thành công!");
                                form.resetFields();
                                setDataThumbnail([]);
                                setInitForm(null);
                                navigate(
                                    `/categorynews/${idblogcategory}/news`,
                                    {
                                        replace: true,
                                    }
                                );
                            }
                        } catch (error) {
                            message.error("Tạo bài viết thất bại!");
                        }
                    },
                });
            } else if (mode === NewsDetailMode.Edit) {
                processWithModals({
                    modalName: ProcessModalName.ConfirmUpdateNews,
                    onOk: async () => {
                        try {
                            const response = await apiClient.put(
                                endpoints.blogs.update(id),
                                dto
                            );

                            message.success("Cập nhật bài viết thành công!");
                            navigate(`/categorynews/${idblogcategory}/news`, {
                                replace: true,
                            });
                        } catch (error) {
                            message.error("Cập nhật bài viết thất bại!");
                        }
                    },
                });
            }
        } catch (error) {
            console.error("Error during form submission:", error);
            if (error instanceof Error) {
                message.error(error.message);
            }
        }
    };

    const beforeUpload = (file) => {
        const { isValid, errorMessage } = CheckFileInput(file);
        if (errorMessage) {
            message.error(errorMessage);
        }
        return isValid ? true : Upload.LIST_IGNORE;
    };

    const handleChange = (info) => {
        setDataThumbnail([...info.fileList]);
    };

    const handleUploadFileThumbnail = ({
        file,
        onSuccess,
        onError,
    }: UploadRequestOption) => {
        if (!(file instanceof File)) {
            onError?.(new Error("Invalid file type"));
            return;
        }
        form.setFieldsValue({
            thumbnail: file,
        });
        onSuccess?.("done", file);
    };
    const handleRemoveFile = (file) => {
        setDataThumbnail([]);
    };

    const handlePreview = async (file) => {
        if (file.url && !file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewTitle(
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
            );
            setPreviewOpen(true);
            return;
        }
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
            );
        });
    };

    const handleOnChangeEditor = (value) => {
        form.setFieldsValue({
            content: value,
        });
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
                    onFinishFailed={() => {
                        message.error("Vui lòng kiểm tra lại thông tin!");
                    }}
                >
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Ảnh Thumbnail"
                        name="thumbnail"
                    >
                        <div className="flex justify-center">
                            <Upload
                                name="thumbnail"
                                listType="picture-card"
                                className="avatar-uploader"
                                maxCount={1}
                                multiple={false}
                                customRequest={handleUploadFileThumbnail}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                onRemove={(file) => handleRemoveFile(file)}
                                onPreview={handlePreview}
                                fileList={dataThumbnail ?? []}
                                showUploadList={{
                                    showRemoveIcon: !isReadOnly(),
                                }}
                            >
                                {!isReadOnly() && (
                                    <div>
                                        {loading ? (
                                            <LoadingOutlined />
                                        ) : (
                                            <PlusOutlined />
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            Upload
                                        </div>
                                    </div>
                                )}
                            </Upload>
                        </div>
                    </Form.Item>

                    <Form.Item
                        label="Tiêu đề"
                        name="title"
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
                        label="Slug"
                        name="slug"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập slug tin tức!",
                            },
                        ]}
                    >
                        <Input
                            maxLength={255}
                            readOnly={isReadOnly()}
                            placeholder="vd: blog-slug"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Nội dung"
                        name="content"
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập nội dung tin tức!",
                            },
                        ]}
                    >
                        <div className="w-full h-[25rem] overflow-hidden border border-solid border-[var(--border-gray)] rounded-md editor-container">
                            <CustomizeEditor
                                defaultForm={form}
                                onChange={handleOnChangeEditor}
                                value={
                                    form.getFieldValue("content")
                                        ? form.getFieldValue("content")
                                        : ""
                                }
                                className="w-full h-full"
                                folder="Blog"
                                fieldFormName="content"
                            />
                        </div>
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

                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                >
                    <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={previewImage}
                    />
                </Modal>
            </Card>
        </>
    );
};

export default NewsDetail;
