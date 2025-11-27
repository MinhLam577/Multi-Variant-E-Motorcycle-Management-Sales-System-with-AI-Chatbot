import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, Modal, Upload, UploadFile } from "antd";
import { useEffect, useState } from "react";
import NewsSearch from "@/components/categories_blog/NewsSearch";
import AdminBreadCrumb from "@/components/common/AdminBreadCrumb";
import CustomizeTab from "@/components/common/CustomizeTab";
import { getBreadcrumbItems } from "@/containers/layout";
import { GlobalFilterCategoriesNews } from "../categoriesNews";
import BrandsTable from "./BrandsTable";
import { useStore } from "@/stores";
import { BrandResponseType, CreateBrandDto } from "@/types/brand.type";
import { set, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import CustomizeModal from "@/components/common/CustomizeModal";
import { AcceptImageTypes } from "@/constants";
import {
    convertBase64ToFile,
    filterEmptyFields,
    getBase64,
    getErrorMessage,
} from "@/utils";
import BaseAPI from "@/api/base";
import "./index.css";
import { UploadChangeParam } from "antd/lib/upload";
import Access from "@/access/access";
import { ALL_PERMISSIONS } from "@/constants/permissions";

const BrandsPage = () => {
    const [globalFilters, setGlobalFilters] =
        useState<GlobalFilterCategoriesNews>({
            search: undefined,
            created_from: undefined,
            created_to: undefined,
        });
    const store = useStore();
    const brandStore = store.brandObservable;

    const fetchBrands = async (query?: GlobalFilterCategoriesNews) => {
        try {
            await brandStore.getListBrands({
                ...brandStore.pagination,
                ...(query ? query : {}),
            });
        } catch (e) {}
    };
    useEffect(() => {
        fetchBrands({
            ...globalFilters,
        });
    }, []);
    useEffect(() => {
        fetchBrands({
            ...globalFilters,
        });
    }, [globalFilters]);

    const handleDeleteBrands = async (id: string) => {
        try {
            await brandStore.deleteBrand(id);
        } catch (e) {
            console.error("Error deleting brand:", e);
        }
    };
    const handleUpdateBrands = async (item: BrandResponseType) => {
        try {
            const thumbnailUrl = item.thumbnailUrl ? item.thumbnailUrl : "";

            if (!thumbnailUrl) {
                setPreviewImage("");
                createForm.setFieldsValue({
                    thumbnailUrl: {
                        file: null,
                        fileList: [],
                    },
                });
                return;
            }
            const base64Image = await BaseAPI.convertUrlToBase64(
                item.thumbnailUrl
            );
            const file: UploadFile = base64Image
                ? {
                      uid: item.id,
                      name: item.name,
                      status: "done",
                      url: base64Image,
                      thumbUrl: base64Image,
                      response: base64Image,
                  }
                : undefined;
            const fileList = base64Image ? [file] : [];
            createForm.setFieldsValue({
                name: item.name,
                slug: item.slug,
                description: item.description,
                thumbnailUrl: {
                    file: file,
                    fileList: fileList,
                },
            });
            setOpenModalCreate(true);
            setBrandSelected(item.id);
            setType("update");
            setPreviewImage(base64Image || "");
        } catch (e) {
            console.error("Error updating brand:", e);
        }
    };

    const handleFormImageChange = (
        info: UploadChangeParam<UploadFile<any>>
    ) => {
        const { fileList = [] } = info;
        if (fileList.length > 0) {
            const lastFile = fileList[fileList.length - 1];
            if (lastFile.status === "done") {
                setPreviewImage(lastFile.response || "");
            } else if (lastFile.status === "error") {
                store.setStatusMessage(
                    500,
                    "Lỗi khi tải lên hình ảnh",
                    "",
                    false
                );
            }
        } else {
            setPreviewImage("");
        }
    };

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [createForm] = Form.useForm();
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [type, setType] = useState<"create" | "update">("create");
    const [brandSelected, setBrandSelected] = useState<string | null>(null);
    const handleSaveCreateModal = async () => {
        try {
            store.setLoading(true);
            const values: CreateBrandDto & {
                thumbnailUrl?: { file: File; fileList: UploadFile[] };
            } = await createForm.validateFields();
            const { thumbnailUrl, ...rest } = values;
            const data: CreateBrandDto = {
                ...rest,
                thumbnailUrl: "",
            };
            if (
                thumbnailUrl &&
                thumbnailUrl?.fileList &&
                thumbnailUrl?.fileList?.length > 0
            ) {
                const base64 = thumbnailUrl.fileList[0]?.response || "";
                if (!base64) {
                    store.setStatusMessage(
                        400,
                        "Vui lòng tải lên hình ảnh hợp lệ",
                        "",
                        false
                    );
                    return;
                }
                const file = await convertBase64ToFile(
                    base64,
                    `${data.name}.jpeg`
                );
                const uploadFile = await BaseAPI.uploadImagesToServer([file]);
                if ("path" in uploadFile) {
                    const { message } = uploadFile;
                    const errorMessage = Array.isArray(message)
                        ? message.join(", ")
                        : message;
                    throw new Error(errorMessage);
                }

                data.thumbnailUrl = uploadFile[0].url;
            }
            const dataToCreate: CreateBrandDto = filterEmptyFields(data);
            if (type === "update") {
                if (!brandSelected) {
                    store.setStatusMessage(
                        400,
                        "Vui lòng chọn nhãn hàng để cập nhật",
                        "",
                        false
                    );
                    return;
                }
                const result = await brandStore.updateBrand(
                    brandSelected,
                    dataToCreate
                );
                if (result) {
                    store.setStatusMessage(
                        200,
                        "Cập nhật nhãn hàng thành công",
                        "",
                        true
                    );
                    await fetchBrands({
                        ...globalFilters,
                    });
                    handleCloseCreateModal();
                }
            } else {
                const result = await brandStore.createBrand(dataToCreate);
                if (result) {
                    store.setStatusMessage(
                        200,
                        "Tạo nhãn hàng thành công",
                        "",
                        true
                    );
                    await fetchBrands({
                        ...globalFilters,
                    });
                    handleCloseCreateModal();
                }
            }
        } catch (error) {
            console.error("Error saving brand:", error);
            store.setStatusMessage(
                500,
                getErrorMessage(error, "Lỗi khi lưu tạo sản phẩm"),
                "",
                false
            );
        } finally {
            store.setLoading(false);
        }
    };

    const handleCloseCreateModal = () => {
        setOpenModalCreate(false);
        createForm.resetFields();
        setPreviewImage("");
        setPreviewVisible(false);
        createForm.setFieldsValue({
            thumbnailUrl: {
                file: null,
                fileList: [],
            },
        });
        setType("create");
        setBrandSelected(null);
    };

    const handlePreviewImage = async (file: UploadFile) => {
        if (!previewImage) {
            return;
        }
        setPreviewVisible(true);
    };

    const handleFormValueChange = (changeValues: any, allValues: any) => {};

    return (
        <section className="w-full">
            <div
                className={`flex justify-between items-start animate-slideDown flex-col gap-4 md:flex-row md:gap-0 md:items-center`}
            >
                <AdminBreadCrumb
                    description="Danh sách các nhãn hàng cung cấp"
                    items={getBreadcrumbItems(location.pathname)}
                />

                <Access permission={ALL_PERMISSIONS.BRANDS.CREATE} hideChildren>
                    <div className="flex gap-2">
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={() => {
                                createForm.resetFields();
                                setOpenModalCreate(true);
                            }}
                            size="large"
                            className="!rounded-none"
                        >
                            Tạo mới
                        </Button>
                    </div>
                </Access>
            </div>
            <div className="w-full flex flex-col gap-4 bg-[var(--content-table-background-color)] rounded-md px-4 pb-4 my-6 animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả nhãn hàng",
                            children: (
                                <div className="w-full flex flex-col gap-4">
                                    <NewsSearch setFilters={setGlobalFilters} />
                                    <BrandsTable
                                        data={toJS(brandStore.data)}
                                        handleDeleteBrands={handleDeleteBrands}
                                        handleViewOrUpdateBrands={
                                            handleUpdateBrands
                                        }
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            <CustomizeModal
                isOpen={openModalCreate}
                title="Tạo mới nhãn hàng"
                handleCloseModal={handleCloseCreateModal}
                handleSaveModal={handleSaveCreateModal}
                width={600}
                forceRender
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    autoComplete="off"
                    className="w-full"
                    onValuesChange={handleFormValueChange}
                >
                    <Form.Item
                        label="Tên nhãn hàng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên nhãn hàng",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập tên nhãn hàng"
                            className="w-full"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Slug nhãn hàng"
                        name="slug"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập slug nhãn hàng",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập slug nhãn hàng"
                            className="w-full"
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả nhãn hàng" name="description">
                        <Input.TextArea
                            placeholder="Nhập mô tả nhãn hàng"
                            className="w-full"
                            autoSize={{ minRows: 4, maxRows: 6 }}
                        />
                    </Form.Item>
                    <div className="w-full relative">
                        {previewImage && (
                            <div style={{ display: "none" }}>
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    width={100}
                                    height={100}
                                    preview={{
                                        visible: previewVisible,
                                        onVisibleChange: (visible) =>
                                            setPreviewVisible(visible),
                                    }}
                                />
                            </div>
                        )}
                        <Form.Item
                            label="Logo nhãn hàng"
                            name="thumbnailUrl"
                            required={true}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (
                                            value &&
                                            value.fileList &&
                                            value.fileList.length > 0
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            "Vui lòng tải lên logo nhãn hàng"
                                        );
                                    },
                                },
                            ]}
                            className="!w-full"
                        >
                            <Upload
                                accept="image/*"
                                listType="picture"
                                maxCount={1}
                                multiple={false}
                                beforeUpload={(file) => {
                                    if (!file) return Upload.LIST_IGNORE;
                                    if (file.size > 2 * 1024 * 1024) {
                                        store.setStatusMessage(
                                            400,
                                            "Kích thước ảnh không được vượt quá 2MB",
                                            "",
                                            false
                                        );
                                        return Upload.LIST_IGNORE;
                                    }
                                    if (!AcceptImageTypes.includes(file.type)) {
                                        store.setStatusMessage(
                                            400,
                                            "Chỉ chấp nhận các định dạng hình ảnh: " +
                                                AcceptImageTypes.join(", "),
                                            "",
                                            false
                                        );
                                        return Upload.LIST_IGNORE;
                                    }
                                    return true;
                                }}
                                showUploadList={{
                                    showPreviewIcon: true,
                                    showRemoveIcon: true,
                                }}
                                onPreview={handlePreviewImage}
                                customRequest={async ({ file, onSuccess }) => {
                                    try {
                                        const base64 = await getBase64(
                                            file as File
                                        );
                                        onSuccess(base64, file);
                                    } catch (error) {
                                        console.error("Upload failed:", error);
                                    }
                                }}
                                fileList={
                                    createForm.getFieldValue("thumbnailUrl") &&
                                    createForm.getFieldValue("thumbnailUrl")
                                        ?.fileList?.length > 0
                                        ? createForm.getFieldValue(
                                              "thumbnailUrl"
                                          )?.fileList
                                        : undefined
                                }
                                onChange={handleFormImageChange}
                                className="!w-full upload-brand-thumbnail"
                            >
                                {!previewImage && (
                                    <label
                                        htmlFor="uploadImageFile"
                                        className={`flex flex-col items-center justify-center w-full border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 min-h-24 gap-2
                                        `}
                                    >
                                        <UploadOutlined
                                            className={`text-2xl`}
                                        />
                                        <span
                                            className={`text-sm text-gray-500`}
                                        >
                                            Tải lên hình ảnh
                                        </span>
                                    </label>
                                )}
                            </Upload>
                        </Form.Item>
                    </div>
                </Form>
            </CustomizeModal>
        </section>
    );
};

export default observer(BrandsPage);
