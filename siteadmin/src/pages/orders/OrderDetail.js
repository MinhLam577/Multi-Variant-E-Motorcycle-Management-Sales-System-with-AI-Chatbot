import { Button, Form, Steps } from "antd";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import OrderPrint from "../../components/orders/detail/OrderPrint";
import OrderProductsTable from "../../components/orders/detail/OrderProductsTable";
import { EnumOrderStatusesValue } from "../../constants";
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
import ModalConfirmReason from "../../components/orders/detail/ModalConfirmReason";
import ModalExportOrder from "../../components/orders/detail/ModalExportOrder";
export const OrderDetailMode = {
    View: 1,
    Edit: 2,
};

const OrderDetail = ({
    orderDetail,
    orderNo,
    order_store,
    handleUpdateOrderStatus,
    handleCancelOrderStatus,
    handleFailedDelivery,
    handleReturnOrder,
    displayMessage,
}) => {
    const elementPrintOrder = useRef();

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

    const stepItems = [
        {
            title: "Đặt hàng",
        },
        {
            title: "Xác nhận",
        },
        {
            title: "Xuất kho",
        },
        {
            title: "Vận chuyển",
        },
        {
            title: "Đang giao",
        },
        {
            title: "Đã giao",
        },
    ];

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

    const [current_status, set_current_status] = useState(
        EnumOrderStatusesValue[orderDetail?.order_status] || 0
    );
    const [isError, setIsError] = useState(false);

    const handleCurrentStatus = (status, prev_status) => {
        switch (EnumOrderStatusesValue[status]) {
            case EnumOrderStatusesValue.PENDING:
                set_current_status(EnumOrderStatusesValue.PENDING);
                setIsError(false);
                break;
            case EnumOrderStatusesValue.CONFIRMED:
                set_current_status(EnumOrderStatusesValue.CONFIRMED);
                setIsError(false);
                break;
            case EnumOrderStatusesValue.EXPORTED:
                set_current_status(EnumOrderStatusesValue.EXPORTED);
                setIsError(false);
                break;
            case EnumOrderStatusesValue.DELIVERING:
                set_current_status(EnumOrderStatusesValue.DELIVERING);
                setIsError(false);
                break;
            case EnumOrderStatusesValue.SHIPPING:
                set_current_status(EnumOrderStatusesValue.SHIPPING);
                setIsError(false);
                break;
            case EnumOrderStatusesValue.DELIVERED:
            case EnumOrderStatusesValue.RETURNED:
                set_current_status(EnumOrderStatusesValue.DELIVERED);
                setIsError(false);
                break;
            case EnumOrderStatusesValue.FAILED_DELIVERY:
                switch (EnumOrderStatusesValue[prev_status]) {
                    case EnumOrderStatusesValue.DELIVERING:
                        set_current_status(EnumOrderStatusesValue.DELIVERING);
                        setIsError(true);
                        break;
                    case EnumOrderStatusesValue.SHIPPING:
                        set_current_status(EnumOrderStatusesValue.SHIPPING);
                        setIsError(true);
                        break;
                    default:
                        set_current_status(EnumOrderStatusesValue.SHIPPING);
                        setIsError(true);
                        break;
                }
                break;
            case EnumOrderStatusesValue.CANCELED:
                switch (EnumOrderStatusesValue[prev_status]) {
                    case EnumOrderStatusesValue.PENDING:
                        set_current_status(EnumOrderStatusesValue.PENDING);
                        setIsError(true);
                        break;
                    case EnumOrderStatusesValue.CONFIRMED:
                        set_current_status(EnumOrderStatusesValue.CONFIRMED);
                        setIsError(true);
                        break;
                    default:
                        set_current_status(EnumOrderStatusesValue.PENDING);
                        setIsError(true);
                        break;
                }
                break;
            default:
                set_current_status(EnumOrderStatusesValue.PENDING);
                setIsError(true);
                break;
        }
    };

    useEffect(() => {
        const reactionDisposer = reaction(
            () => order_store.data.order_detail,
            (order_detail, prev_order_detail) => {
                const current_status = order_detail?.order_status;
                const prev_status = prev_order_detail?.order_status;
                handleCurrentStatus(current_status, prev_status);
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
            await handleCancelOrderStatus(orderNo, reason);
        } else if (typeOpenReasonModal === "failed_delivery") {
            await handleFailedDelivery(orderNo, reason);
        } else if (typeOpenReasonModal === "return") {
            await handleReturnOrder(orderNo, reason);
        }
        displayMessage(200, order_store, true);
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
    const handleSaveExportOrderModal = async () => {};

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
                            <Button onClick={onPrint}>In hóa đơn</Button>
                            <Button
                                onClick={() => {
                                    set_open_export_order(true);
                                }}
                            >
                                Xác nhận đơn
                            </Button>
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
                        <Button
                            onClick={() => {
                                handleUpdateOrderStatus(orderNo);
                            }}
                        >
                            Cập nhật trạng thái
                        </Button>
                        <Button
                            onClick={() => {
                                setTypeOpenReasonModal("failed_delivery");
                                setOpenReasonModal(true);
                            }}
                        >
                            Giao thất bại
                        </Button>
                        <Button
                            onClick={() => {
                                setTypeOpenReasonModal("cancel");
                                setOpenReasonModal(true);
                            }}
                        >
                            Hủy đơn
                        </Button>
                        <Button
                            onClick={() => {
                                setTypeOpenReasonModal("return");
                                setOpenReasonModal(true);
                            }}
                        >
                            Trả hàng
                        </Button>
                    </CustomizeButton>
                </div>
                <ModalConfirmReason
                    isOpen={openReasonModal}
                    handleCloseReasonModal={handleCloseReasonModal}
                    handleSaveReasonModal={handleSaveReasonModal}
                    form={confirmReasonForm}
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

OrderDetail.propTypes = {
    orderDetail: PropTypes.object,
    orderNo: PropTypes.string,
    order_store: PropTypes.object,
    handleUpdateOrderStatus: PropTypes.func,
    handleCancelOrderStatus: PropTypes.func,
    handleFailedDelivery: PropTypes.func,
    handleReturnOrder: PropTypes.func,
    displayMessage: PropTypes.func,
};

export default observer(OrderDetail);
