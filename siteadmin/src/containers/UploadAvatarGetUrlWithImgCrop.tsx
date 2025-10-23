import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal, Spin, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import BaseAPI from "src/api/base";
import { isUploadFailure } from "src/utils";

export const UploadAvatarGetUrlWithImgCropRemoteMode = {
    Private: "private",
    Public: "public",
};
interface UploadAvatarGetUrlWithImgCropProps {
    onChange?: (data: any) => void;
    value?: string;
    disabled?: boolean;
    folder?: string;
    showUploadList?: boolean;
    remoteMode?: string;
}
const UploadAvatarGetUrlWithImgCrop = ({
    onChange,
    value,
    disabled,
    remoteMode = UploadAvatarGetUrlWithImgCropRemoteMode.Private,
    folder,
    showUploadList,
}: UploadAvatarGetUrlWithImgCropProps) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async () => {
        if (Array.isArray(fileList) && fileList.length > 0) {
            setPreviewOpen(true);
        }
    };

    const handleRemove = () => {
        setFileList([]);
        typeof onChange === "function" && onChange(null);
    };
    const uploadAvatarUrl = async ({ file }) => {
        if (!validateImage(file, true)) {
            return;
        }
        setUploading(true);

        try {
            const result = await BaseAPI.uploadImagesToServer([file], folder);
            if (isUploadFailure(result)) {
                throw new Error("Xảy ra lỗi khi upload avatar");
            }
            const image = result[0];
            // Kiểm tra xem API có trả về URL không
            if (image?.url) {
                setFileList([
                    {
                        uid: image.url,
                        name: file.name,
                        status: "done",
                        url: image.url, // Gán URL ảnh trả về từ API
                    },
                ]);

                // Gửi URL ảnh lên component cha nếu có `onChange`
                if (typeof onChange === "function") {
                    onChange(image.url);
                }
            } else {
                message.error("Không thể tải lên ảnh, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi upload ảnh:", error);
            message.error("Đã xảy ra lỗi khi tải ảnh lên!");
        }

        setUploading(false);
    };

    const validateImage = async (file, isCheckSize = false) => {
        const isImage = file.type.indexOf("image/") === 0;
        if (!isImage) {
            message.error("Tệp tải lên không phải file ảnh!");
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (isCheckSize && !isLt5M) {
            message.error("Dung lượng ảnh không được lớn hơn 5MB!");
        }
        return isImage && (!isCheckSize || isLt5M);
    };

    useEffect(() => {
        if (value) {
            setFileList([
                {
                    uid: value,
                    name: value,
                    status: "done",
                    url: value,
                },
            ]);
        } else {
            setFileList([]);
        }
    }, [value]);

    const uploadButton = (
        <Spin spinning={uploading}>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </Spin>
    );

    return (
        <div className="flex justify-center">
            <ImgCrop
                showGrid
                rotationSlider
                showReset
                cropShape="round"
                beforeCrop={(file) => validateImage(file)}
            >
                <Upload
                    showUploadList={showUploadList}
                    customRequest={uploadAvatarUrl}
                    listType="picture-circle"
                    fileList={
                        Array.isArray(fileList) && fileList.length > 0
                            ? fileList
                            : []
                    }
                    onPreview={handlePreview}
                    onRemove={handleRemove}
                    maxCount={1}
                    disabled={disabled}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
            </ImgCrop>
            <Modal
                className="custom-antd-modal-preview-image"
                open={previewOpen}
                closeIcon={
                    <CloseOutlined className="text-red-700 hover:!text-red-400" />
                }
                footer={null}
                onCancel={handleCancel}
            >
                <img
                    alt="example"
                    style={{
                        width: "100%",
                    }}
                    src={
                        Array.isArray(fileList) && fileList.length > 0
                            ? fileList[0]?.url
                            : ""
                    }
                />
            </Modal>
        </div>
    );
};
export default UploadAvatarGetUrlWithImgCrop;
