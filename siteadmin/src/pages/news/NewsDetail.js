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
import endpoints from "../../api/endpoints";
import UploadPictureApi from "../../api/uploadFile";
import CustomizeEditor from "../../components/common/CustomizeEditor";
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

const NewsDetail = ({ mode }) => {
    const { id: idblogcategory } = useParams();
    const { idblog } = useParams();

    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [imageUrl, setImageUrl] = useState("");

    const [dataThumbnail, setDataThumbnail] = useState([]);
    const [dataSlider, setDataSlider] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const [initForm, setInitForm] = useState("");

    const fetchBlogDetail = async () => {
        try {
            const response = await apiClient.get(
                endpoints.blogs.details(idblog)
            );
            console.log("Blog detail:", response.data);
            if (response.data) {
                const arrThumbnail = [
                    {
                        uid: "s",
                        name: response.data.thumbnail,
                        status: "done",
                        url: response.data.thumbnail,
                        thumbUrl: response.data.thumbnail,
                    },
                ];
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
            processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
                navigate(`/categorynews/${idblogcategory}/news`);
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

    const handleFormFinish = (values) => {
        console.log(">>> check values: ", values);
        const { thumbnail, id, ...data } = values;
        data.thumbnail = dataThumbnail[0]?.name || "";
        data.blogCategoryId = idblogcategory;

        const dto = {
            ...data,
        };

        if (mode === NewsDetailMode.Add) {
            processWithModals(ProcessModalName.ConfirmCreateNews)(async () => {
                try {
                    const response = await apiClient.post(
                        endpoints.blogs.create(),
                        dto
                    );
                    if (response) {
                        message.success("Tạo bài viết thành công!");
                        form.resetFields();
                        setDataSlider([]);
                        setDataThumbnail([]);
                        setInitForm(null);
                        navigate(`/categorynews/${idblogcategory}/news`, {
                            replace: true,
                        });
                    }
                    // điều hướng hoặc reset form tùy mục đích
                } catch (error) {
                    message.error("Tạo bài viết thất bại!");
                }
            });
        } else if (mode === NewsDetailMode.Edit) {
            processWithModals(ProcessModalName.ConfirmUpdateNews)(async () => {
                try {
                    console.log("DTO gửi đi:", dto);
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
            });
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Image must smaller than 2MB!");
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info, type) => {
        if (info.file.status === "uploading") {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await UploadPictureApi.create(file);
        if (res && res.data) {
            setDataThumbnail([
                {
                    name: res.data.url,
                    uid: file.uid,
                },
            ]);
            onSuccess("done");
        } else {
            onError("Đã có lỗi khi upload file");
        }
    };
    const handleRemoveFile = (file, type) => {
        if (type === "thumbnail") {
            setDataThumbnail([]);
        }
        if (type === "slider") {
            const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    };

    const handlePreview = async (file) => {
        if (file.url && !file.originFileObj) {
            setPreviewImage(file.url);
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
                    onValuesChange={(changeValue, value) => {
                        console.log("onValuesChange", changeValue);
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
                        {initForm && mode == NewsDetailMode.View && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) =>
                                        handleRemoveFile(file, "thumbnail")
                                    }
                                    onPreview={handlePreview}
                                    defaultFileList={
                                        initForm?.thumbnail?.fileList ?? []
                                    }
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
                        )}

                        {mode == NewsDetailMode.Add ||
                            (mode == NewsDetailMode.Edit && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Upload
                                        name="thumbnail"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        maxCount={1}
                                        multiple={false}
                                        customRequest={
                                            handleUploadFileThumbnail
                                        }
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        onRemove={(file) =>
                                            handleRemoveFile(file, "thumbnail")
                                        }
                                        onPreview={handlePreview}
                                        defaultFileList={
                                            initForm?.thumbnail?.fileList ?? []
                                        }
                                    >
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
                                    </Upload>
                                </div>
                            ))}
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

NewsDetail.propTypes = {
    mode: PropTypes.number,
};

export default NewsDetail;
