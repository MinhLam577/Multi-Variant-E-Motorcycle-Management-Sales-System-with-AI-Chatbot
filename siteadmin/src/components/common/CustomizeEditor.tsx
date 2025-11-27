import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import QuillResizeImage from "quill-resize-image";
import {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { resizeImage } from "@/utils";
import BaseAPI from "@/api/base";
import { AcceptImageTypes } from "@/constants";
import { useStore } from "@/stores";
import { observer } from "mobx-react-lite";
import CustomizeModal from "./CustomizeModal";
import { Button, Form, Select, Image, FormInstance } from "antd";
import { makeAutoObservable } from "mobx";
const Parchment = Quill.import("parchment");
const maxWidth = 600;
const maxHeight = 400;
Quill.register("modules/resize", QuillResizeImage as any);

const BlockEmbed = Quill.import(
    "blots/block/embed"
) as typeof Parchment.EmbedBlot;

class ImageBlot extends BlockEmbed {
    static blotName = "image";
    static tagName = "img";

    static create(value: {
        url: string;
        alt?: string;
        width?: string;
        height?: string;
    }) {
        const node = super.create() as HTMLElement;
        node.setAttribute("src", value.url);
        if (value.alt) node.setAttribute("alt", value.alt);
        if (value.width) node.setAttribute("width", value.width);
        if (value.height) node.setAttribute("height", value.height);
        return node;
    }

    static value(node: HTMLElement) {
        return {
            url: node.getAttribute("src"),
            alt: node.getAttribute("alt"),
            width: node.getAttribute("width"),
            height: node.getAttribute("height"),
        };
    }
}
Quill.register(ImageBlot);

class VideoBlot extends BlockEmbed {
    static blotName = "video";
    static tagName = "iframe";

    static create(value: { url: string; width?: string; height?: string }) {
        const node = super.create() as HTMLElement;
        const embedUrl = this.convertToEmbedUrl(value.url);
        node.setAttribute("src", embedUrl);
        node.setAttribute("frameborder", "0");
        node.setAttribute("allowfullscreen", "true");
        node.setAttribute("width", value.width || "100%");
        node.setAttribute("height", value.height || "100%");
        return node;
    }

    static formats(node: HTMLElement) {
        const format = {};
        if (node.hasAttribute("width")) {
            format["width"] = node.getAttribute("width");
        }
        if (node.hasAttribute("height")) {
            format["height"] = node.getAttribute("height");
        }
        return format;
    }

    static convertToEmbedUrl(url: string): string {
        // YouTube
        const youtubeRegex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch && youtubeMatch[1]) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // Nếu không khớp, trả về URL gốc (cho video trực tiếp)
        return url;
    }

    static value(node: HTMLElement) {
        return {
            url: node.getAttribute("src"),
            width: node.getAttribute("width"),
            height: node.getAttribute("height"),
        };
    }

    format(name: string, value: any) {
        if (name === "video" && value) {
            (this.domNode as HTMLElement).setAttribute("src", value.url);
            (this.domNode as HTMLElement).setAttribute(
                "width",
                value.width || "100%"
            );
            (this.domNode as HTMLElement).setAttribute(
                "height",
                value.height || "100%"
            );
        } else {
            super.format(name, value);
        }
    }
}
Quill.register(VideoBlot);

const Icon = Quill.import("ui/icons");
Icon["video"] =
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12Z" stroke="#000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
Icon["fullscreen"] =
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM18 6 6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 10V6h-4M6 14v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

class EditorStore {
    isOpenImageModal: boolean = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }
    setIsOpenImageModal(isOpen: boolean) {
        this.isOpenImageModal = isOpen;
    }
}

export const editorStore = new EditorStore();

