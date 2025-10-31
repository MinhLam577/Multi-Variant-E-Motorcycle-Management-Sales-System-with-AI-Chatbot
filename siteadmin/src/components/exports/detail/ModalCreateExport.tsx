import CustomizeModal from "src/components/common/CustomizeModal";
import ModalSelectOrder from "./ModalSelectOrder";
import { useEffect, useState } from "react";
import {
    Button,
    Col,
    Form,
    Image,
    Input,
    Row,
    Select,
    Table,
    Tooltip,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Add } from "iconsax-react";
import { AntdTableLocale } from "src/constants";
import { filterEmptyFields, formatVNDMoney } from "src/utils";
import { OrderDetailResponseType } from "src/types/order.type";
import { toJS } from "mobx";
import { useStore } from "src/stores";
import { lotOptionType } from "src/components/orders/detail/ModalExportOrder";
import { SkusDetailImportResponseType } from "src/types/skus.type";
import { FormInstance } from "antd/lib";
import { CreateExportDto } from "src/types/export.type";
import { CreateDetailExport } from "src/types/order.type";

interface ModalCreateExportProps {
    open: boolean;
    onClose: () => void;
    onSave: (createExportData: CreateExportDto) => Promise<void>;
}

export type CreateExportLotType = {
    detail_import_id: string;
    quantity_remaining: number;
    warehouse_id: string;
    quantity_export: number;
    skus_id: string;
    order_id: string;
};
export type DetailExportTableType = {
    [order_detail_id: string]: CreateExportLotType[];
};

export type CreateExportOrderTableType = {
    id: string;
    order_details: {
        id: string;
        skus_id: string;
        skus_name: string;
        product_name: string;
        skus_image: string;
        quantity: number;
        total_price: number;
        detail_imports: {
            id: string;
            lot_name: string;
            quantity_remaining: number;
            warehouse_id: string;
        }[];
    }[];
};

