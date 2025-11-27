import {
    Col,
    Form,
    Input,
    Row,
    Select,
    TreeSelect,
    Upload,
    UploadFile,
} from "antd";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckFileInput, getBase64 } from "@/utils";
import {
    DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT,
    IFormSkuCustomData,
    SelectType,
    TreeSelectType,
} from "../ModalCreateProduct.type";
import { modalCreateProductStore } from "../ModalCreateProduct.store";
import { EnumProductStore, EnumProductType } from "@/types/product.type";
import { UploadOutlined } from "@ant-design/icons";
import { AcceptImageTypes } from "@/constants";
import { FormInstance } from "antd/lib";
import { useStore } from "@/stores";
import CustomizeEditor from "@/components/common/CustomizeEditor";
import ReactQuill from "react-quill-new";
import { CategoryResponseType } from "@/types/categories.type";
import ImageModal from "@/components/common/ImageModal";
interface IGeneralInformation {
    form: FormInstance;
    formInitialValues: Record<string, any>;
    subForm: FormInstance;
    initialOptionsBrand: SelectType[];
    initialOptionsCategory: CategoryResponseType[];
}
export const getCategoriesTreeSelect = (
    data: CategoryResponseType[],
    excludeId?: string,
    maxLevel: number = 3
): TreeSelectType[] => {
    const buildTree = (
        nodes: CategoryResponseType[],
        level: number
    ): TreeSelectType[] =>
        nodes
            ?.filter((item) => item.id !== excludeId)
            .map((item) => ({
                value: item.id,
                title: item.name,
                children:
                    level < maxLevel && item.children
                        ? buildTree(item.children, level + 1)
                        : [],
            }));

    return buildTree(data, 1);
};
export const getSelectedTreeSelect = (
    nodes: CategoryResponseType[],
    maxLevel?: number
) => {
    const buildTree = (nodes: CategoryResponseType[], level = 1) => {
        return nodes.map((node) => ({
            ...node,
            ...(maxLevel ? { selectable: level === maxLevel } : {}),
            children: node.children
                ? getSelectedTreeSelect(node.children, level + 1)
                : undefined,
        }));
    };

    return buildTree(nodes);
};

