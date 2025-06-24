import { Button, Form, Steps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import OrderPrint from "../../components/orders/detail/OrderPrint";
import OrderProductsTable from "../../components/orders/detail/OrderProductsTable";
import { EnumOrderStatusesValue, EnumOrderSteps } from "src/constants";
import { reaction, toJS } from "mobx";
import "./OrderDetail.css";
import {
    CheckOutlined,
    CloseOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import { CustomizeButton } from "../../components/common/CustomizeButton";
import { observer } from "mobx-react-lite";
import OrderDescription from "../../components/orders/detail/OrderDescription";
import CustomerDescription from "../../components/orders/detail/CustomerDescription";
import ModalConfirmReason from "src/components/orders/detail/ModalConfirmReason";
import ModalExportOrder from "src/components/orders/detail/ModalExportOrder";
import OrderObservable, {
    OrderDetailResponseType,
} from "../../stores/order.store";
import SkusObservable from "../../stores/skus.store";
import { CreateDetailExport, ExportOrder } from "src/api/order.api";
import { useStore } from "src/stores";
import Access from "src/access/access";
import { ALL_PERMISSIONS } from "src/constants/permissions";
import { getErrorMessage } from "src/utils";
export const OrderDetailMode = {
    View: 1,
    Edit: 2,
};

interface OrderDetailProps {
    orderDetail: OrderDetailResponseType;
    orderNo: string;
    order_store: OrderObservable;
    skus_store: SkusObservable;
    handleUpdateOrderStatus: (orderNo: string) => void;
    handleCancelOrderStatus: (orderNo: string, reason: string) => void;
    handleFailedDelivery: (orderNo: string, reason: string) => void;
    handleConfirmOrderStatus: (orderNo: string) => void;
    handleExportOrderStatus: (orderNo: string) => void;
    handleHandoverOrderStatus: (orderNo: string) => void;
    handleDeliverOrderStatus: (orderNo: string) => void;
    handleShipOrderStatus: (orderNo: string) => void;
    handleShipSuccessOrderStatus: (orderNo: string) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
    orderDetail,
    orderNo,
    order_store,
    skus_store,
    handleUpdateOrderStatus,
    handleCancelOrderStatus,
    handleFailedDelivery,
    handleConfirmOrderStatus,
    handleExportOrderStatus,
    handleHandoverOrderStatus,
    handleDeliverOrderStatus,
    handleShipOrderStatus,
    handleShipSuccessOrderStatus,
}) => {
    const elementPrintOrder = useRef<HTMLDivElement | null>(null);
    const store = useStore();
    //  In bill
    const onPrint = useReactToPrint({
        content: () => elementPrintOrder.current,
    });

    const orderProductTableData = orderDetail?.order_details?.map((item) => {
        return {
            ...item,
            key: item.id,
        };
    });

    const stepItems = Object.values(EnumOrderSteps).map((item) => ({
        title: item
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
    }));

    const Icon_dot = (icon, { index, status, title, description }) => {
        const isFinish = status === "finish";
        const isError = status === "error";
        const isProcess = status === "process";
        const isWait = status === "wait";

        return (
            <div className={`w-5 h-5 relative`}>
                {isFinish ? (
                    <>
                        {icon}
                        <CheckOutlined
                            className="absolute left-1 top-1"
                            style={{
                                fontSize: 12,
                                color: "white",
                            }}
                        />
                    </>
                ) : isError ? (
                    <>
                        {icon}
                        <CloseOutlined
                            className="absolute left-1 top-1"
                            style={{
                                fontSize: 12,
                                color: "white",
                            }}
                        />
                    </>
                ) : isProcess ? (
                    <LoadingOutlined
                        className="absolute left-1 top-1"
                        style={{
                            fontSize: 14,
                            color: "blue",
                        }}
                    />
                ) : isWait ? (
                    <>
                        {icon}
                        <span
                            className="absolute left-1 top-1"
                            style={{
                                fontSize: 12,
                                color: "white",
                            }}
                        ></span>
                    </>
                ) : null}
            </div>
        );
    };

    const [current_status, set_current_status] = useState<number>(
        EnumOrderStatusesValue[orderDetail?.order_status as string] || 0
    );
    const [isError, setIsError] = useState(false);
    const handleCurrentStatus = (
        status: EnumOrderStatusesValue,
        prev_status: EnumOrderStatusesValue
    ) => {
        try {
            let newStatus: EnumOrderStatusesValue;
            let isError = false;

            switch (status) {
                case EnumOrderStatusesValue.PENDING:
                case EnumOrderStatusesValue.CONFIRMED:
                case EnumOrderStatusesValue.EXPORTED:
                case EnumOrderStatusesValue.HAND_OVERED:
                case EnumOrderStatusesValue.DELIVERING:
                case EnumOrderStatusesValue.SHIPPING:
                    newStatus = status;
                    break;
                case EnumOrderStatusesValue.DELIVERED:
                    newStatus = EnumOrderStatusesValue.DELIVERED;
                    break;
                case EnumOrderStatusesValue.FAILED_DELIVERY:
                    newStatus =
                        prev_status === EnumOrderStatusesValue.DELIVERING
                            ? EnumOrderStatusesValue.DELIVERING
                            : EnumOrderStatusesValue.SHIPPING;
                    isError = true;
                    break;
                case EnumOrderStatusesValue.CANCELLED:
                    newStatus =
                        prev_status === EnumOrderStatusesValue.CONFIRMED
                            ? EnumOrderStatusesValue.CONFIRMED
                            : EnumOrderStatusesValue.PENDING;
                    isError = true;
                    break;
                default:
                    newStatus = EnumOrderStatusesValue.PENDING;
                    isError = true;
                    break;
            }
            set_current_status(newStatus);
            setIsError(isError);
        } catch (e: any) {
            console.error("Error handling current status:", e);
            set_current_status(EnumOrderStatusesValue.PENDING);
            setIsError(true);
            const errorMessage = getErrorMessage(
                e,
                "Lỗi khi cập nhật trạng thái đơn hàng"
            );
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    useEffect(() => {
        const reactionDisposer = reaction(
            () => order_store.data.order_detail,
            (order_detail, prev_order_detail) => {
                const current_status: string | undefined =
                    order_detail?.order_status;
                const prev_status: string | undefined =
                    prev_order_detail?.order_status;
                handleCurrentStatus(
                    EnumOrderStatusesValue[current_status],
                    EnumOrderStatusesValue[prev_status]
                );
            },
            {
                fireImmediately: true,
            }
        );
        return () => {
            reactionDisposer();
        };
    }, []);

    // Modal xác nhận lý do
    const [openReasonModal, setOpenReasonModal] = useState(false);
    const [typeOpenReasonModal, setTypeOpenReasonModal] = useState("cancel");
    const [confirmReasonForm] = Form.useForm();
    const handleSaveReasonModal = async () => {
        const values = confirmReasonForm.getFieldsValue(true);
        const reason = values.reason;
        if (typeOpenReasonModal === "cancel") {
            handleCancelOrderStatus(orderNo, reason);
        } else if (typeOpenReasonModal === "failed_delivery") {
            handleFailedDelivery(orderNo, reason);
        }
        setTypeOpenReasonModal("cancel");
        setOpenReasonModal(false);
        confirmReasonForm.resetFields();
    };
    const handleCloseReasonModal = () => {
        setOpenReasonModal(false);
        setTypeOpenReasonModal("cancel");
        confirmReasonForm.resetFields();
    };

    // Modal xuất đơn hàng
    const [open_modal_export_order, set_open_export_order] = useState(false);
    const handleSaveExportOrderModal = async (): Promise<boolean> => {
        try {
            handleConfirmOrderStatus(orderNo);
            // const data: ExportOrder = {
            //     order_id: orderDetail.id,
            //     detail_export: orderExport,
            //     note: note,
            // };
            // const res = await order_store.confirmOrder(data);
            // return !!res;
            // await order_store.confirmOrder()
            // return !!data;
            return true;
        } catch (e: any) {
            console.error("Error confirming and saving export order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Lỗi khi xác nhận và lưu xuất đơn hàng"
            );
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const handleCloseExportOrderModal = () => {
        set_open_export_order(false);
    };

    return (
        <div key={orderNo} className="p-4" id={"order_detail_container"}>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center sticky top-0 z-10 bg-white">
                    <h2 className="text-base font-semibold">
                        Thông tin đơn hàng
                    </h2>
                    <div className="flex gap-2">
                        <CustomizeButton>
                            <Access
                                permission={ALL_PERMISSIONS.ORDERS.PRINT_ORDER}
                                hideChildren
                            >
                                <Button onClick={onPrint}>In hóa đơn</Button>
                            </Access>
                        </CustomizeButton>
                    </div>
                </div>
                <Steps
                    current={current_status}
                    items={stepItems}
                    size="small"
                    status={isError ? "error" : "process"}
                    progressDot={(
                        iconDot,
                        { index, status, title, description }
                    ) =>
                        Icon_dot(iconDot, {
                            index,
                            status,
                            title,
                            description,
                        })
                    }
                />

                <OrderDescription orderDetail={orderDetail} />

                <OrderProductsTable data={orderProductTableData} />
                <div className="flex justify-between items-center">
                    <CustomizeButton>
                        {order_store.OrderDetailStatus ===
                            EnumOrderStatusesValue.PENDING && (
                            <Access
                                permission={ALL_PERMISSIONS.ORDERS.CONFIRM}
                                hideChildren
                            >
                                <Button
                                    onClick={() => {
                                        const orderDetailStatus:
                                            | string
                                            | undefined =
                                            order_store.data.order_detail
                                                ?.order_status;
                                        const status: number | undefined =
                                            EnumOrderStatusesValue[
                                                orderDetailStatus
                                            ];
                                        if (
                                            status ===
                                            EnumOrderStatusesValue.PENDING
                                        ) {
                                            set_open_export_order(true);
                                        } else {
                                            store.setStatusMessage(
                                                400,
                                                "Chỉ có thể xác nhận khi đơn hàng đang ở trạng thái chờ xử lí",
                                                ""
                                            );
                                        }
                                    }}
                                >
                                    Xác nhận đơn
                                </Button>
                            </Access>
                        )}
                        {/* {order_store.OrderDetailStatus ===
                            EnumOrderStatusesValue.CONFIRMED && (
                            <Access
                                permission={ALL_PERMISSIONS.ORDERS.EXPORTED}
                                hideChildren
                            >
                                <Button
                                    onClick={() => {
                                        handleExportOrderStatus(orderNo);
                                    }}
                                >
                                    Xuất hàng ra kho
                                </Button>
                            </Access>
                        )} */}
                        {order_store.OrderDetailStatus ===
                            EnumOrderStatusesValue.EXPORTED && (
                            <Access
                                permission={ALL_PERMISSIONS.ORDERS.HAND_OVER}
                                hideChildren
                            >
                                <Button
                                    onClick={() => {
                                        handleHandoverOrderStatus(orderNo);
                                    }}
                                >
                                    Bàn giao đơn vị vận chuyển
                                </Button>
                            </Access>
                        )}
                        {order_store.OrderDetailStatus ===
                            EnumOrderStatusesValue.HAND_OVERED && (
                            <Access
                                permission={ALL_PERMISSIONS.ORDERS.DELIVERING}
                                hideChildren
                            >
                                <Button
                                    onClick={() => {
                                        handleDeliverOrderStatus(orderNo);
                                    }}
                                >
                                    Đang vận chuyển
                                </Button>
                            </Access>
                        )}
                        {order_store.OrderDetailStatus ===
                            EnumOrderStatusesValue.DELIVERING && (
                            <Access
                                permission={ALL_PERMISSIONS.ORDERS.SHIPPING}
                                hideChildren
                            >
                                <Button
                                    onClick={() => {
                                        handleShipOrderStatus(orderNo);
                                    }}
                                >
                                    Đang giao hàng
                                </Button>
                            </Access>
                        )}
                        {order_store.OrderDetailStatus ===
                            EnumOrderStatusesValue.SHIPPING && (
                            <Access
                                permission={ALL_PERMISSIONS.ORDERS.DELIVERED}
                                hideChildren
                            >
                                <Button
                                    onClick={() => {
                                        handleShipSuccessOrderStatus(orderNo);
                                    }}
                                >
                                    Giao hàng thành công
                                </Button>
                            </Access>
                        )}
                        {(order_store.OrderDetailStatus ===
                            EnumOrderStatusesValue.DELIVERING ||
                            order_store.OrderDetailStatus ===
                                EnumOrderStatusesValue.SHIPPING) && (
                            <Access
                                permission={
                                    ALL_PERMISSIONS.ORDERS.FAIL_DELIVERY
                                }
                                hideChildren
                            >
                                <Button
                                    onClick={() => {
                                        setTypeOpenReasonModal(
                                            "failed_delivery"
                                        );
                                        setOpenReasonModal(true);
                                    }}
                                >
                                    Giao hàng thất bại
                                </Button>
                            </Access>
                        )}
                        {order_store.OrderDetailStatus ===
                            EnumOrderStatusesValue.PENDING ||
                        order_store.OrderDetailStatus ===
                            EnumOrderStatusesValue.CONFIRMED ? (
                            <Access
                                permission={ALL_PERMISSIONS.ORDERS.CANCEL}
                                hideChildren
                            >
                                <Button
                                    onClick={() => {
                                        setTypeOpenReasonModal("cancel");
                                        setOpenReasonModal(true);
                                    }}
                                >
                                    Hủy đơn
                                </Button>
                            </Access>
                        ) : undefined}
                    </CustomizeButton>
                </div>
                <ModalConfirmReason
                    isOpen={openReasonModal}
                    handleCloseReasonModal={handleCloseReasonModal}
                    handleSaveReasonModal={handleSaveReasonModal}
                    form={confirmReasonForm}
                    okText="Xác nhận"
                    cancelText="Hủy"
                    label_input={`Nhập lý do ${typeOpenReasonModal}`}
                    placeholder_input={`Nhập lý do`}
                />

                <ModalExportOrder
                    isOpen={open_modal_export_order}
                    handleClose={handleCloseExportOrderModal}
                    handleSave={handleSaveExportOrderModal}
                    orderDetail={orderDetail}
                />
                <CustomerDescription orderDetail={orderDetail} />
            </div>
            <div className="hidden">
                <OrderPrint ref={elementPrintOrder} data={order_store} />
            </div>
        </div>
    );
};

export default observer(OrderDetail);
