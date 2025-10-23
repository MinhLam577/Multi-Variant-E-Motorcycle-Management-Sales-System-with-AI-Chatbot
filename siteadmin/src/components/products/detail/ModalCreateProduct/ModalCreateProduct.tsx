import {
    Button,
    Col,
    Form,
    FormInstance,
    Image,
    Input,
    Row,
    Table,
    UploadFile,
} from "antd";
import CustomizeModal from "../../../common/CustomizeModal";
import "./ModalCreateProduct.css";
import { useStore } from "src/stores";
import React, { useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import GeneralInformation from "./detail/GeneralInformation";
import {
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import {
    convertBase64ToFile,
    filterEmptyFields,
    generateUUIDV4,
} from "src/utils";
import debounce from "lodash.debounce";
import { AcceptImageTypes } from "src/constants";
import BaseAPI from "src/api/base";
import {
    CreateProductDto,
    CreateProductSpecificationDto,
    CreateSkusDto,
    SkusDetailImportDto,
    UpdateProductDto,
    VariantCombinationDto,
} from "src/stores/product.store";
import { ResponseImage } from "src/api";
import FormListSelectOrInput from "../FormListSelectOrInput";
import { useNavigate } from "react-router";
import { CategoryResponseType } from "src/stores/categories.store";
import {
    IFormSkuCustomData,
    IModalCreateProductProps,
    IVariantCombination,
    SelectType,
    UpdateProductPriceType,
    UpdateProductValueFunc,
} from "./ModalCreateProduct.type";
import SpecificationsInformation from "./detail/SpecificationsInformation";
import { modalCreateProductStore } from "./ModalCreateProduct.store";
import PriceInformation from "./detail/PriceInformation";
import InventoryInformation from "./detail/InventoryInformation";
import VariantInformation from "./detail/VariantInformation";

export const debounceHandleUpdateProductValue: UpdateProductValueFunc =
    debounce(
        (
            field: UpdateProductPriceType,
            value: string,
            warehouseId?: string
        ) => {
            // Cập nhật MobX
            if (field === "quantity_import" && warehouseId) {
                modalCreateProductStore.setWarehouse_selected_quantities(
                    value || "0",
                    warehouseId
                );
            } else if (
                field === "price_import" ||
                field === "price_sold" ||
                field === "price_compare"
            ) {
                modalCreateProductStore.setPrice(value, field);
            } else if (field === "barcode") {
                modalCreateProductStore.setBarcode(value);
            } else if (field === "masku") {
                modalCreateProductStore.setMasku(value);
            }
        },
        300
    );
const ModalCreateProduct: React.FC<IModalCreateProductProps> = ({
    isOpen,
    onClose,
    onSave,
    okText,
    cancelText,
    title,
    form,
    subForm,
    formInitialValues,
    categorySelectData,
    brandSelectData,
    warehouseSelectData,
    optionSelectData,
    loadingData,
    productId,
    messageWhenSave,
}) => {
    const store = useStore();
    const productStore = store.productObservable;
    const initialOptionsBrand: SelectType[] = brandSelectData?.length
        ? brandSelectData
        : [];
    const initialOptionsCategory: CategoryResponseType[] =
        categorySelectData?.length ? categorySelectData : [];
    const initialOptionsInventory: SelectType[] = warehouseSelectData?.length
        ? warehouseSelectData
        : [];
    const initialOptionsVariant: SelectType[] = optionSelectData?.length
        ? optionSelectData
        : [];

    const validateSkusData = async (imageUrl?: string[]) => {
        const variants: VariantCombinationDto[] = (
            form.getFieldValue("variants") || []
        ).flatMap((item: { name: string; values: { value: string }[] }) =>
            item.values.map((value) => ({
                option_id: item.name,
                value: value.value,
            }))
        );
        if (!variants.length) {
            const defaultDetailImport: SkusDetailImportDto[] =
                modalCreateProductStore.warehouse_selected_quantities.map(
                    (item) => ({
                        warehouse_id: item.warehouse_id,
                        quantity_import: Number(item.quantity_import) || 0,
                        price_import:
                            Number(form.getFieldValue("price_import")) || 0,
                    })
                );
            const defaultSkus: CreateSkusDto = filterEmptyFields({
                price_sold: Number(form.getFieldValue("price_sold")),
                price_compare: Number(form.getFieldValue("price_compare")),
                detail_import: defaultDetailImport,
                barcode: form.getFieldValue("barcode"),
                masku: form.getFieldValue("masku"),
                image: imageUrl?.length ? imageUrl[0] : "",
            });
            return [defaultSkus];
        }
        const skusCustomData = Array.from(
            modalCreateProductStore.skuCustomData.entries()
        );
        if (!skusCustomData.length) {
            throw new Error(
                "Tồn tại chi tiết nhập kho của biến thể không hợp lệ"
            );
        }

        const fileResults = await Promise.all(
            skusCustomData.map(async ([name, item]) => {
                if (!item.image || !item.image.startsWith("data:image/")) {
                    throw new Error(
                        `Chuỗi base64 không hợp lệ cho biến thể ${name}`
                    );
                }
                const file = await convertBase64ToFile(
                    item.image,
                    `${name}.jpeg`
                );
                return { name, file, item };
            })
        );

        const uploadData = await BaseAPI.uploadImagesToServer(
            fileResults.map(({ file }) => file)
        );
        if ("path" in uploadData) {
            throw new Error(
                Array.isArray(uploadData.message)
                    ? uploadData.message.join(", ")
                    : uploadData.message
            );
        }
        const uploadImage = uploadData.map((data) => data.url);
        if (uploadImage.length !== fileResults.length) {
            throw new Error(
                "Số ảnh trả về không khớp với số lượng ảnh tải lên"
            );
        }

        const detail_import_per_sku: Record<string, SkusDetailImportDto[]> = {};
        skusCustomData.forEach(([name, item]) => {
            if (!item.detail_import || !item.detail_import.length) {
                throw new Error(
                    `Chi tiết nhập kho của biến thể ${name} không hợp lệ`
                );
            }
            item.detail_import.forEach((detail) => {
                if (!detail.warehouse_id || !detail.quantity_import) {
                    throw new Error(
                        `Chi tiết nhập kho của biến thể ${name} không hợp lệ`
                    );
                }
                if (!detail_import_per_sku[name]) {
                    detail_import_per_sku[name] = [];
                }
                detail_import_per_sku[name].push({
                    warehouse_id: detail.warehouse_id,
                    quantity_import: detail.quantity_import,
                    price_import: Number(form.getFieldValue("price_import")),
                    lot_name: detail.lot_name || "",
                });
            });
        });

        const skusData: CreateSkusDto[] = fileResults.map(
            ({ name, item }, index) =>
                filterEmptyFields({
                    barcode: item.barcode,
                    masku: item.masku,
                    price_sold: Number(item.price_sold),
                    price_compare: Number(item.price_compare),
                    detail_import: detail_import_per_sku[name],
                    image: uploadImage[index],
                    variant_combinations: item.variant_combinations,
                })
        );
        return skusData;
    };

    const validateProductData = async () => {
        const uploadUrl = await handleUploadProductImage();
        const specifications: CreateProductSpecificationDto[] = form
            .getFieldValue("specifications")
            ?.map((item: { name: string; values: { value: string }[] }) => {
                const values = item.values.map(
                    (value: { value: string }) => value.value
                );
                return values.map((value: string) => ({
                    name: item.name,
                    value: value,
                }));
            })
            .flat();
        if (!productId) {
            const productData: CreateProductDto = filterEmptyFields({
                type: form.getFieldValue("type"),
                slug_product: form.getFieldValue("slug_product"),
                title: form.getFieldValue("title"),
                brand_id: form.getFieldValue("brand_id"),
                category_id: form.getFieldValue("category_id"),
                description: form.getFieldValue("description"),
                specifications: specifications,
                images: uploadUrl,
                skus: (await validateSkusData(uploadUrl)) as CreateSkusDto[],
            });
            return productData;
        } else {
            const productData: UpdateProductDto = filterEmptyFields({
                type: form.getFieldValue("type"),
                slug_product: form.getFieldValue("slug_product"),
                title: form.getFieldValue("title"),
                brand_id: form.getFieldValue("brand_id"),
                category_id: form.getFieldValue("category_id"),
                description: form.getFieldValue("description"),
                specifications: specifications,
                images: uploadUrl,
            });
            return productData;
        }
    };

    const handleUploadProductImage = async () => {
        const productImage = Array.isArray(form.getFieldValue("image"))
            ? form.getFieldValue("image")
            : [];
        if (!productImage?.length) {
            return [];
        }
        const productImagesOriginFile = productImage
            .map((item: UploadFile) =>
                item.originFileObj ? item.originFileObj : item
            )
            .filter((item: any) => item !== undefined && item !== null);
        if (!productImagesOriginFile?.length) {
            return [];
        }
        const uploadedFiles = await BaseAPI.uploadImagesToServer(
            productImagesOriginFile
        );
        if ("path" in uploadedFiles) {
            const { message } = uploadedFiles;
            const errorMessage = Array.isArray(message)
                ? message.join(", ")
                : message;
            throw new Error(errorMessage);
        }
        return uploadedFiles.map((file: ResponseImage) => file.url);
    };

    const handleSubmit = async (values) => {
        try {
            store.setLoading(true);
            const skusFormValue = form.getFieldValue("skus");
            const validName = [...modalCreateProductStore.skuCustomData.keys()];
            if (
                validName.length > 0 &&
                (!skusFormValue ||
                    skusFormValue.every(
                        (sku: IFormSkuCustomData) =>
                            !validName.includes(sku.name)
                    ))
            ) {
                store.setStatusMessage(
                    400,
                    `Dữ liệu biến thể ${validName.join(", ")} chưa điền hoặc không hợp lệ`,
                    "",
                    false
                );
                return;
            }
            const productData = await validateProductData();
            let res = null;
            if (!productId) {
                res = await productStore.createProduct(
                    productData as CreateProductDto
                );
            } else {
                res = await productStore.updateProduct(
                    productId,
                    productData as UpdateProductDto
                );
            }
            if (res) {
                store.setStatusMessage(
                    200,
                    "",
                    messageWhenSave || "Tạo mới sản phẩm thành công",
                    true
                );
                if (loadingData) {
                    loadingData();
                }
                handleCloseCreateProductModal();
            }
        } catch (e) {
            const errorMessage =
                e instanceof Error
                    ? e.message
                    : "Có lỗi xảy ra trong quá trình lưu tạo sản phẩm";
            store.setStatusMessage(500, errorMessage, "", false);
        } finally {
            store.setLoading(false);
        }
    };

    const handleCloseCreateProductModal = () => {
        modalCreateProductStore.clearSkusCustomData();
        modalCreateProductStore.clearVariantCombination();
        modalCreateProductStore.clearWarehouseSelectedAndQuantity();
        form.setFieldsValue({});
        subForm.setFieldsValue({});
        form.resetFields();
        subForm.resetFields();
        onClose();
    };

    const handleSubmitFailed = (errorInfo: any) => {
        const errorMessage =
            errorInfo &&
            typeof errorInfo === "object" &&
            "errorFields" in errorInfo &&
            Array.isArray(errorInfo.errorFields)
                ? "Vui lòng nhập đầy đủ thông tin của sản phẩm"
                : errorInfo instanceof Error
                  ? errorInfo.message
                  : "Có lỗi xảy ra lưu trong quá trình tạo mới sản phẩm";

        store.setStatusMessage(400, errorMessage, "", false);
    };

    const handleFormFieldChange = (changedFields: any, allFields: any) => {};

    const handleFormValueChange = (changedValues: any, values: any) => {};

    const navigate = useNavigate();
    return (
        <>
            <CustomizeModal
                isOpen={isOpen}
                handleCloseModal={handleCloseCreateProductModal}
                handleSaveModal={onSave}
                okText={okText}
                cancelText={cancelText}
                width={900}
                title={title || "Tạo mới sản phẩm"}
                className="modal-create-product"
            >
                <div className="w-full">
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col gap-8 w-full"
                        autoComplete="off"
                        onFinish={handleSubmit}
                        onFinishFailed={handleSubmitFailed}
                        onFieldsChange={handleFormFieldChange}
                        onValuesChange={handleFormValueChange}
                    >
                        <GeneralInformation
                            form={form}
                            formInitialValues={formInitialValues}
                            initialOptionsBrand={initialOptionsBrand}
                            subForm={subForm}
                            initialOptionsCategory={initialOptionsCategory}
                        />
                        <SpecificationsInformation form={form} />

                        {productId && (
                            <Button
                                onClick={() => {
                                    navigate("/variants", {
                                        state: {
                                            productId: productId,
                                        },
                                    });
                                    handleCloseCreateProductModal();
                                }}
                            >
                                Quản lí biến thể
                            </Button>
                        )}
                        {!productId && (
                            <>
                                <PriceInformation form={form} />
                                <InventoryInformation
                                    form={form}
                                    initialOptionsInventory={
                                        initialOptionsInventory
                                    }
                                    productId={productId}
                                />
                                <VariantInformation
                                    defaultForm={subForm}
                                    form={form}
                                    initialOptionsVariant={
                                        initialOptionsVariant
                                    }
                                    productId={productId}
                                    subForm={subForm}
                                />
                            </>
                        )}
                    </Form>
                </div>
            </CustomizeModal>
        </>
    );
};

export default observer(ModalCreateProduct);