const GeneralInformation: React.FC<IGeneralInformation> = observer(
    ({
        form,
        formInitialValues,
        subForm,
        initialOptionsBrand,
        initialOptionsCategory,
    }) => {
        const [formImageList, setFormImageList] = useState<UploadFile[]>([]);
        const [previewVisible, setPreviewVisible] = useState<boolean>(false);
        const [previewImage, setPreviewImage] = useState<string>("");
        // Hàm thêm selectable cho node cấp độ truyền vào

        const [selectableTreeData, setSelectableTreeData] = useState<
            TreeSelectType[]
        >([]);
        const [category, setCategory] = useState<CategoryResponseType[]>([]);
        useEffect(() => {
            if (initialOptionsCategory.length > 0) {
                setCategory(initialOptionsCategory);
            }
        }, [initialOptionsCategory]);

        useEffect(() => {
            setSelectableTreeData(getCategoriesTreeSelect(category));
        }, [category]);
        const handleTypeChange = (value) => {
            if (!value) {
                setCategory(initialOptionsCategory);
                return;
            }
            setCategory(initialOptionsCategory.filter((c) => c.type === value));
        };
        const store = useStore();
        const productStore = store.productObservable;
        const handleQuillChange = (content: string, delta, source, editor) => {
            try {
                form.setFieldValue("description", content);
            } catch (e) {}
        };
        const quillRef = useRef<ReactQuill>(null);
        const handlePreview = useCallback(
            async (file: UploadFile) => {
                if (file.url) {
                    setPreviewVisible(true);
                    setPreviewImage(file.url);
                    return;
                }
                if (file.originFileObj) {
                    const base64Url = await getBase64(file.originFileObj);
                    setPreviewImage(base64Url);
                }
                setPreviewVisible(true);
            },
            [form]
        );
        useEffect(() => {
            if (formInitialValues) {
                const subFormValue: Record<
                    string,
                    Omit<IFormSkuCustomData, "name">
                > = subForm.getFieldValue("skus");
                if (subFormValue) {
                    modalCreateProductStore.setFullCustomData(subFormValue);
                }
                form.setFieldsValue(formInitialValues);
                const imageList = form.getFieldValue("image") || [];
                if (!Array.isArray(imageList)) {
                    setFormImageList([]);
                    return;
                }
                setFormImageList(
                    imageList.map((item: string | UploadFile) => {
                        if (typeof item === "string") {
                            return {
                                uid: item,
                                name: item.split("/").pop() || "image",
                                status: "done",
                                url: item,
                            };
                        }
                        return item;
                    })
                );
            }
        }, [formInitialValues, form, subForm]);
        useEffect(() => {
            const initialImages = form.getFieldValue("image") || [];
            if (
                JSON.stringify(initialImages) !== JSON.stringify(formImageList)
            ) {
                form.setFieldValue("image", formImageList);
            }
        }, [formImageList]);
        const productTypeOption: SelectType[] = Object.keys(
            EnumProductType
        ).map((key) => ({
            label: EnumProductType[key as keyof typeof EnumProductType],
            value: EnumProductStore[key as keyof typeof EnumProductStore],
        }));

        return (
            <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                    <span>Thông tin chung</span>
                </h2>
                <div className="flex flex-col">
                    <Form.Item
                        label="Tên sản phẩm"
                        name={"title"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên sản phẩm",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập tên sản phẩm"
                            className="w-full p-[0.625rem] h-10 rounded border border-solid border-gray-200"
                            autoComplete="off"
                        />
                    </Form.Item>
                    <Row gutter={24}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Loại xe"
                                name={"type"}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn loại xe",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn loại xe"
                                    showSearch
                                    className="h-10"
                                    options={productTypeOption}
                                    optionFilterProp="label"
                                    onChange={handleTypeChange}
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Slug sản phẩm"
                                name={"slug_product"}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập slug sản phẩm",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Nhập slug sản phẩm"
                                    className="w-full p-[0.625rem] h-10 rounded border border-solid border-gray-200"
                                    autoComplete="off"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Nhãn hàng"
                                name={"brand_id"}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn nhãn hàng",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn nhãn hàng"
                                    showSearch
                                    className="h-10"
                                    options={initialOptionsBrand}
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Danh mục"
                                name={"category_id"}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn danh mục",
                                    },
                                ]}
                            >
                                <TreeSelect
                                    placeholder="Chọn danh mục"
                                    showSearch
                                    treeData={selectableTreeData}
                                    className="h-10"
                                    treeDefaultExpandAll
                                    treeNodeFilterProp="title"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="flex flex-col gap-2 mb-4">
                        <span className="text-sm text-gray-700">
                            Mô tả sản phẩm
                        </span>
                        <div className="w-full h-[25rem] overflow-y-auto border border-solid border-[var(--border-gray)] rounded-md editor-container">
                            <Form.Item name="description">
                                <CustomizeEditor
                                    onChange={handleQuillChange}
                                    folder="Cars"
                                    theme="snow"
                                    value={form.getFieldValue("description")}
                                    ref={quillRef}
                                    store={productStore}
                                    className="w-full h-full"
                                    defaultForm={form}
                                    fieldFormName="description"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item
                        label="Hình ảnh sản phẩm"
                        name="image"
                        tooltip={`Ảnh nhận định dạng ${AcceptImageTypes.map((image) => "." + image.split("/")[1]).join(", ")}và được chọn tối đa 5 hình ảnh`}
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (!modalCreateProductStore.hasSkus) {
                                        return value && value.length > 0
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                  new Error(
                                                      "Vui lòng tải lên ít nhất một hình ảnh"
                                                  )
                                              );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <div className="w-full min-h-32">
                            <label
                                htmlFor="uploadImageFile"
                                className={`h-32 flex flex-col items-center justify-center w-full border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-all duration-500 ease-in-out ${Number(formImageList?.length) === 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-32"} origin-top`}
                            >
                                <UploadOutlined className={`text-2xl`} />
                                <span className={`text-sm text-gray-500`}>
                                    Tải lên hình ảnh
                                </span>
                            </label>
                            <div className="flex items-center justify-start w-full gap-2 overflow-x-auto">
                                <div className="flex flex-nowrap gap-2 overflow-x-auto">
                                    <Upload
                                        name="uploadImageFile"
                                        id="uploadImageFile"
                                        accept={AcceptImageTypes.join(",")}
                                        listType="picture-card"
                                        showUploadList={{
                                            showPreviewIcon: true,
                                            showRemoveIcon: true,
                                        }}
                                        maxCount={
                                            DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT
                                        }
                                        multiple
                                        beforeUpload={(file, fileList) => {
                                            const { isValid, errorMessage } =
                                                CheckFileInput(file);
                                            if (!isValid) {
                                                store.setStatusMessage(
                                                    400,
                                                    errorMessage,
                                                    "",
                                                    false
                                                );
                                                return Upload.LIST_IGNORE;
                                            }
                                            if (
                                                formImageList.length >
                                                    DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT ||
                                                fileList.length >
                                                    DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT -
                                                        formImageList.length
                                            ) {
                                                store.setStatusMessage(
                                                    400,
                                                    `Chỉ được upload tối đa ${DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT} ảnh!`,
                                                    "",
                                                    false
                                                );
                                                return Upload.LIST_IGNORE;
                                            }
                                            return true;
                                        }}
                                        onChange={(info) => {
                                            setFormImageList([
                                                ...info.fileList,
                                            ]);
                                        }}
                                        fileList={
                                            Array.isArray(formImageList)
                                                ? formImageList
                                                : undefined
                                        }
                                        customRequest={async ({
                                            file,
                                            onSuccess,
                                            onError,
                                        }) => {
                                            onSuccess("Thành công", file);
                                        }}
                                        onPreview={handlePreview}
                                        onRemove={(file) => {
                                            setFormImageList((prev) => [
                                                ...prev.filter(
                                                    (item) =>
                                                        item.uid !== file.uid
                                                ),
                                            ]);
                                        }}
                                        className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${
                                            Number(formImageList?.length) !== 0
                                                ? "opacity-100 scale-100 translate-y-0"
                                                : "opacity-0 scale-0 -translate-y-32 pointer-events-none"
                                        }`}
                                    >
                                        <div
                                            className={`flex flex-col items-center justify-center flex-[0_0_102px]`}
                                        >
                                            <UploadOutlined className="text-2xl" />
                                        </div>
                                    </Upload>
                                </div>
                            </div>
                        </div>
                    </Form.Item>
                    <ImageModal
                        imageSrc={previewImage}
                        isOpen={previewVisible}
                        onClose={() => {
                            setPreviewVisible(false);
                        }}
                        alt="Ảnh"
                        styles={{
                            closeBtn: {
                                fontSize: "3.125rem",
                            },
                            image: {
                                borderRadius: "10px",
                            },
                        }}
                    />
                </div>
            </div>
        );
    }
);

export default GeneralInformation;
