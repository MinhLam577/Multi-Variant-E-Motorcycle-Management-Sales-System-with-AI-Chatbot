import {
    Button,
    Col,
    Empty,
    Form,
    Image,
    Input,
    Row,
    Select,
    Table,
    Tooltip,
} from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import CustomizeModal from "src/components/common/CustomizeModal";
import { AntdTableLocale } from "src/constants";
import { formatVNDMoney } from "src/utils";
import { FormInstance } from "antd/lib";
import { DeleteOutlined } from "@ant-design/icons";
import { toJS } from "mobx";
import { lotOptionType } from "src/components/orders/detail/ModalExportOrder";
import { SkusDetailImportResponseType } from "src/stores/skus.store";
import {
    ExportResponseType,
    UpdateExportDetailDto,
    UpdateExportDto,
} from "src/stores/exports.store";
import { useStore } from "src/stores";
import { CreateDetailExport } from "src/api/order.api";

interface ModalUpdateExportProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    exportSelected?: ExportResponseType;
}

export type UpdateExportOrderTableType = {
    export_id: string;
    detail_exports: {
        id: string;
        skus_id: string;
        skus_name: string;
        skus_image: string;
        product_name: string;
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

export type UpdateExportFormValuesType = {
    note?: string | null;
    detail_exports: {
        [detail_export_id: string]: UpdateExportLotType[];
    };
};

export type UpdateExportLotType = {
    detail_import_id: string;
    quantity_remaining: number;
    warehouse_id: string;
    quantity_export: number;
    skus_id: string;
};
export type DetailExportTableType = {
    [detail_export_id: string]: UpdateExportLotType[];
};

const ModalUpdateExport: React.FC<ModalUpdateExportProps> = ({
    open,
    onClose,
    onSubmit,
    exportSelected,
}) => {
    const handleClose = () => {
        onClose();
    };

    const store = useStore();
    const skus_store = store.skusObservable;
    const exportStore = store.exportObservable;
    const [skusDetailImportData, setSkusDetailImportData] = useState<
        Map<string, SkusDetailImportResponseType>
    >(new Map());
    const [updateExportForm] = Form.useForm();
    const [formValues, setFormValues] = useState<any>({});

    const getUpdateExportColumnsConfig = () => {
        return [
            {
                title: "Mã skus",
                dataIndex: ["skus_id"],
                key: "id",
                render: (
                    value: string,
                    record: UpdateExportOrderTableType["detail_exports"][number]
                ) => {
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
                    record: UpdateExportOrderTableType["detail_exports"][number]
                ) => {
                    return (
                        <div className="flex items-center gap-2">
                            <Image
                                src={record?.skus_image}
                                alt={
                                    record?.skus_name ? record.skus_name : "N/A"
                                }
                                fallback="/images/default_product_image.png"
                                width={48}
                                height={48}
                                preview={false}
                                className="min-w-12 min-h-12 rounded-md cursor-pointer"
                            />
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold">
                                    {record?.product_name}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {record?.skus_name}
                                </span>
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

    const convertSelectedExportToUpdateExportOrderTableType = () => {
        if (!exportSelected) return null;
        const updateExportOrderTableType: UpdateExportOrderTableType = {
            export_id: exportSelected.id,
            detail_exports: exportSelected.detail_export.map((item) => {
                const total_price =
                    item.quantity_export * Number(item.skus.price_sold);
                const warehouse_id = item.wareHouse?.id || "";
                const detail_imports: {
                    id: string;
                    lot_name: string;
                    quantity_remaining: number;
                    warehouse_id: string;
                }[] = [
                    {
                        id: item.detail_import?.id,
                        lot_name: item.detail_import.lot_name,
                        quantity_remaining: item.quantity_export,
                        warehouse_id,
                    },
                ];
                return {
                    id: item.id,
                    skus_id: item.skus.id,
                    skus_name: item.skus.name,
                    skus_image: item.skus.image,
                    product_name: item.skus.product.title,
                    quantity: item.quantity_export,
                    total_price,
                    detail_imports,
                };
            }),
        };
        return updateExportOrderTableType;
    };

    const convertOrderTableTypeToFormValuesType = (
        tableData: UpdateExportOrderTableType
    ) => {
        const detail_exports: DetailExportTableType = {};
        tableData.detail_exports.forEach((item) => {
            const detail_imports = item.detail_imports.map((lot) => ({
                detail_import_id: lot.id,
                quantity_remaining: lot.quantity_remaining,
                warehouse_id: lot.warehouse_id,
                quantity_export: lot.quantity_remaining,
                skus_id: item.skus_id,
            }));
            detail_exports[item.id] = detail_imports;
        });
        return {
            note: exportSelected?.note,
            detail_exports,
        } as UpdateExportFormValuesType;
    };

    const [tableData, setTableData] = useState<UpdateExportOrderTableType>();
    const fetchDetailImportsBySkusIds = async (skus_ids: string[]) => {
        try {
            if (!skus_ids || skus_ids.length === 0) return [];
            await skus_store.getDetailImportsByIds(skus_ids);
            const data = toJS(skus_store.data.detail_imports);
            if (data.length > 0) {
                setSkusDetailImportData((prev) => {
                    const newMap = new Map(prev);
                    data.forEach((item) => {
                        if (!newMap.has(item.id)) {
                            newMap.set(item.id, item);
                        }
                    });
                    return newMap;
                });
            }
        } catch (error) {
            console.error("Failed to fetch detail imports:", error);
            store.setStatusMessage(
                500,
                "Lỗi trong quá trình lấy dữ liệu, vui long thử lại sau",
                "",
                false
            );
        }
    };
    useEffect(() => {
        if (!exportSelected) return;
        const skus_ids = exportSelected.detail_export?.map((de) => de.skus.id);
        if (!skus_ids || skus_ids.length === 0) return;
        fetchDetailImportsBySkusIds(skus_ids);
        const updateExportOrderTableType =
            convertSelectedExportToUpdateExportOrderTableType();
        const convertFormValues = convertOrderTableTypeToFormValuesType(
            updateExportOrderTableType
        );
        setTableData(updateExportOrderTableType);
        updateExportForm.setFieldsValue(convertFormValues);
    }, [exportSelected]);

    const expandedRowRender = (
        record: UpdateExportOrderTableType["detail_exports"][number],
        defaultForm: FormInstance
    ) => {
        const detailExportId = record.id;
        const skus_id = record.skus_id;
        const skusDetailImport = skusDetailImportData.get(skus_id);
        const lotData = getLotData(skusDetailImport);
        return (
            <Form.List name={["detail_exports", detailExportId]}>
                {(fields, { add, remove }) => {
                    return (
                        <div className="w-full flex flex-col gap-4">
                            <Row gutter={[0, 0]} className="w-full flex gap-1">
                                <Col span={6}>
                                    <span>Lô hàng</span>
                                </Col>
                                <Col span={6}>
                                    <span>Số lượng tồn kho</span>
                                </Col>
                                <Col span={6}>
                                    <span>Số lượng xuất kho</span>
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
                                    "detail_exports",
                                    detailExportId,
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
                                            <Col span={6}>
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
                                                            defaultForm.setFieldValue(
                                                                [
                                                                    "detail_exports",
                                                                    detailExportId,
                                                                    name,
                                                                    "quantity_remaining",
                                                                ],
                                                                remaining
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
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
                                            <Col span={6}>
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
                                                                            "detail_exports",
                                                                            detailExportId,
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
                                            <Col span={6}>
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
                                        detail_export_id: detailExportId,
                                        skus_id: skus_id,
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
    const handleFormValuesChange = (changedValues: any, allValues: any) => {
        setFormValues(allValues);
    };
    const handleCloseModal = () => {
        setSkusDetailImportData(new Map());
        setTableData(undefined);
        handleClose();
    };

    const handleSaveModal = async () => {
        try {
            const values: UpdateExportFormValuesType =
                await updateExportForm.validateFields();
            const { note, detail_exports } = values;
            if (!detail_exports)
                throw new Error("Vui lòng nhập đủ thông tin cập nhật");
            const createDetailExport: (UpdateExportDetailDto & {
                skus_id: string;
            })[] = Object.entries(detail_exports).flatMap(
                ([detail_export_id, detail_export_data]) => {
                    if (!detail_export_data) return [];
                    const detail_export: (UpdateExportDetailDto & {
                        skus_id: string;
                    })[] =
                        detail_export_data
                            ?.map((lot) => {
                                if (!lot?.detail_import_id) return null;
                                const quantity_export =
                                    Number(lot.quantity_export) || 0;
                                const quantity_remaining =
                                    Number(lot.quantity_remaining) || 0;
                                if (quantity_export > quantity_remaining) {
                                    throw new Error(
                                        `Số lượng xuất kho không hợp lệ, vui lòng kiểm tra lại`
                                    );
                                }
                                return {
                                    detail_export_id,
                                    detail_import_id: lot.detail_import_id,
                                    quantity_export,
                                    skus_id: lot.skus_id,
                                };
                            })
                            .filter(Boolean) || [];
                    return detail_export;
                }
            );

            tableData?.detail_exports?.forEach((item) => {
                const detail_export_id = item.id;
                const skusQuantityNeedExport = item.quantity;
                const skusQuantityExported =
                    createDetailExport
                        .filter(
                            (lot) => lot.detail_export_id === detail_export_id
                        )
                        .reduce((acc, lot) => {
                            return acc + Number(lot.quantity_export);
                        }, 0) || 0;
                if (skusQuantityExported !== skusQuantityNeedExport) {
                    throw new Error(
                        `Số lượng xuất kho không hợp lệ, vui lòng kiểm tra lại`
                    );
                }
            });
            const updateDetailExport: UpdateExportDetailDto[] =
                createDetailExport.map((item) => ({
                    detail_export_id: item.detail_export_id,
                    detail_import_id: item.detail_import_id,
                    quantity_export: item.quantity_export,
                }));
            const updateExport: UpdateExportDto = {
                note,
                export_details: updateDetailExport,
            };
            const response = await exportStore.updateExport(
                exportSelected?.id,
                updateExport
            );

            if (response) {
                store.setStatusMessage(
                    200,
                    "Cập nhật phiếu xuất kho thành công",
                    "",
                    true
                );
                onSubmit();
                handleCloseModal();
            }
        } catch (e) {
            console.error("Error in save update export modal:", e);
            const errorMessage =
                typeof e === "object" &&
                "errorFields" in e &&
                Array.isArray(e.errorFields)
                    ? "Vui lòng nhập đúng thông tin"
                    : e instanceof Error
                      ? e.message
                      : "Lỗi trong quá trình lưu phiếu xuất, vui lòng thử lại sau";
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };
    return (
        <CustomizeModal
            isOpen={open}
            handleCloseModal={handleCloseModal}
            handleSaveModal={handleSaveModal}
            title={`Cật nhật phiếu xuất kho ${exportSelected?.id}`}
            okText="Cập nhật"
            cancelText="Hủy bỏ"
            width={1000}
            forceRender
        >
            <Form
                form={updateExportForm}
                layout="vertical"
                labelWrap
                className="w-full mt-2"
                preserve={open}
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
                            <Table
                                key="export-table"
                                locale={{
                                    ...AntdTableLocale,
                                }}
                                columns={getUpdateExportColumnsConfig() || []}
                                dataSource={tableData?.detail_exports || []}
                                rowKey={(item) => item.id}
                                pagination={false}
                                style={{
                                    border: "none",
                                }}
                                size="small"
                                className="py-2"
                                expandable={{
                                    expandedRowRender: (record) =>
                                        expandedRowRender(
                                            record,
                                            updateExportForm
                                        ),
                                    expandRowByClick: true,
                                    expandIcon: () => {
                                        return null;
                                    },
                                    expandIconColumnIndex: -1,
                                    defaultExpandAllRows: true,
                                    expandedRowKeys:
                                        tableData?.detail_exports.map(
                                            (item) => item.id
                                        ),
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            </Form>
        </CustomizeModal>
    );
};

export default observer(ModalUpdateExport);
