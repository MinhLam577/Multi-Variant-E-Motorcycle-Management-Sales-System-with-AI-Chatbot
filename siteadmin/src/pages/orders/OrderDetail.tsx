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
import OrderObservable from "../../stores/order.store";
import SkusObservable from "../../stores/skus";
import { CreateDetailExport, ExportOrder } from "src/api/order.api";
import { useStore } from "src/stores";
export const OrderDetailMode = {
    View: 1,
    Edit: 2,
};

interface OrderDetailProps {
    orderDetail: any;
    orderNo: string;
    order_store: OrderObservable;
    skus_store: SkusObservable;
    handleUpdateOrderStatus: (orderNo: string) => void;
    handleCancelOrderStatus: (orderNo: string, reason: string) => void;
    handleFailedDelivery: (orderNo: string, reason: string) => void;
    handleReturnOrder: (orderNo: string, reason: string) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({
    orderDetail,
    orderNo,
    order_store,
    skus_store,
    handleUpdateOrderStatus,
    handleCancelOrderStatus,
    handleFailedDelivery,
    handleReturnOrder,
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
                case EnumOrderStatusesValue.DELIVERING:
                case EnumOrderStatusesValue.SHIPPING:
                    newStatus = status;
                    break;
                case EnumOrderStatusesValue.DELIVERED:
                case EnumOrderStatusesValue.RETURNED:
                    newStatus = EnumOrderStatusesValue.DELIVERED;
                    break;
                case EnumOrderStatusesValue.FAILED_DELIVERY:
                    newStatus =
                        prev_status === EnumOrderStatusesValue.DELIVERING
                            ? EnumOrderStatusesValue.DELIVERING
                            : EnumOrderStatusesValue.SHIPPING;
                    isError = true;
                    break;
                case EnumOrderStatusesValue.CANCELED:
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
            console.error(e);
            set_current_status(EnumOrderStatusesValue.PENDING);
            setIsError(true);
            store.setStatusMessage(
                500,
                e?.message || "Lỗi khi cập nhật trạng thái đơn hàng",
                ""
            );
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
        } else if (typeOpenReasonModal === "return") {
            handleReturnOrder(orderNo, reason);
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
    const handleSaveExportOrderModal = async (
        orderExport: CreateDetailExport[],
        note: string
    ) => {
        try {
            const data: ExportOrder = {
                order_id: orderDetail.id,
                detail_export: orderExport,
                note: note,
            };
            const res = await order_store.confirmOrder(data);
            return res;
        } catch (e: any) {
            console.error(e);
            store.setStatusMessage(
                500,
                e?.message || "Lỗi khi xác nhận và lưu xuất đơn hàng",
                ""
            );
        }
    };

    const handleCloseExportOrderModal = () => {
        set_open_export_order(false);
    };

    const skus_ids = orderDetail?.order_details.map((item) => item.skus.id);
    const map_detail_import_skus = new Map<string, any>();

    const fetchDetailImportsBySkusIds = async (skus_ids: string[]) => {
        await skus_store.getDetailImportsByIds(skus_ids);
        const data = skus_store.data.detail_imports;
        if (data.length > 0) {
            data.forEach((item, index) => {
                if (!map_detail_import_skus.has(skus_ids[index])) {
                    map_detail_import_skus.set(skus_ids[index], item);
                }
            });
        }
    };
    useEffect(() => {
        if (skus_ids) {
            fetchDetailImportsBySkusIds(skus_ids);
        }
    }, [skus_ids]);

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
                    map_skus_detail_import={map_detail_import_skus}
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
