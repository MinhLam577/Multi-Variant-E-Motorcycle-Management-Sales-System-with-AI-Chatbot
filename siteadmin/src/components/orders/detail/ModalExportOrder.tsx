import { Table, Image } from "antd";
import CustomizeModal from "../../common/CustomizeModal";
import { AntdTableLocale } from "../../../constants";
import { formatVNDMoney, getErrorMessage } from "../../../utils";
import React from "react";
import { useStore } from "src/stores";
import { OrderDetailResponseType } from "src/stores/order.store";

interface ModalExportOrderProps {
    orderDetail: OrderDetailResponseType;
    isOpen: boolean;
    handleClose: () => void;
    handleSave: () => Promise<boolean>;
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
            title: "Sản phẩm",
            dataIndex: ["skus"],
            key: "order_details",
            render: (order_details, record) => {
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
                                {record?.skus?.product?.title || "N/A"}
                            </span>
                            <span className="text-xs text-gray-500">
                                {record?.skus?.name || "N/A"}
                            </span>
                        </div>
                    </div>
                );
            },
            width: "20%",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            ellipsis: true,
            render: (value) => {
                return <span className="text-sm font-medium">{value}</span>;
            },
            width: "20%",
        },
        {
            title: "Tồn kho",
            dataIndex: ["skus", "total_remaining"],
            key: "total_remaining",
            ellipsis: true,
            render: (value, record) => {
                return <span className="text-sm font-medium">{value}</span>;
            },
            width: "20%",
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
            width: "20%",
        },
    ];
};

const ModalExportOrder: React.FC<ModalExportOrderProps> = ({
    orderDetail,
    isOpen,
    handleClose,
    handleSave,
}) => {
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

    const validateConfirmOrder = () => {
        try {
            orderProductTableData?.forEach((item) => {
                const quantityNeeded = item.quantity;
                const quantityRemaining = item.skus.total_remaining;
                if (quantityNeeded > quantityRemaining) {
                    throw new Error(
                        `Số lượng cần xuất kho (${quantityNeeded}) lớn hơn số lượng tồn kho (${quantityRemaining}) cho phiên bản ${item.skus.name} của ${item.skus.product.title}`
                    );
                }
            });
            return true;
        } catch (e: any) {
            console.error(e);
            store.setStatusMessage(400, "Có lỗi xảy ra", "");
            return false;
        }
    };

    const handleConfirmOrder = async () => {
        try {
            validateConfirmOrder();
            const res = handleSave();
            if (res) {
                handleCancelModalExport();
            }
        } catch (e) {
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra khi lưu thông tin xuất hàng"
            );
            store.setStatusMessage(400, errorMessage, "");
        }
    };

    const handleCancelModalExport = () => {
        handleClose();
    };
    return (
        <>
            <CustomizeModal
                isOpen={isOpen}
                handleCloseModal={handleCancelModalExport}
                handleSaveModal={handleConfirmOrder}
                okText={`Xác nhận`}
                cancelText="Hủy"
                title={`Xác nhận đơn hàng ${orderDetail?.id}`}
                centered
                width={1000}
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
                    size="small"
                    className="py-2"
                />
            </CustomizeModal>
        </>
    );
};

export default ModalExportOrder;
