import { Col, Form, FormInstance, Image, Input, Row } from "antd";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { CheckFileInput, generateUUIDV4 } from "src/utils";
import { modalCreateProductStore } from "../ModalCreateProduct.store";
import { ColumnsType } from "antd/es/table";
import {
    IFormSkuCustomData,
    IVariantCombination,
    SelectType,
} from "../ModalCreateProduct.type";
import { AcceptImageTypes } from "src/constants";
import FormListSelectOrInput from "../../FormListSelectOrInput";
import {
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { Table } from "antd/lib";
import CustomizeModal from "src/components/common/CustomizeModal";
import debounce from "lodash.debounce";
import { useStore } from "src/stores";
const VariantInformation: React.FC<{
    defaultForm: FormInstance;
    form: FormInstance;
    subForm: FormInstance;
    productId: string;
    initialOptionsVariant: SelectType[];
}> = observer(
    ({ defaultForm, subForm, form, productId, initialOptionsVariant }) => {
        const store = useStore();
        const [isOpenUpdateVariantModal, setIsOpenUpdateVariantModal] =
            useState<boolean>(false);
        const [inputFileKey, setInputFileKey] =
            useState<string>(generateUUIDV4());

        // Đồng bộ subForm khi skusNameSelected thay đổi
        useEffect(() => {
            if (
                isOpenUpdateVariantModal &&
                modalCreateProductStore.skusNameSelected
            ) {
                const name = modalCreateProductStore.skusNameSelected;
                const currentSku =
                    modalCreateProductStore.skuCustomData.get(name);
                const initialSubFormValues = {
                    skus: {
                        [name]: {
                            price_sold:
                                currentSku?.price_sold ||
                                modalCreateProductStore.price_sold ||
                                0,
                            price_compare:
                                currentSku?.price_compare ||
                                modalCreateProductStore.price_compare ||
                                0,
                            price_import:
                                currentSku?.price_import ||
                                modalCreateProductStore.price_import ||
                                0,
                            masku:
                                currentSku?.masku ||
                                modalCreateProductStore.masku ||
                                "",
                            image: currentSku?.image || null,
                            barcode:
                                currentSku?.barcode ||
                                modalCreateProductStore.barcode ||
                                "",
                            detail_import: currentSku?.detail_import?.length
                                ? Object.entries(
                                      currentSku?.detail_import?.reduce(
                                          (acc: any, item: any) => ({
                                              ...acc,
                                              [item.warehouse_id]: {
                                                  quantity_import:
                                                      item.quantity_import || 0,
                                                  lot_name: item.lot_name || "",
                                              },
                                          }),
                                          {}
                                      )
                                  ).map(([key, value]) => ({
                                      warehouse_id: key,
                                      quantity_import:
                                          (
                                              value as {
                                                  quantity_import: number;
                                                  lot_name: string;
                                              }
                                          ).quantity_import || 0,
                                      lot_name:
                                          (
                                              value as {
                                                  quantity_import: number;
                                                  lot_name: string;
                                              }
                                          )?.lot_name || "",
                                  }))
                                : [],
                        },
                    },
                };
                subForm.setFieldsValue(initialSubFormValues);
            }
        }, [
            isOpenUpdateVariantModal,
            modalCreateProductStore.skusNameSelected,
            modalCreateProductStore.skuCustomData,
        ]);
        const handleUpdateVariantValue = useCallback(
            debounce((field: string, value: string, warehouseId?: string) => {
                const name = modalCreateProductStore.skusNameSelected;
                if (!name) return;

                // Cập nhật MobX
                if (field === "quantity_import") {
                    modalCreateProductStore.updateSkusQuantityImport(
                        value,
                        warehouseId
                    );
                } else if (field === "price_import") {
                    modalCreateProductStore.updateSkusPriceImport(value);
                } else if (field === "price_sold") {
                    modalCreateProductStore.updateSkusPriceSold(value);
                } else if (field === "price_compare") {
                    modalCreateProductStore.updateSkusPriceCompare(value);
                } else if (field === "barcode") {
                    modalCreateProductStore.updateSkusBarcode(value);
                } else if (field === "masku") {
                    modalCreateProductStore.updateSkusMasku(value);
                } else if (field === "lot_name") {
                    modalCreateProductStore.updateSkusLotName(
                        value,
                        warehouseId
                    );
                }
            }, 0),
            [modalCreateProductStore]
        );
        const handleCheckVariant = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                const defaultVariant = initialOptionsVariant[0]?.value || "";
                const variants = [
                    { name: defaultVariant, values: [{ value: "" }] },
                ];
                form.setFieldsValue({
                    variants: variants,
                });
                modalCreateProductStore.setShowVariantForm(true);
            } else {
                modalCreateProductStore.setShowVariantForm(false);
                form.resetFields(["variants"]);
                modalCreateProductStore.clearSkusCustomData();
                modalCreateProductStore.clearVariantCombination();
            }
        };
        const updateFormVariantValue = useCallback(
            (skusData: IFormSkuCustomData[]) => {
                form.setFields([
                    {
                        name: "skus",
                        value: skusData,
                    },
                ]);
            },
            [form]
        );
        const columns: ColumnsType<{
            key: string;
            name: string;
        }> = [
            {
                dataIndex: "name",
                key: "name",
                render: (name: string) => {
                    const sku = modalCreateProductStore.skuCustomData.get(name);
                    return (
                        <div className="flex flex-col gap-2">
                            <span className="font-medium text-sm">{name}</span>
                            <span className="text-sm text-gray-500">
                                SKU: {sku?.masku || "N/A"}
                            </span>
                            <span className="text-sm text-gray-500">
                                Barcode: {sku?.barcode || "N/A"}
                            </span>
                        </div>
                    );
                },
            },
            {
                dataIndex: "price_sold",
                key: "price_sold",
                align: "right",
                render: (_, record: any) => {
                    const sku = modalCreateProductStore.skuCustomData.get(
                        record.name
                    );
                    const price_sold = sku?.price_sold || 0;
                    const totalWarehouse = sku?.detail_import?.length || 0;
                    const totalStockInWarehouse =
                        sku?.detail_import?.reduce(
                            (acc: number, item: any) =>
                                acc + item.quantity_import,
                            0
                        ) || 0;
                    return (
                        <div className="flex flex-col gap-2">
                            <span className="font-medium text-base">
                                {price_sold.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </span>
                            <span className="text-sm text-gray-500">
                                {totalStockInWarehouse} khả dụng /{" "}
                                {totalWarehouse} kho hàng
                            </span>
                        </div>
                    );
                },
            },
        ];
        const handleRowVariantClick = (record: {
            key: string;
            name: string;
        }) => {
            setIsOpenUpdateVariantModal(true);
            modalCreateProductStore.setSkusNameSelected(record.name);
        };

        const handleCloseUpdateVariantModal = () => {
            setIsOpenUpdateVariantModal(false);
            modalCreateProductStore.setSkusNameSelected(null);
        };
        const handleSaveUpdateVariantModal = () => {
            defaultForm.submit();
        };

        const handleSubformFinish = (values: any) => {
            const allValues = defaultForm.getFieldsValue(true);
            const validName = [...modalCreateProductStore.skuCustomData.keys()];
            const validKeyValues = Object.keys(allValues.skus).filter((name) =>
                validName.includes(name)
            );
            const validValues = (
                Object.entries(allValues.skus) as [
                    string,
                    Omit<IFormSkuCustomData, "name">,
                ][]
            )
                .filter(([name, value]) => validKeyValues.includes(name))
                .map(([name, value]) => {
                    return {
                        name,
                        ...value,
                    };
                });
            updateFormVariantValue(validValues);
            setIsOpenUpdateVariantModal(false);
        };

        const handleSubformFinishFailed = (errorInfo: any) => {
            const errorMessage =
                errorInfo &&
                typeof errorInfo === "object" &&
                "errorFields" in errorInfo &&
                Array.isArray(errorInfo.errorFields)
                    ? `Vui lòng nhập đầy đủ thông tin của biến thể ${modalCreateProductStore.skusNameSelected}`
                    : errorInfo instanceof Error
                      ? errorInfo.message
                      : `Có lỗi xảy ra trong quá trình cật nhật giá trị biến thể ${modalCreateProductStore.skusNameSelected}`;

            store.setStatusMessage(400, errorMessage, "", false);
        };

        const getDefaultNamePathVariantFormItem = (
            formItemName: string,
            isDetailImport: boolean = false
        ) => {
            const defaultName = [
                "skus",
                modalCreateProductStore.skusNameSelected,
                ...(isDetailImport ? ["detail_import"] : []),
                formItemName,
            ];
            return defaultName;
        };

        const handleUploadVariantImage = async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file = e.target.files?.[0];
            const { isValid, errorMessage } = CheckFileInput(file);
            if (!isValid) {
                store.setStatusMessage(400, errorMessage, "", false);
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result as string;
                modalCreateProductStore.updateSkusImage(imageUrl);
                defaultForm.setFields([
                    {
                        name: getDefaultNamePathVariantFormItem("image"),
                        value: imageUrl,
                        errors: [],
                    },
                ]);
                setInputFileKey(generateUUIDV4());
            };
            reader.onerror = () => {
                store.setStatusMessage(
                    400,
                    `Có lỗi xảy ra trong quá trình tải ảnh của biến thể ${modalCreateProductStore.skusNameSelected}`,
                    "",
                    false
                );
            };
            reader.readAsDataURL(file);
        };

        const getSkusImage = () => {
            const imageUrl = modalCreateProductStore.skuCustomData.get(
                modalCreateProductStore.skusNameSelected
            )?.image;
            return imageUrl || null;
        };

        return (
            <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                    Quản lý biến thể
                </h2>
                <div
                    className="flex justify-start items-center gap-2 w-full"
                    style={{
                        borderBottom: modalCreateProductStore.showSpecForm
                            ? "1px solid #d9d9d9"
                            : "none",
                        paddingBottom: modalCreateProductStore.showSpecForm
                            ? "1rem"
                            : "0",
                    }}
                >
                    <input
                        type="checkbox"
                        onChange={(e) => {
                            handleCheckVariant(e);
                        }}
                        id="variantCheck"
                        disabled={productId ? true : false}
                        checked={modalCreateProductStore.showVariantForm}
                    />
                    <label htmlFor="variantCheck" className="text-sm">
                        Chọn để nhập các biến thể của sản phẩm
                    </label>
                </div>
                {modalCreateProductStore.showVariantForm && (
                    <div className="flex flex-col gap-4">
                        <FormListSelectOrInput
                            isUpdate={productId ? true : false}
                            formListName="variants"
                            fieldValue="variants"
                            initialOptions={initialOptionsVariant}
                            formItemLabel="Thuộc tính của biến thể"
                            placeholderSelect="Chọn thuộc tính"
                            renderComponent={({ onClick }) =>
                                !productId && (
                                    <button
                                        onClick={onClick}
                                        className="w-full h-10 border-none outline-none cursor-pointer bg-transparent text-base pt-4"
                                        type="button"
                                    >
                                        <div
                                            className={
                                                "text-gray-700 text-base"
                                            }
                                        >
                                            <PlusOutlined className="mr-1" />
                                            <span>
                                                Thêm thuộc tính biến thể
                                            </span>
                                        </div>
                                    </button>
                                )
                            }
                            maxFormListInputValue={5}
                            form={form}
                            setFormValue={() => {
                                modalCreateProductStore.setFormVariantValue({
                                    variants: form.getFieldValue("variants"),
                                });
                            }}
                        />
                        {modalCreateProductStore.VariantCombination.length >
                            0 && (
                            <div className="flex flex-col gap-4">
                                <Table
                                    columns={columns}
                                    showHeader={false}
                                    dataSource={modalCreateProductStore.VariantCombination.map(
                                        (combo: IVariantCombination) => ({
                                            key: combo.name + generateUUIDV4(),
                                            name: combo.name,
                                        })
                                    )}
                                    pagination={false}
                                    onRow={(record) => ({
                                        onClick: () =>
                                            handleRowVariantClick(record),
                                    })}
                                />
                            </div>
                        )}
                    </div>
                )}

                <CustomizeModal
                    isOpen={isOpenUpdateVariantModal}
                    handleCloseModal={handleCloseUpdateVariantModal}
                    handleSaveModal={
                        productId ? undefined : handleSaveUpdateVariantModal
                    }
                    okText="Lưu"
                    cancelText="Hủy"
                    title={`Cật nhật biến thể ${modalCreateProductStore.skusNameSelected}`}
                    width={800}
                >
                    <Form
                        form={defaultForm}
                        layout="vertical"
                        className="mt-4"
                        autoComplete="off"
                        onFinish={handleSubformFinish}
                        onFinishFailed={handleSubformFinishFailed}
                    >
                        <Row gutter={24} align={"middle"}>
                            <Col flex={"50%"}>
                                <Form.Item
                                    label="Giá nhập"
                                    name={getDefaultNamePathVariantFormItem(
                                        "price_import"
                                    )}
                                    className="w-full"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Vui lòng nhập giá nhập`,
                                        },
                                    ]}
                                >
                                    <Input
                                        className="w-full h-10"
                                        autoComplete="off"
                                        placeholder="Nhập giá nhập"
                                        disabled={productId ? true : false}
                                        onChange={(e) => {
                                            const namePath =
                                                getDefaultNamePathVariantFormItem(
                                                    "price_import"
                                                );
                                            const value =
                                                e.target.value.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                );
                                            defaultForm.setFieldValue(
                                                namePath,
                                                value
                                            );
                                            handleUpdateVariantValue(
                                                "price_import",
                                                String(value || "0")
                                            );
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} align={"middle"}>
                            <Col flex={"50%"}>
                                <Form.Item
                                    label="Giá bán"
                                    name={getDefaultNamePathVariantFormItem(
                                        "price_sold"
                                    )}
                                    className="w-full"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Vui lòng nhập giá bán`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Nhập giá bán"
                                        className="w-full h-10"
                                        autoComplete="off"
                                        disabled={productId ? true : false}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                );
                                            defaultForm.setFieldValue(
                                                getDefaultNamePathVariantFormItem(
                                                    "price_sold"
                                                ),
                                                value
                                            );
                                            handleUpdateVariantValue(
                                                "price_sold",
                                                String(value || "0")
                                            );
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col flex={"50%"}>
                                <Form.Item
                                    label="Giá so sánh"
                                    name={getDefaultNamePathVariantFormItem(
                                        "price_compare"
                                    )}
                                    className="w-full"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Vui lòng nhập giá so sánh`,
                                        },
                                    ]}
                                >
                                    <Input
                                        className="w-full h-10"
                                        autoComplete="off"
                                        placeholder="Nhập giá so sánh"
                                        disabled={productId ? true : false}
                                        onChange={(e) => {
                                            const value =
                                                e.target.value.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                );
                                            defaultForm.setFieldValue(
                                                getDefaultNamePathVariantFormItem(
                                                    "price_compare"
                                                ),
                                                value
                                            );
                                            handleUpdateVariantValue(
                                                "price_compare",
                                                String(value || "0")
                                            );
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} align={"middle"}>
                            <Col flex={"50%"}>
                                <Form.Item
                                    label="SKU"
                                    name={getDefaultNamePathVariantFormItem(
                                        "masku"
                                    )}
                                    className="w-full"
                                    rules={[
                                        {
                                            required: productId ? false : true,
                                            message: `Vui lòng nhập SKU`,
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Nhập SKU"
                                        className="w-full h-10"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            handleUpdateVariantValue(
                                                "masku",
                                                String(e.target.value || "")
                                            );
                                        }}
                                        disabled={productId ? true : false}
                                    />
                                </Form.Item>
                            </Col>
                            <Col flex={"50%"}>
                                <Form.Item
                                    label="Barcode"
                                    name={getDefaultNamePathVariantFormItem(
                                        "barcode"
                                    )}
                                    className="w-full"
                                    rules={[
                                        {
                                            required: productId ? false : true,
                                            message: `Vui lòng nhập Barcode`,
                                        },
                                    ]}
                                >
                                    <Input
                                        className="w-full h-10"
                                        autoComplete="off"
                                        placeholder="Nhập barcode"
                                        onChange={(e) => {
                                            handleUpdateVariantValue(
                                                "barcode",
                                                String(e.target.value || "")
                                            );
                                        }}
                                        disabled={productId ? true : false}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} align={"middle"} justify={"end"}>
                            <Col flex={"100%"}>
                                <Form.Item
                                    label="Ảnh"
                                    name={getDefaultNamePathVariantFormItem(
                                        "image"
                                    )}
                                    className="w-full"
                                    rules={[
                                        {
                                            required: true,
                                            message: `Vui lòng nhập ảnh`,
                                        },
                                    ]}
                                >
                                    <div>
                                        {getSkusImage() ? (
                                            <div className="flex justify-center items-center relative">
                                                {getSkusImage() && (
                                                    <Image
                                                        src={getSkusImage()}
                                                        alt="Variant"
                                                        width={"100%"}
                                                        height={160}
                                                        style={{
                                                            objectFit: "cover",
                                                        }}
                                                        className="!rounded-md"
                                                        fallback="/images/default_product_image.jpg"
                                                    />
                                                )}
                                                {!productId && (
                                                    <label
                                                        className="absolute -top-10 right-0 w-8 h-8 flex justify-center items-center hover:bg-red-100 rounded-md cursor-pointer"
                                                        onClick={(e) => {
                                                            {
                                                                modalCreateProductStore.updateSkusImage(
                                                                    null
                                                                );
                                                                defaultForm.setFields(
                                                                    [
                                                                        {
                                                                            name: getDefaultNamePathVariantFormItem(
                                                                                "image"
                                                                            ),
                                                                            value: null,
                                                                            errors: [],
                                                                        },
                                                                    ]
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <DeleteOutlined className="text-red-600 cursor-pointer text-base" />
                                                    </label>
                                                )}
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="imageUpload"
                                                className="cursor-pointer h-40 rounded-md text-sm flex justify-center items-center"
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                }}
                                            >
                                                <span className="flex items-center justify-center">
                                                    <UploadOutlined className="mr-1" />
                                                    Tải ảnh lên
                                                </span>
                                            </label>
                                        )}
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            accept="image/*"
                                            key={inputFileKey}
                                            multiple={false}
                                            onChange={handleUploadVariantImage}
                                            className="!hidden"
                                            disabled={productId ? true : false}
                                        />
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>

                        <div className="mt-4">
                            {modalCreateProductStore.warehouse_selected.length >
                                0 && (
                                <>
                                    <div
                                        style={{
                                            borderBottom: "1px solid #d9d9d9",
                                            paddingBottom: "1rem",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        <Row gutter={24} align={"top"}>
                                            <Col flex={"50%"}>
                                                <span>Kho hàng</span>
                                            </Col>
                                            <Col flex={"50%"}>
                                                <span>Tồn đầu kì</span>
                                            </Col>
                                        </Row>
                                    </div>

                                    {modalCreateProductStore.warehouse_selected && (
                                        <Form.List
                                            name={[
                                                "skus",
                                                modalCreateProductStore.skusNameSelected,
                                                "detail_import",
                                            ]}
                                        >
                                            {(fields) => (
                                                <>
                                                    {fields.map(
                                                        (
                                                            // item: SelectType,
                                                            // index: number
                                                            rowField
                                                        ) => (
                                                            <Row
                                                                gutter={24}
                                                                key={
                                                                    rowField.key
                                                                }
                                                                align="top"
                                                            >
                                                                <Col
                                                                    flex={`50%`}
                                                                >
                                                                    <span>
                                                                        {
                                                                            modalCreateProductStore
                                                                                .warehouse_selected[
                                                                                rowField
                                                                                    .name
                                                                            ]
                                                                                ?.label
                                                                        }
                                                                    </span>
                                                                </Col>
                                                                <Col
                                                                    flex={`50%`}
                                                                >
                                                                    <Form.Item
                                                                        name={[
                                                                            rowField.name,
                                                                            "quantity_import",
                                                                        ]}
                                                                        rules={[
                                                                            {
                                                                                required:
                                                                                    true,
                                                                                message: `Vui lòng nhập số lượng kho biến thể`,
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Input
                                                                            placeholder="Nhập số lượng"
                                                                            className="w-full h-10"
                                                                            autoComplete="off"
                                                                            disabled={
                                                                                productId
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                const value =
                                                                                    e.target.value.replace(
                                                                                        /[^0-9]/g,
                                                                                        ""
                                                                                    );
                                                                                defaultForm.setFields(
                                                                                    [
                                                                                        {
                                                                                            name: [
                                                                                                "skus",
                                                                                                modalCreateProductStore.skusNameSelected,
                                                                                                "detail_import",
                                                                                                rowField.name,
                                                                                                "warehouse_id",
                                                                                            ],
                                                                                            value: modalCreateProductStore
                                                                                                .warehouse_selected[
                                                                                                rowField
                                                                                                    .name
                                                                                            ]
                                                                                                ?.value,
                                                                                        },
                                                                                        {
                                                                                            name: [
                                                                                                "skus",
                                                                                                modalCreateProductStore.skusNameSelected,
                                                                                                "detail_import",
                                                                                                rowField.name,
                                                                                                "quantity_import",
                                                                                            ],
                                                                                            value: value,
                                                                                        },
                                                                                    ]
                                                                                );
                                                                                handleUpdateVariantValue(
                                                                                    "quantity_import",
                                                                                    String(
                                                                                        e
                                                                                            .target
                                                                                            .value ??
                                                                                            ""
                                                                                    ),
                                                                                    modalCreateProductStore
                                                                                        .warehouse_selected[
                                                                                        rowField
                                                                                            .name
                                                                                    ]
                                                                                        ?.value
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col
                                                                    flex={`50%`}
                                                                    push={12}
                                                                    className="flex justify-end"
                                                                >
                                                                    <Form.Item
                                                                        label="Tên lô"
                                                                        name={[
                                                                            rowField.name,
                                                                            "lot_name",
                                                                        ]}
                                                                        className="w-full"
                                                                    >
                                                                        <Input
                                                                            className="w-full h-10"
                                                                            autoComplete="off"
                                                                            placeholder="Nhập tên lô"
                                                                            disabled={
                                                                                productId
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                defaultForm.setFields(
                                                                                    [
                                                                                        {
                                                                                            name: [
                                                                                                "skus",
                                                                                                modalCreateProductStore.skusNameSelected,
                                                                                                "detail_import",
                                                                                                rowField.name,
                                                                                                "lot_name",
                                                                                            ],
                                                                                            value: e
                                                                                                .target
                                                                                                .value,
                                                                                        },
                                                                                    ]
                                                                                );
                                                                                handleUpdateVariantValue(
                                                                                    "lot_name",
                                                                                    String(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    ),
                                                                                    modalCreateProductStore
                                                                                        .warehouse_selected[
                                                                                        rowField
                                                                                            .name
                                                                                    ]
                                                                                        ?.value
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </Form.List>
                                    )}
                                </>
                            )}
                        </div>
                    </Form>
                </CustomizeModal>
            </div>
        );
    }
);

export default VariantInformation;
