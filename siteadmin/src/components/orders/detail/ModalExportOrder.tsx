import { Table, Image, Select, Input, Button, Tooltip, Form } from "antd";
import CustomizeModal from "../../common/CustomizeModal";
import PropTypes from "prop-types";
import { AntdTableLocale } from "../../../constants";
import { formatVNDMoney } from "../../../utils";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useStore } from "src/stores";
import { CreateDetailExport } from "src/api/order.api";
import ModalConfirmReason from "./ModalConfirmReason";
import { toJS } from "mobx";
import { DetailImportResponseType } from "src/stores/imports.store";
import { OrderDetailResponseType } from "src/stores/order.store";
import { SkusDetailImportResponseType } from "src/stores/skus";

interface ModalExportOrderProps {
    orderDetail: OrderDetailResponseType;
    isOpen: boolean;
    handleClose: () => void;
    handleSave: (
        orderExport: CreateDetailExport[],
        note: string
    ) => Promise<boolean>;
    map_skus_detail_import: Map<string, SkusDetailImportResponseType>;
}

export interface lotOptionType {
    value: string;
    label: string;
}

export interface LotType {
    id: string;
    order_id?: string;
    detail_import_id: string;
    quantity_export: number;
    warehouse_id: string;
}

const getColumnsConfig = () => {
    return [
        {
            title: "Mã skus",
            dataIndex: ["skus", "id"],
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
                                <div className="w-full max-w-full">{value}</div>
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
            dataIndex: ["skus"],
            key: "order_details",
            render: (order_details) => {
                return (
                    <div className="flex items-center gap-2">
                        <Image
                            src={order_details?.image}
                            alt={
                                order_details?.name ? order_details.name : "N/A"
                            }
                            fallback="/images/default_product_image.png"
                            width={48}
                            height={48}
                            preview={false}
                            className="min-w-12 min-h-12 rounded-md cursor-pointer"
                        />
                        <div className="flex flex-col items-start gap-2 justify-start overflow-hidden">
                            <span className="text-sm font-semibold">
                                {order_details?.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {order_details?.masku}
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
            dataIndex: ["skus", "price_sold"],
            key: "price_sold",
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

const getExpandedRowConfig = (
    removeDetailImport: (lot_Id: string) => void,
    updateDetailImportData: (
        skus_id: string,
        lot_Id: string,
        newLotData: {
            detail_import_id?: string;
            quantity_export?: number;
            warehouse_id?: string;
        }
    ) => void,
    lotNameData: lotOptionType[],
    skus_id: string,
    getQuantityRemainingByDetailImportID: (
        skus_id: string,
        detail_import_id?: string
    ) => number,
    getWareHouseIdByDetailImportID: (
        skus_id: string,
        detail_import_id: string
    ) => string
) => {
    return [
        {
            title: "Lô hàng",
            render: (_, record: LotType) => {
                const lotNameMap = Object.fromEntries(
                    lotNameData.map((item) => [item.value, item.label])
                );
                return (
                    <div className="w-full overflow-hidden max-w-40">
                        <Tooltip
                            placement="topLeft"
                            title={lotNameMap[record.detail_import_id] || ""}
                            color="#000"
                            trigger={["hover"]}
                        >
                            <Select
                                allowClear
                                showSearch
                                options={lotNameData}
                                className="w-full"
                                placeholder="Chọn lô hàng"
                                onChange={(_, option) => {
                                    const newLot = !option
                                        ? undefined
                                        : !Array.isArray(option)
                                          ? option.value
                                          : undefined;
                                    updateDetailImportData(skus_id, record.id, {
                                        detail_import_id: newLot,
                                        warehouse_id:
                                            getWareHouseIdByDetailImportID(
                                                skus_id,
                                                newLot
                                            ),
                                    });
                                }}
                            />
                        </Tooltip>
                    </div>
                );
            },
            width: "25%",
        },
        {
            title: "Tồn kho",
            render: (_, record) => {
                const quantityRemaining = getQuantityRemainingByDetailImportID(
                    skus_id,
                    record.detail_import_id
                );
                return (
                    <span className="text-sm font-medium">
                        {quantityRemaining}
                    </span>
                );
            },
            width: "25%",
        },
        {
            title: "Số lượng xuất kho",
            render: (_, record) => {
                return (
                    <Input
                        type="number"
                        min={0}
                        placeholder="Nhập số lượng xuất kho"
                        value={record?.quantity_export || 0}
                        onChange={(e) => {
                            updateDetailImportData(skus_id, record.id, {
                                quantity_export: parseInt(e.target.value) || 0,
                            });
                        }}
                    />
                );
            },
            width: "25%",
        },

        {
            title: "Thao tác",
            render: (_, record) => {
                return (
                    <DeleteOutlined
                        style={{ fontSize: 16, color: "red" }}
                        onClick={() => removeDetailImport(record.id)}
                    />
                );
            },
            width: "25%",
        },
    ];
};

const ModalExportOrder: React.FC<ModalExportOrderProps> = ({
    orderDetail,
    isOpen,
    handleClose,
    handleSave,
    map_skus_detail_import,
}) => {
    // Tạo bảng chi tiết thông tin xuất hàng theo mã skus_id
    const [detailImportTableData, setDetailImportTableData] = useState<{
        [skus_id: string]: LotType[];
    }>({});

    const store = useStore();

    // Dữ liệu bảng sản phẩm trong đơn hàng
    const orderProductTableData = orderDetail?.order_details?.map(
        (item, index: number) => {
            return {
                ...item,
                STT: index + 1,
                key: item.id,
            };
        }
    );
    // Lấy tên lô từ map_skus_detail_import theo skus_id
    const getLotNameBySkusId = (id: string): lotOptionType[] => {
        const lot = map_skus_detail_import.get(id);
        if (!lot) return [];
        const detail_import: DetailImportResponseType[] = lot?.detail_import;
        const result = detail_import?.map((item) => ({
            value: item.id,
            label: item.lot_name,
        }));
        return result;
    };

    // Lấy mã kho hàng từ map_skus_detail_import theo skus_id
    const getWareHoseIdBySkusId = (id: string): string => {
        const lot = map_skus_detail_import.get(id);
        if (!lot) return "";
        return lot?.detail_import[0]?.warehouse?.id;
    };

    const getWareHouseIdByDetailImportID = (
        skus_id: string,
        detail_import_id: string
    ): string => {
        const lot = map_skus_detail_import.get(skus_id);
        if (!lot) return "";
        const detail_import = lot.detail_import.find(
            (lot) => lot.id === detail_import_id
        )?.warehouse?.id;
        if (!detail_import) return "";
        return detail_import;
    };

    const getQuantityRemainingByDetailImportID = (
        skus_id: string,
        detail_import_id: string
    ): number => {
        try {
            const lot = map_skus_detail_import.get(skus_id);
            if (!lot) return 0;
            const detail_import = lot?.detail_import.find(
                (item) => item.id === detail_import_id
            );
            if (!detail_import) return 0;
            const quantity_remaining = detail_import?.quantity_remaining;
            return quantity_remaining;
        } catch (e) {
            console.error(e);
            return 0;
        }
    };

    // Thêm mới chi tiết thông tin xuất hàng
    const addNewDetailImport = (skus_id: string) => {
        const newLot: LotType = {
            id: `${skus_id}-${Date.now()}`,
            warehouse_id: "",
            detail_import_id: "",
            quantity_export: 0,
        };
        setDetailImportTableData((prev) => ({
            ...prev,
            [skus_id]: [...(prev[skus_id] || []), newLot],
        }));
    };

    // Cập nhật chi tiết thông tin xuất hàng
    const updateDetailImportData = (
        skus_id: string,
        lotId: string,
        newLotData: {
            detail_import_id?: string;
            quantity_export?: number;
            warehouse_id?: string;
        }
    ) => {
        const newDetailImportTableData = detailImportTableData[skus_id]?.map(
            (detail_import) => {
                if (detail_import.id === lotId) {
                    return {
                        ...detail_import,
                        ...newLotData,
                    };
                }
                return detail_import;
            }
        );
        if (!newDetailImportTableData) return;
        setDetailImportTableData({
            ...detailImportTableData,
            [skus_id]: newDetailImportTableData,
        });
    };

    // Xóa chi tiết thông tin xuất hàng
    const removeDetailImport = (skus_id: string, lotId: string) => {
        const newDetailImportTableData = detailImportTableData[skus_id]?.filter(
            (detail_import) => detail_import.id !== lotId
        );
        if (!newDetailImportTableData) return;
        setDetailImportTableData({
            ...detailImportTableData,
            [skus_id]: newDetailImportTableData,
        });
    };

    // Bảng mở rộng hiện thông tin chi tiết xuất hàng
    const expandedRowRender = (record) => {
        const skus_id: string = record.skus.id;
        const lotNameData: lotOptionType[] = getLotNameBySkusId(skus_id);
        const expandTableData = detailImportTableData[skus_id] || [];
        return (
            <div>
                <Table
                    columns={getExpandedRowConfig(
                        (lotId: string) => removeDetailImport(skus_id, lotId),
                        updateDetailImportData,
                        lotNameData,
                        skus_id,
                        getQuantityRemainingByDetailImportID,
                        getWareHouseIdByDetailImportID
                    )}
                    dataSource={expandTableData}
                    pagination={false}
                    rowKey="id"
                    locale={{ ...AntdTableLocale }}
                    className="relative"
                />
                <Button
                    onClick={() => addNewDetailImport(skus_id)}
                    className="rounded-[50%] w-6 h-6 flex items-center justify-center absolute top-full left-0 -translate-x-1/2 -translate-y-full !hover:bg-opacity-80 transition-all duration-200"
                    color="default"
                    variant="filled"
                >
                    <PlusOutlined />
                </Button>
            </div>
        );
    };

    const validateDetailImportTableData = () => {
        try {
            const isEmpty = Object.keys(detailImportTableData).length === 0;
            if (isEmpty) {
                store.setStatusMessage(
                    400,
                    "Vui lòng nhập thông tin xuất hàng",
                    ""
                );
                return false;
            }
            const isMissingSkus = Object.keys(orderProductTableData)
                .map((item) => orderProductTableData[item].skus.id)
                .filter(
                    (id) =>
                        !detailImportTableData[id] ||
                        !detailImportTableData[id].length
                );

            if (isMissingSkus.length > 0) {
                store.setStatusMessage(
                    400,
                    `Vui lòng nhập thông tin xuất hàng cho mã đơn hàng có skus: \n ${isMissingSkus.join(
                        ", "
                    )}`,
                    ""
                );
                return false;
            }

            const hasDuplicateLot = Object.values(detailImportTableData).some(
                (items) => {
                    const lotIds = items.map((item) => item.detail_import_id);
                    return new Set(lotIds).size !== lotIds.length;
                }
            );

            if (hasDuplicateLot) {
                store.setStatusMessage(400, "Có lô hàng bị trùng", "");
                return false;
            }

            const isValidStockNumber = Object.values(
                detailImportTableData
            ).every((item) =>
                item.every((detail_import) => detail_import.quantity_export > 0)
            );

            if (!isValidStockNumber) {
                store.setStatusMessage(
                    400,
                    "Tồn tại số lượng xuất hàng không hợp lệ hoặc chưa nhập",
                    ""
                );
                return false;
            }
            const isValidLotName = Object.values(detailImportTableData).every(
                (item) =>
                    item.every(
                        (detail_import) =>
                            detail_import.detail_import_id !== "" &&
                            detail_import.detail_import_id !== undefined &&
                            detail_import.detail_import_id !== null
                    )
            );

            if (!isValidLotName) {
                store.setStatusMessage(400, "Vui lòng chọn lô hàng", "");
                return false;
            }

            return true;
        } catch (e: any) {
            console.error(e);
            store.setStatusMessage(400, "Có lỗi xảy ra", "");
            return false;
        }
    };

    const handleSaveModalExport = () => {
        const isValid = validateDetailImportTableData();
        if (!isValid) return;
        const dataExport = Object.entries(detailImportTableData).map(
            ([skus_id, detail_imports]) => {
                return detail_imports.map((detail_import) => {
                    const { id, ...rest } = detail_import;
                    return {
                        ...rest,
                        skus_id: skus_id,
                    } as CreateDetailExport;
                });
            }
        );
        const mergeArrays = dataExport.reduce((acc, curr) => {
            return acc.concat(curr);
        }, []);
        setOpenNoteModal(true);
        setTempData(mergeArrays);
    };

    const handleCancelModalExport = () => {
        setDetailImportTableData({});
        handleClose();
    };
    // State để lưu dữ liệu tạm thời
    const [tempData, setTempData] = useState<any[]>([]);
    const [note, setNote] = useState<string>("");
    const [openNoteModal, setOpenNoteModal] = useState<boolean>(false);
    const [noteForm] = Form.useForm();
    const handleSaveNote = async () => {
        if (!note || note.trim() === "") {
            store.setStatusMessage(400, "Vui lòng nhập ghi chú", "");
            return;
        }
        const result = await handleSave(tempData, note);
        if (result) {
            handleCancelNote();
            handleCancelModalExport();
        }
    };
    const handleCancelNote = () => {
        setOpenNoteModal(false);
        setNote("");
        setTempData([]);
    };
    const handleOnChangeNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setNote(value);
    };
    return (
        <>
            <CustomizeModal
                isOpen={isOpen}
                handleCloseModal={handleCancelModalExport}
                handleSaveModal={handleSaveModalExport}
                okText={`Xuất đơn hàng`}
                cancelText="Hủy"
                title={`Xuất đơn hàng ${orderDetail?.id}`}
                centered
                width={800}
            >
                <Table
                    locale={{
                        ...AntdTableLocale,
                    }}
                    columns={getColumnsConfig()}
                    dataSource={orderProductTableData || []}
                    rowKey={"id"}
                    pagination={false}
                    style={{
                        border: "none",
                    }}
                    expandable={{
                        expandedRowRender: expandedRowRender,
                        expandRowByClick: true,
                        expandIcon: ({ expanded, onExpand, record }) => {
                            return null;
                        },
                        expandIconColumnIndex: -1,
                    }}
                    size="small"
                    className="py-2"
                />
            </CustomizeModal>
            <ModalConfirmReason
                isOpen={openNoteModal}
                handleCloseReasonModal={handleCancelNote}
                handleSaveReasonModal={handleSaveNote}
                form={noteForm}
                okText="Lưu"
                cancelText="Hủy"
                label_input="Ghi chú khi xác nhận đơn hàng"
                placeholder_input="Nhập ghi chú"
                onChange={handleOnChangeNote}
            />
        </>
    );
};

export default ModalExportOrder;