interface CustomizeEditorProps {
    value: string;
    fieldFormName: string;
    onChange: (content: string, delta, source, editor) => void;
    modules?: any;
    formats?: any;
    theme?: string;
    folder?: string;
    store?: any;
    setSpins?: (spins: boolean) => void;
    defaultForm: FormInstance;
    [key: string]: any;
}
const defaultToolbarOptions = [
    [
        { header: [false, 1, 2, 3, 4, 5, 6] },
        { size: ["small", false, "large", "huge"] },
    ],
    [{ indent: "-1" }, { indent: "+1" }],
    ["bold", "italic", "underline"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["blockquote"],
    ["fullscreen"],
    ["clean"],
];
const defaultFormats = [
    "header",
    "align",
    "bold",
    "italic",
    "underline",
    "list",
    "link",
    "image",
    "size",
    "color",
    "background",
    "indent",
    "blockquote",
];
// const defaultFormats = [
//     "header",
//     "align",
//     "bold",
//     "italic",
//     "underline",
//     "list",
//     "bullet",
//     "link",
//     "image",
//     "size",
//     "color",
//     "background",
//     "indent",
//     "blockquote",
//     "clean",
//     "fullscreen",
// ];
const CustomizeEditor: React.FC<CustomizeEditorProps> = forwardRef<
    ReactQuill,
    CustomizeEditorProps
>(
    (
        {
            value: initialValue,
            fieldFormName,
            onChange,
            modules,
            formats,
            theme,
            folder,
            store,
            setSpins,
            defaultForm,
            ...resProps
        },
        ref
    ) => {
        const [filesSelected, setFilesSelected] = useState<File[]>([]);
        const [fileSizeOptionSelected, setFileSizeOptionSelected] =
            useState<string>("original");
        const ImageSizeOptions = [
            {
                label: "Original",
                value: "original",
            },
            {
                label: "Small(32x32)",
                value: "32x32",
            },
            {
                label: "Medium(64x64)",
                value: "64x64",
            },
            {
                label: "Large(128x128)",
                value: "128x128",
            },
            {
                label: "XLarge(256x256)",
                value: "256x256",
            },
            {
                label: "XXLarge(512x512)",
                value: "512x512",
            },
            {
                label: "3XLarge(1024x1024)",
                value: "1024x1024",
            },
            {
                label: "4XLarge(2048x2048)",
                value: "2048x2048",
            },

            {
                label: "Laptop(1366x768)",
                value: "1366x768",
            },
            {
                label: "Tablet(768x1024)",
                value: "768x1024",
            },
            {
                label: "Phone(375x667)",
                value: "375x667",
            },
            {
                label: "Laptop(1920x1080)",
                value: "1920x1080",
            },
        ];
        const [cursorPosition, setCursorPosition] = useState<number | null>(
            null
        );
        const [modalForm] = Form.useForm();

        const default_store = useStore();
        const quillRef = useRef<ReactQuill>(null);
        useImperativeHandle(ref, () => quillRef.current as ReactQuill, []);
        const validateFiles = (files: File[]) => {
            if (files.length === 0 || !quillRef.current || !quillRef) {
                throw new Error("Không tìm thấy file hay editor để tải lên");
            }

            if (files.length > 5) {
                throw new Error("Chỉ chấp nhận tối đa 5 hình ảnh");
            }
            const invalidFiles = files.filter(
                (file) => !AcceptImageTypes.includes(file.type)
            );
            if (invalidFiles.length > 0) {
                throw new Error(
                    "Chỉ chấp nhận các định dạng hình ảnh: " +
                        AcceptImageTypes.join(", ")
                );
            }
        };
        const handleUploadImageChange = async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            e.stopPropagation();
            const files = e.target.files;
            if (files) {
                let newFiles = Array.from(files).filter(
                    (file) =>
                        !filesSelected.some(
                            (f) =>
                                f.name === file.name &&
                                f.lastModified === file.lastModified
                        )
                );
                try {
                    validateFiles([...newFiles, ...filesSelected]);
                    const size = fileSizeOptionSelected;
                    if (size !== "original") {
                        const [width, height] = size.split("x").map(Number);
                        if (
                            !width ||
                            !height ||
                            isNaN(width) ||
                            isNaN(height)
                        ) {
                            throw new Error("Kích thước hình ảnh không hợp lệ");
                        }
                        newFiles = await Promise.all(
                            newFiles.map((file) =>
                                resizeImage(file, width, height)
                            )
                        );
                    }
                    setFilesSelected((prev) => [...prev, ...newFiles]);
                    e.target.value = "";
                } catch (e) {
                    console.error(e);
                    const errorMessage =
                        (e instanceof Error && e.message) ||
                        "Có lỗi xảy ra khi tải lên hình ảnh";
                    default_store?.setStatusMessage(500, errorMessage, "");
                }
            }
        };
        const onUploadImage = async (files: File[]) => {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            if (!range) {
                throw new Error("Vui lòng chọn editor để chèn hình ảnh");
            }
            const uploadedFiles = await BaseAPI.uploadImagesToServer(
                files,
                folder
            );

            if ("path" in uploadedFiles) {
                const { message } = uploadedFiles;
                const errorMessage = Array.isArray(message)
                    ? message.join(", ")
                    : message;
                throw new Error(errorMessage);
            }

            for (const file of uploadedFiles.map((file) => ({
                url: file.url,
                alt: file.public_id,
            }))) {
                quill.insertEmbed(
                    range.index,
                    "image",
                    {
                        url: file.url,
                        alt: file.alt,
                    },
                    "user"
                );
                quill.setSelection(range.index + 1, 0, "silent");
            }
        };
        const handleImageEditorClicked = async () => {
            if (quillRef.current) {
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                if (range) {
                    setCursorPosition(range.index);
                }
            }
            editorStore.setIsOpenImageModal(true);
        };
        const handleSaveImageModal = async () => {
            try {
                if (!filesSelected || filesSelected.length === 0) {
                    throw new Error("No files selected to upload");
                }
                if (setSpins) setSpins(true);

                await onUploadImage(filesSelected);
                handleCloseImageModal();
            } catch (e) {
                console.error(e);
                const errorMessage =
                    (e instanceof Error && e.message) ||
                    "Có lỗi xảy ra khi chèn ảnh";
                default_store?.setStatusMessage(500, errorMessage, "");
            } finally {
                if (setSpins) setSpins(false);
            }
        };
        const handleCloseImageModal = () => {
            if (quillRef.current && cursorPosition !== null) {
                const quill = quillRef.current.getEditor();
                quill.setSelection(cursorPosition, 0, "silent");
                quillRef.current.focus();
            }
            editorStore.setIsOpenImageModal(false);
        };

        const handleRemoveFile = (file: File) => {
            setFilesSelected((prev) => prev.filter((f) => f !== file));
        };

        const FileListDiv = () => {
            return (
                <div className="flex flex-col items-center justify-center w-full h-full mt-4">
                    {filesSelected.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {filesSelected.map((file) => (
                                <div
                                    key={file.name + file.lastModified}
                                    className="w-32 h-32 relative overflow-hidden justify-center items-center"
                                >
                                    <button
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-4 h-4 flex items-center justify-center"
                                        style={{ zIndex: 1 }}
                                        onClick={() => {
                                            handleRemoveFile(file);
                                        }}
                                    >
                                        &times;
                                    </button>
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="object-cover w-full h-full rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        };

        const handleFullScreenClicked = () => {
            const quill = quillRef.current.getEditor();
            const container = quill.root.parentElement;
            if (container.classList.contains("ql-fullscreenActive")) {
                container.classList.remove("ql-fullscreenActive");
            } else {
                container.classList.add("ql-fullscreenActive");
            }
        };

        const defaultModules = useMemo(() => {
            return {
                toolbar: {
                    container: defaultToolbarOptions,
                    handlers: {
                        image: handleImageEditorClicked,
                        fullscreen: handleFullScreenClicked,
                    },
                },
                resize: {},
            };
        }, []);
        return (
            <>
                <ReactQuill
                    theme={theme || "snow"}
                    placeholder="Nhập mô tả"
                    value={
                        defaultForm.getFieldValue(fieldFormName)
                            ? defaultForm.getFieldValue(fieldFormName)
                            : ""
                    }
                    modules={modules || defaultModules}
                    formats={formats || defaultFormats}
                    onChange={onChange}
                    ref={quillRef}
                    {...resProps}
                />
                <div id="file-input-container">
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleUploadImageChange}
                    />
                </div>

                <CustomizeModal
                    title="Chọn hình ảnh"
                    isOpen={editorStore.isOpenImageModal}
                    handleCloseModal={handleCloseImageModal}
                    handleSaveModal={handleSaveImageModal}
                    footer={false}
                    cancelText="Hủy"
                    okText="Lưu"
                    width={600}
                    centered={true}
                >
                    <FileListDiv />
                    <Form
                        form={modalForm}
                        layout="vertical"
                        className="flex flex-col mt-4"
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Kích thước hình ảnh"
                            name={"size"}
                            required
                            initialValue={fileSizeOptionSelected}
                        >
                            <Select
                                className="h-10"
                                showSearch
                                optionFilterProp="label"
                                options={ImageSizeOptions}
                                onChange={(value) => {
                                    if (!value) return;
                                    setFileSizeOptionSelected(value);
                                }}
                            />
                        </Form.Item>
                    </Form>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="primary"
                            onClick={() => {
                                handleCloseImageModal();
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                const fileInput = document.getElementById(
                                    "file-input"
                                ) as HTMLInputElement;
                                if (fileInput) {
                                    fileInput.click();
                                }
                            }}
                        >
                            Tải hình ảnh
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                handleSaveImageModal();
                            }}
                        >
                            Chèn hình ảnh
                        </Button>
                    </div>
                </CustomizeModal>
            </>
        );
    }
);
CustomizeEditor.displayName = "CustomizeEditor";
export default observer(CustomizeEditor);
