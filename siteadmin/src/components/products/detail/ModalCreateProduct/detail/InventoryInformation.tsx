import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { SelectType } from "../ModalCreateProduct.type";
import { modalCreateProductStore } from "../ModalCreateProduct.store";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import { debounceHandleUpdateProductValue } from "../ModalCreateProduct";
interface IInventoryInformation {
    form: FormInstance;
    initialOptionsInventory: SelectType[];
    productId: string;
}
const InventoryInformation = observer(
    ({ form, initialOptionsInventory, productId }: IInventoryInformation) => {
        const [availableInventoryOptions, setAvailableInventoryOptions] =
            useState<SelectType[]>([]);

        useEffect(() => {
            if (initialOptionsInventory?.length > 0) {
                setAvailableInventoryOptions(initialOptionsInventory);
                modalCreateProductStore.setWarehouseOptions(
                    initialOptionsInventory
                );
            }
        }, [form, initialOptionsInventory]);
        const handleWarehouseSelect = useCallback(
            (value: any, option: SelectType | SelectType[]) => {
                const newValue = Array.isArray(option) ? option : [option];
                modalCreateProductStore.setWarehouseSelected(newValue);
            },
            [form]
        );

        const handleDeSelectWarehouse = useCallback(
            (value: string) => {
                const currentWarehouses =
                    form.getFieldValue(["detail_import", "warehouse_id"]) || [];
                if (
                    !currentWarehouses ||
                    !Array.isArray(currentWarehouses) ||
                    !value
                )
                    return;
                const newWarehouses = currentWarehouses.filter(
                    (item: any) => item.warehouse_id !== value
                );
                form.setFieldsValue({
                    detail_import: {
                        warehouse_id: newWarehouses,
                    },
                });

                form.setFieldsValue({
                    detail_import: {
                        [value]: {
                            quantity_import: undefined,
                        },
                    },
                });

                modalCreateProductStore.clearWarehouseSelectedAndQuantity(
                    value
                );
            },
            [form]
        );

        const handleClearWarehouse = useCallback(() => {
            form.resetFields(["detail_import", "warehouse_id"]);
            modalCreateProductStore.clearWarehouseSelectedAndQuantity();
        }, [form]);
        useEffect(() => {
            const newOptions = modalCreateProductStore.WarehouseOptions;
            setAvailableInventoryOptions((prevOptions) =>
                JSON.stringify(prevOptions) !== JSON.stringify(newOptions)
                    ? newOptions
                    : prevOptions
            );
        }, [modalCreateProductStore.warehouse_selected]);
        return (
            <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                    Quản lý tồn kho
                </h2>
                <Row gutter={24} align={"middle"}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            label="Giá vốn"
                            name={"price_import"}
                            tooltip={{
                                title: "Giá vốn - Giá nhập vào của sản phẩm",
                            }}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!modalCreateProductStore.hasSkus) {
                                            const convertNumber = Number(value);
                                            if (
                                                isNaN(convertNumber) ||
                                                convertNumber < 0
                                            ) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng nhập giá nhập hợp lệ"
                                                    )
                                                );
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập giá vốn"
                                className="w-full h-10"
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    );
                                    form.setFieldValue("price_import", value);
                                    debounceHandleUpdateProductValue(
                                        "price_import",
                                        value
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <div className="flex gap-6 justify-start items-center w-full">
                            <div className="flex flex-col gap-2">
                                <span>Biên lợi nhuận</span>
                                <span className="text-[#808080] text-base">
                                    {modalCreateProductStore.ProfitPercent.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span>Lợi nhuận</span>
                                <span className="text-[#808080] text-base">
                                    {modalCreateProductStore.Profit.toLocaleString(
                                        "vi-VN",
                                        {
                                            style: "currency",
                                            currency: "VND",
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            label="SKU"
                            name={"masku"}
                            tooltip={
                                "SKU - Mã sản phẩm cho mỗi sản phẩm nên là duy nhất, và bao gồm cả chữ và số"
                            }
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (
                                            !modalCreateProductStore.hasSkus &&
                                            !productId
                                        ) {
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng nhập mã sku"
                                                    )
                                                );
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập mã sku"
                                className="w-full h-10"
                                autoComplete="off"
                                onChange={(e) => {
                                    debounceHandleUpdateProductValue(
                                        "masku",
                                        e.target.value
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            label="Barcode"
                            name={"barcode"}
                            tooltip="Barcode - Mã vạch thường được Nhà sản xuất tạo ra"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (
                                            !modalCreateProductStore.hasSkus &&
                                            !productId
                                        ) {
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng nhập mã barcode"
                                                    )
                                                );
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập mã barcode"
                                className="w-full h-10"
                                autoComplete="off"
                                onChange={(e) => {
                                    debounceHandleUpdateProductValue(
                                        "barcode",
                                        e.target.value
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col flex={"100%"}>
                        <Form.Item
                            label="Tồn kho khả dụng"
                            name={["detail_import", "warehouse_id"]}
                            className="w-full"
                            tooltip={
                                "Các kho hàng có sẵn và đang trong quá trình hoạt động"
                            }
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (
                                            !modalCreateProductStore.hasSkus &&
                                            !productId
                                        ) {
                                            if (!value || value.length === 0) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng chọn kho hàng"
                                                    )
                                                );
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Select
                                placeholder="Chọn kho lưu trữ hàng"
                                showSearch
                                mode="multiple"
                                allowClear
                                options={availableInventoryOptions || []}
                                optionLabelProp="label"
                                onChange={handleWarehouseSelect}
                                onClear={handleClearWarehouse}
                                onDeselect={handleDeSelectWarehouse}
                                disabled={
                                    modalCreateProductStore.hasSkus && productId
                                        ? true
                                        : false
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {modalCreateProductStore.warehouse_selected.length > 0 && (
                    <>
                        <div
                            style={{
                                borderBottom: "1px solid #d9d9d9",
                                paddingBottom: "1rem",
                            }}
                        >
                            <Row gutter={24} align={"top"}>
                                <Col sm={24} md={12} lg={12} xl={12}>
                                    <span>Kho hàng</span>
                                </Col>
                                <Col sm={24} md={12} lg={12} xl={12}>
                                    <span>Tồn đầu kì</span>
                                </Col>
                            </Row>
                        </div>

                        {modalCreateProductStore.warehouse_selected.map(
                            (item: SelectType, index) => {
                                return (
                                    <Row
                                        gutter={24}
                                        key={index}
                                        align={"middle"}
                                    >
                                        <Col sm={24} md={12} lg={12} xl={12}>
                                            <span>{item.label}</span>
                                        </Col>
                                        <Col sm={24} md={12} lg={12} xl={12}>
                                            <Form.Item
                                                name={[
                                                    "detail_import",
                                                    item.value,
                                                    "quantity_import",
                                                ]}
                                                rules={[
                                                    {
                                                        validator: (
                                                            _,
                                                            value
                                                        ) => {
                                                            if (
                                                                !modalCreateProductStore.hasSkus
                                                            ) {
                                                                if (!value) {
                                                                    return Promise.reject(
                                                                        new Error(
                                                                            `Vui lòng nhập số lượng hàng`
                                                                        )
                                                                    );
                                                                }
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    placeholder="Nhập số lượng"
                                                    className="w-full h-10"
                                                    autoComplete="off"
                                                    disabled={
                                                        modalCreateProductStore.hasSkus &&
                                                        productId
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value.replace(
                                                                /[^0-9]/g,
                                                                ""
                                                            );

                                                        form.setFields([
                                                            {
                                                                name: [
                                                                    "detail_import",
                                                                    item.value,
                                                                    "quantity_import",
                                                                ],
                                                                value,
                                                            },
                                                        ]);
                                                        debounceHandleUpdateProductValue(
                                                            "quantity_import",
                                                            value,
                                                            item.value
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                );
                            }
                        )}
                    </>
                )}
            </div>
        );
    }
);

export default InventoryInformation;