const ModalCreateExport: React.FC<ModalCreateExportProps> = ({
    open,
    onClose,
    onSave,
}) => {
    const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
    const [orders, setOrders] = useState<OrderDetailResponseType[]>([]);
    const store = useStore();
    const orderStore = store.orderObservable;
    const skus_store = store.skusObservable;
    const exportStore = store.exportObservable;
    const [openSelectOrderModal, setOpenSelectOrderModal] = useState(false);
    const [tableData, setTableData] = useState<CreateExportOrderTableType[]>(
        []
    );
    const [skusDetailImportData, setSkusDetailImportData] = useState<
        Map<string, SkusDetailImportResponseType>
    >(new Map());
    const handleSaveSelectOrder = (selectedRowKeys: string[]) => {
        setSelectedOrder((prev) => {
            const newSelectedOrder = Array.from(
                new Set([...prev, ...selectedRowKeys])
            );
            return newSelectedOrder;
        });
        setOpenSelectOrderModal(false);
    };
    const handleCloseSelectOrder = () => {
        setOpenSelectOrderModal(false);
    };
    useEffect(() => {
        const fetchAllOrderDetails = async () => {
            const orderDetails = await Promise.all(
                selectedOrder
                    .map(async (item) => {
                        try {
                            if (!item) return null;
                            if (orders.some((order) => order.id === item)) {
                                return orders.find(
                                    (order) => order.id === item
                                );
                            }
                            if (orderStore.data.order_detail?.id === item) {
                                return orderStore.data.order_detail;
                            }
                            await orderStore.getOrderDetail(item);
                            const orderDetailsData = toJS(
                                orderStore.data.order_detail
                            );
                            return orderDetailsData;
                        } catch (error) {
                            console.error(
                                "Error fetching order details:",
                                error
                            );
                            return null;
                        }
                    })
                    .filter(Boolean)
            );
            setOrders(orderDetails);
        };
        fetchAllOrderDetails();
    }, [selectedOrder]);

    const fetchDetailImportsBySkusIds = async (skus_ids: string[]) => {
        try {
            await skus_store.getDetailImportsByIds(skus_ids);
            const data = skus_store.data.detail_imports;
            if (data.length > 0) {
                setSkusDetailImportData((prev) => {
                    const newMap = new Map(prev);
                    data.forEach((item, index) => {
                        if (!newMap.has(skus_ids[index])) {
                            newMap.set(skus_ids[index], item);
                        }
                    });
                    return newMap;
                });
            }
        } catch (error) {
            console.error("Failed to fetch detail imports:", error);
        }
    };

    useEffect(() => {
        const skus_ids = orders.flatMap((order) =>
            order.order_details.map((item) => item.skus.id)
        );
        fetchDetailImportsBySkusIds(skus_ids);
        const tableData: CreateExportOrderTableType[] = orders.flatMap(
            (order) => {
                const orderDetails = order.order_details;
                const orderDetailsData: CreateExportOrderTableType["order_details"] =
                    orderDetails
                        .map((item) => {
                            const total_price =
                                Number(item.skus.price_sold) * item.quantity;
                            const detail_imports =
                                item.skus?.detail_import?.map((di) => ({
                                    id: di.id,
                                    lot_name: di.lot_name,
                                    quantity_remaining: di.quantity_remaining,
                                    warehouse_id: di.warehouse.id,
                                }));
                            if (!detail_imports) return null;
                            return {
                                id: item.id,
                                product_name: item.skus.product.title,
                                skus_id: item.skus.id,
                                skus_name: item.skus.name,
                                skus_image: item.skus.image,
                                quantity: item.quantity,
                                total_price: total_price,
                                detail_imports,
                            };
                        })
                        .filter(Boolean);
                return {
                    id: order.id,
                    order_details: orderDetailsData,
                };
            }
        );
        setTableData(tableData);
    }, [orders]);
    const [createExportForm] = Form.useForm();

    const getCreateExportColumnsConfig = () => {
        return [
            {
                title: "Mã skus",
                dataIndex: ["skus_id"],
                key: "id",
                render: (value: string) => {
                    return (
                        <Tooltip
                            placement="topLeft"
                            title={value}
                            color="#000"
                            trigger={["hover"]}
                            overlay={() => {
                                return (
                                    <div className="w-full max-w-full">
                                        {value}
                                    </div>
                                );
                            }}
                        >
                            <div className="w-full overflow-hidden max-w-full text-ellipsis">
                                <span className="text-sm font-medium whitespace-nowrap">
                                    {value}
                                </span>
                            </div>
                        </Tooltip>
                    );
                },
                width: "25%",
            },
            {
                title: "Sản phẩm",
                dataIndex: "skus_name",
                key: "skus_name",
                render: (
                    _,
                    record: CreateExportOrderTableType["order_details"][number]
                ) => {
                    return (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block">
                                <Image
                                    src={record?.skus_image}
                                    alt={
                                        record?.skus_name
                                            ? record.skus_name
                                            : "N/A"
                                    }
                                    fallback="/images/default_product_image.png"
                                    width={48}
                                    height={48}
                                    preview={false}
                                    className="min-w-12 min-h-12 rounded-md cursor-pointer "
                                />
                            </div>

                            <div className="flex flex-col gap-2 overflow-hidden">
                                <Tooltip
                                    placement="topLeft"
                                    title={
                                        <>
                                            <span className="font-semibold">
                                                {record?.product_name}
                                            </span>
                                            <br />
                                            {record?.skus_name}
                                        </>
                                    }
                                    color="#000"
                                    trigger={["hover"]}
                                    overlay={() => {
                                        return (
                                            <div className="w-full max-w-full">
                                                {record?.product_name} -{" "}
                                                {record?.skus_name}
                                            </div>
                                        );
                                    }}
                                >
                                    <span className="text-sm font-semibold truncate max-w-[200px]">
                                        {record?.product_name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {record?.skus_name}
                                    </span>
                                </Tooltip>
                            </div>
                        </div>
                    );
                },
                width: "25%",
            },
            {
                title: "Số lượng",
                dataIndex: "quantity",
                key: "quantity",
                ellipsis: true,
                render: (value) => {
                    return <span className="text-sm font-medium">{value}</span>;
                },
                width: "25%",
            },
            {
                title: "Giá",
                dataIndex: "total_price",
                key: "total_price",
                render: (value) => {
                    return (
                        <span className="text-sm font-medium">
                            {formatVNDMoney(value) + "đ"}
                        </span>
                    );
                },
                ellipsis: true,
                width: "25%",
            },
        ];
    };

    const getLotData = (skusDetailImportData: SkusDetailImportResponseType) => {
        const lotData: lotOptionType[] = [];
        if (
            !skusDetailImportData ||
            !skusDetailImportData?.detail_import?.length
        )
            return lotData;
        skusDetailImportData.detail_import.forEach((dt) => {
            const lotItem: lotOptionType = {
                label: dt.lot_name,
                value: dt.id,
            };
            lotData.push(lotItem);
        });
        return toJS(lotData);
    };

    const getLotRemainingQuantity = (
        skusDetailImportData: SkusDetailImportResponseType,
        detail_import_id: string
    ) => {
        if (!skusDetailImportData) return 0;
        if (!skusDetailImportData?.detail_import?.length) return 0;
        const detail_import = skusDetailImportData?.detail_import.find(
            (item) => item.id === detail_import_id
        );
        if (!detail_import) return 0;
        const quantity_remaining = detail_import?.quantity_remaining || 0;
        return quantity_remaining;
    };

    const getWarehouseID = (
        skusDetailImportData: SkusDetailImportResponseType,
        detail_import_id: string
    ) => {
        if (!skusDetailImportData) return "";
        if (!skusDetailImportData?.detail_import?.length) return "";
        const detail_import = skusDetailImportData?.detail_import.find(
            (item) => item.id === detail_import_id
        );
        if (!detail_import) return "";
        const warehouse_id = detail_import?.warehouse.id || "";
        return warehouse_id;
    };

    const [formData, setFormData] = useState<any>([]);

    const expandedRowRender = (
        record: CreateExportOrderTableType["order_details"][number],
        defaultForm: FormInstance,
        order_id: string
    ) => {
        const orderDetail_id = record.id;
        const skus_id = record.skus_id;
        const skusDetailImport = skusDetailImportData.get(skus_id);
        const lotData = getLotData(skusDetailImport);
        return (
            <Form.List name={["order_details", orderDetail_id]}>
                {(fields, { add, remove }) => {
                    return (
                        <div className="w-full flex flex-col gap-4">
                            <Row gutter={[0, 0]} className="w-full flex gap-1">
                                <Col span={6}>
                                    <span>Lô hàng</span>
                                </Col>
                                <Col span={6}>
                                    <span>Tồn kho</span>
                                </Col>
                                <Col span={6}>
                                    <span>Xuất kho</span>
                                </Col>
                                <Col span={5}>
                                    <span>Thao tác</span>
                                </Col>
                            </Row>
                            {fields.map(({ key, name, ...restField }) => {
                                const currentLot: {
                                    detail_import_id: string;
                                    quantity_remaining: number;
                                    quantity_export: number;
                                }[] = defaultForm.getFieldValue([
                                    "order_details",
                                    orderDetail_id,
                                ]);

                                const filterLot =
                                    currentLot
                                        .filter(
                                            (lot, idx) =>
                                                idx !== name &&
                                                lot?.detail_import_id
                                        )
                                        .map((lot) => lot.detail_import_id) ||
                                    [];
                                const availableLot = lotData.filter(
                                    (lot) => !filterLot.includes(lot.value)
                                );

                                return (
                                    <div
                                        key={key}
                                        className="flex w-full items-center relative"
                                    >
                                        <Row
                                            gutter={[16, 0]}
                                            className="w-full"
                                        >
                                            <Col
                                                xl={6}
                                                lg={6}
                                                md={6}
                                                sm={24}
                                                xs={24}
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[
                                                        name,
                                                        "detail_import_id",
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng chọn lô hàng",
                                                        },
                                                        {
                                                            validator: async (
                                                                _,
                                                                value
                                                            ) => {
                                                                if (!value) {
                                                                    return Promise.resolve();
                                                                }
                                                                const allDetailImportIds =
                                                                    currentLot
                                                                        ?.filter(
                                                                            (
                                                                                lot,
                                                                                idx
                                                                            ) =>
                                                                                idx !==
                                                                                name
                                                                        )
                                                                        .map(
                                                                            (
                                                                                lot
                                                                            ) =>
                                                                                lot?.detail_import_id
                                                                        )
                                                                        .filter(
                                                                            Boolean
                                                                        ) || [];
                                                                if (
                                                                    allDetailImportIds.includes(
                                                                        value
                                                                    )
                                                                ) {
                                                                    return Promise.reject(
                                                                        new Error(
                                                                            "Lô hàng đã được chọn"
                                                                        )
                                                                    );
                                                                }
                                                                return Promise.resolve();
                                                            },
                                                        },
                                                    ]}
                                                    className="w-full"
                                                >
                                                    <Select
                                                        showSearch
                                                        options={
                                                            availableLot || []
                                                        }
                                                        className="w-full"
                                                        optionFilterProp="label"
                                                        placeholder="Chọn lô hàng"
                                                        onChange={(value) => {
                                                            const remaining =
                                                                value
                                                                    ? getLotRemainingQuantity(
                                                                          skusDetailImport,
                                                                          value
                                                                      )
                                                                    : 0;
                                                            const warehouse_id =
                                                                getWarehouseID(
                                                                    skusDetailImport,
                                                                    value
                                                                );
                                                            defaultForm.setFieldValue(
                                                                [
                                                                    "order_details",
                                                                    orderDetail_id,
                                                                    name,
                                                                    "quantity_remaining",
                                                                ],
                                                                remaining
                                                            );
                                                            defaultForm.setFieldValue(
                                                                [
                                                                    "order_details",
                                                                    orderDetail_id,
                                                                    name,
                                                                    "warehouse_id",
                                                                ],
                                                                warehouse_id
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col
                                                xl={6}
                                                lg={6}
                                                md={6}
                                                sm={24}
                                                xs={24}
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[
                                                        name,
                                                        "quantity_remaining",
                                                    ]}
                                                    className="w-full"
                                                    initialValue={0}
                                                >
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        placeholder="Số lượng còn lại"
                                                        disabled
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col
                                                xl={6}
                                                lg={6}
                                                md={6}
                                                sm={24}
                                                xs={24}
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[
                                                        name,
                                                        "quantity_export",
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập số lượng xuất kho",
                                                        },
                                                        {
                                                            validator: async (
                                                                _,
                                                                value
                                                            ) => {
                                                                const quantity_remaining =
                                                                    defaultForm.getFieldValue(
                                                                        [
                                                                            "order_details",
                                                                            orderDetail_id,
                                                                            name,
                                                                            "quantity_remaining",
                                                                        ]
                                                                    );
                                                                if (
                                                                    value >
                                                                    quantity_remaining
                                                                ) {
                                                                    return Promise.reject(
                                                                        new Error(
                                                                            "Số lượng xuất kho không vượt quá số lượng tồn kho"
                                                                        )
                                                                    );
                                                                }
                                                                return Promise.resolve();
                                                            },
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        placeholder="Nhập số lượng xuất kho"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col
                                                xl={6}
                                                lg={6}
                                                md={6}
                                                sm={24}
                                                xs={24}
                                            >
                                                <Button
                                                    type="link"
                                                    onClick={() => remove(name)}
                                                >
                                                    <DeleteOutlined className="!text-base" />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                );
                            })}
                            <Button
                                type="dashed"
                                onClick={() => {
                                    add({
                                        detail_import_id: "",
                                        skus_id: record.skus_id,
                                        order_id: order_id,
                                    });
                                }}
                            >
                                Thêm lô hàng
                            </Button>
                        </div>
                    );
                }}
            </Form.List>
        );
    };

    const handleFormValuesChange = (changeValues, allValues) => {
        if (allValues?.order_details) {
            setFormData(allValues?.order_details);
        }
    };

    const handleSaveCreateExport = async () => {
        try {
            const values: {
                note: string | undefined;
                order_details: DetailExportTableType;
            } = await createExportForm.validateFields();
            const { note, order_details } = values;
            if (!order_details) {
                store.setStatusMessage(
                    500,
                    "Vui lòng chọn đơn hàng để xuất",
                    "",
                    false
                );
                return;
            }
            const detail_exports: CreateDetailExport[] = Object.entries(
                order_details
            ).flatMap(([order_detail_id, order_detail]) => {
                if (!order_detail) return [];
                const detail_export: CreateDetailExport[] =
                    order_detail
                        ?.map((lot) => {
                            if (!lot?.detail_import_id) return null;
                            const quantity_export =
                                Number(lot.quantity_export) || 0;
                            const quantity_remaining =
                                Number(lot.quantity_remaining) || 0;
                            if (quantity_export > quantity_remaining) {
                                throw new Error(
                                    `Số lượng xuất kho không hợp lệ trong đơn hàng ${lot.order_id}, vui lòng kiểm tra lại`
                                );
                            }
                            return {
                                detail_import_id: lot.detail_import_id,
                                quantity_export: quantity_export,
                                warehouse_id: lot.warehouse_id,
                                skus_id: lot.skus_id,
                                order_id: lot.order_id,
                            };
                        })
                        .filter(Boolean) || [];
                return detail_export;
            });
            const order_ids_save = detail_exports.map((item) => item.order_id);
            const missingOrderIds = selectedOrder.filter(
                (orderId) => !order_ids_save.includes(orderId)
            );
            if (missingOrderIds.length > 0) {
                store.setStatusMessage(
                    500,
                    `Vui lòng nhập đầy đủ thông tin cho các đơn hàng: ${missingOrderIds.join(
                        ", "
                    )}`,
                    "",
                    false
                );
                return;
            }
            tableData.forEach((item) => {
                const orderId = item.id;
                const exportData = detail_exports.filter(
                    (exportItem) => exportItem.order_id === orderId
                );
                item.order_details.forEach((orderDetail) => {
                    const quantityNeededPerSkus = orderDetail.quantity;
                    const skus_id = orderDetail.skus_id;
                    const quantityExportedOfSkus = exportData.filter(
                        (exportItem) => exportItem.skus_id === skus_id
                    );
                    const quantityExported =
                        quantityExportedOfSkus?.reduce(
                            (acc, cur) => acc + Number(cur.quantity_export),
                            0
                        ) || 0;
                    if (quantityNeededPerSkus !== quantityExported) {
                        throw new Error(
                            `Số lượng xuất kho không hợp lệ cho đơn hàng ${orderId}, vui lòng kiểm tra lại`
                        );
                    }
                });
            });
            const data: CreateExportDto = filterEmptyFields({
                note: note,
                detail_export: detail_exports,
            });
            const res = await exportStore.createExport(data);
            if (res) {
                exportStore.getListExport({
                    ...exportStore.pagination,
                });
                handleCloseCreateExport();
            }
        } catch (e) {
            console.error("Error saving create export:", e);
            const errorMessage =
                typeof e === "object" &&
                "errorFields" in e &&
                Array.isArray(e.errorFields)
                    ? "Vui lòng nhập đầy đủ thông tin còn thiếu"
                    : e instanceof Error
                      ? e.message
                      : "Lỗi trong quá trình lưu phiếu xuất, vui lòng thử lại sau";
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };

    const handleCloseCreateExport = () => {
        setTableData([]);
        setSelectedOrder([]);
        setSkusDetailImportData(new Map());
        createExportForm.resetFields();
        onClose();
    };

    const handleDeleteOrderSelected = (order_id: string) => {
        const newSelectedOrder = selectedOrder.filter(
            (item) => item !== order_id
        );
        setSelectedOrder(newSelectedOrder);
    };

    return (
        <CustomizeModal
            isOpen={open}
            handleCloseModal={handleCloseCreateExport}
            handleSaveModal={handleSaveCreateExport}
            cancelText="Hủy"
            title="Tạo phiếu xuất hàng"
            width={1400}
            okText="Lưu"
        >
            <Form
                form={createExportForm}
                layout="vertical"
                labelWrap
                className="w-full mt-2"
                preserve={false}
                onValuesChange={handleFormValuesChange}
            >
                <Row gutter={[16, 0]}>
                    <Col span={24}>
                        <Form.Item label="Ghi chú" name="note">
                            <Input.TextArea
                                placeholder="Nhập ghi chú"
                                autoSize={{ minRows: 6, maxRows: 6 }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between w-full">
                                <div>
                                    <span className="text-[red]">* </span>
                                    <span>Hóa đơn xuất</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="px-2 py-2 bg-[#F0483E] text-[#FFFFFF] text-xs flex font-bold items-center focus:outline-none focus:opacity-80 hover:opacity-80 rounded-full animate-bounce border-none cursor-pointer"
                                        onClick={() => {
                                            setOpenSelectOrderModal(true);
                                        }}
                                    >
                                        <Add size="20" />
                                    </button>
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-2 justify-center items-center">
                                {tableData.length > 0 &&
                                    tableData.map((tableDetail) => (
                                        <div
                                            key={tableDetail.id}
                                            className="w-full flex flex-col gap-2 justify-center items-center "
                                        >
                                            <div className="w-full flex items-center justify-center gap-4">
                                                <h2 className="text-base font-semibold text-center">
                                                    Mã đơn hàng:{" "}
                                                    {tableDetail.id}
                                                </h2>
                                                <button
                                                    type="button"
                                                    className="px-2 py-2 text-[#F0483E] text-xs flex font-bold items-center border-none cursor-pointer bg-transparent"
                                                    onClick={() =>
                                                        handleDeleteOrderSelected(
                                                            tableDetail.id
                                                        )
                                                    }
                                                >
                                                    <DeleteOutlined className="text-xl" />
                                                </button>
                                            </div>
                                            <Table
                                                locale={{
                                                    ...AntdTableLocale,
                                                }}
                                                columns={
                                                    getCreateExportColumnsConfig() ||
                                                    []
                                                }
                                                dataSource={
                                                    tableDetail.order_details
                                                }
                                                rowKey={(item) => item.id}
                                                pagination={false}
                                                style={{
                                                    border: "none",
                                                }}
                                                size="small"
                                                className="py-2"
                                                expandable={{
                                                    expandedRowRender: (
                                                        record
                                                    ) =>
                                                        expandedRowRender(
                                                            record,
                                                            createExportForm,
                                                            tableDetail.id
                                                        ),
                                                    expandRowByClick: true,
                                                    expandIcon: () => {
                                                        return null;
                                                    },
                                                    expandIconColumnIndex: -1,
                                                }}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>
            <ModalSelectOrder
                open={openSelectOrderModal}
                onClose={handleCloseSelectOrder}
                onSave={handleSaveSelectOrder}
                orderSelected={selectedOrder}
            />
        </CustomizeModal>
    );
};

export default ModalCreateExport;
