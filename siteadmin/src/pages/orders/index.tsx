import { Drawer, Form } from "antd";
import { useEffect, useState } from "react";

import OrderSearch from "src/components/orders/OrderSearch";
import OrdersTable from "src/components/orders/OrdersTable";
import OrderDetail from "./OrderDetail";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import OrderStatusSearch from "../../components/orders/OrderStatusSearch";
import { getErrorMessage } from "../../utils";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "src/containers/layout";
import CustomizeTab from "src/components/common/CustomizeTab";
import { globalFiltersDataOrder } from "src/types/order.type";
import { paginationData } from "src/stores/base";
const Orders = () => {
    const store = useStore();
    const orderStore = store.orderObservable;
    const skusStore = store.skusObservable;
    const paymentMethodStore = store.paymentMethodObservable;
    const fetchListOrder = async (
        query?:
            | (globalFiltersDataOrder & paginationData)
            | globalFiltersDataOrder
            | paginationData
    ) => {
        await orderStore.getListOrder(query);
    };
    const fetchData = async () => {
        try {
            await Promise.all([
                fetchListOrder(),
                paymentMethodStore.getPaymentStatus(),
                paymentMethodStore.getMethods(),
                paymentMethodStore.getListDeliveryMethod(),
            ]);
        } catch (e: any) {
            console.error("Error fetching data for order page:", e);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchListOrder({
            ...orderStore.pagination,
            ...orderStore.globalFilters,
        });
    }, [orderStore.globalFilters, orderStore.pagination]);

    const handleViewOrders = async (id: string) => {
        try {
            orderStore.setOrderSelected(id);
            await orderStore.getOrderDetail(id);
            orderStore.setOpenDetail(true);
        } catch (e: any) {
            console.error("Error viewing order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể xem chi tiết đơn hàng."
            );
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const handleUpdateOrderStatus = async (id: string) => {
        try {
            await orderStore.updateOrderStatus(id);
        } catch (e: any) {
            console.log("Error updating order status:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể cập nhật trạng thái đơn hàng."
            );
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const handleConfirmOrderStatus = async (id: string) => {
        try {
            await orderStore.confirmOrder(id);
        } catch (e: any) {
            console.log("Error confirming order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể xác nhận đơn hàng."
            );
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const handleExportOrderStatus = async (id: string) => {
        try {
            await orderStore.exportOrder(id);
        } catch (e: any) {
            console.log("Error exporting order:", e);
            const errorMessage = getErrorMessage(e, "Không thể xuất đơn hàng.");
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const handleHandoverOrderStatus = async (id: string) => {
        try {
            await orderStore.handOverOrder(id);
        } catch (e: any) {
            console.log("Error handing over order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể bàn giao đơn hàng."
            );
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const handleDeliverOrderStatus = async (id: string) => {
        try {
            await orderStore.deliverOrder(id);
        } catch (e: any) {
            console.log("Error handing over order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể cật nhật trạng thái vận chuyển hàng."
            );
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const handleShipOrderStatus = async (id: string) => {
        try {
            await orderStore.shipOrder(id);
        } catch (e: any) {
            console.log("Error shipping order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể cập nhật trạng thái giao hàng."
            );
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const handleShipSuccessOrderStatus = async (id: string) => {
        try {
            await orderStore.shipSuccess(id);
        } catch (e: any) {
            console.log("Error shipping success order:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể cập nhật trạng thái giao hàng thành công."
            );
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const handleCancelOrderStatus = async (id: string, reason?: string) => {
        try {
            await orderStore.cancelOrder(id, reason);
        } catch (e: any) {
            console.log("Error canceling order:", e);
            const errorMessage = getErrorMessage(e, "Không thể hủy đơn hàng.");
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const handleFailedDelivery = async (id: string, reason?: string) => {
        try {
            await orderStore.failedDelivery(id, reason);
        } catch (e: any) {
            console.log("Error handling failed delivery:", e);
            const errorMessage = getErrorMessage(
                e,
                "Không thể xử lí đơn hàng giao thất bại."
            );
            store.setStatusMessage(500, errorMessage, "");
        }
    };

    const [openModalCreateOrder, setOpenModalCrateOrder] = useState(false);
    const [createForm] = Form.useForm();
    const handleCloseModalCreateOrder = () => {
        createForm.resetFields();
        setOpenModalCrateOrder(false);
    };
    const handleSaveModalCreateOrder = () => {
        createForm.submit();
    };

    const handleSubmitCreateOrder = async (values: any) => {};

    return (
        <section className="w-full flex flex-col">
            <div className="w-full flex flex-col animate-slideDown">
                <div className="flex justify-between items-center">
                    <AdminBreadCrumb
                        description="Thông tin chi tiết về danh sách đơn hàng"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />
                    {/* <Button
                        type="primary"
                        size="large"
                        className="!rounded-none"
                    >
                        Xuất excel
                    </Button> */}
                </div>
                <OrderStatusSearch order_store={orderStore} />
            </div>
            <div className="w-full mt-4 mb-6 flex flex-col gap-4 px-4 pb-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả đơn hàng",
                            children: (
                                <div className="w-full">
                                    <OrderSearch
                                        globalFilters={orderStore.globalFilters}
                                        setGlobalFilters={
                                            orderStore.setGlobalFilters
                                        }
                                        payment_status={
                                            paymentMethodStore.data
                                                .payment_status
                                        }
                                        payment_method={
                                            paymentMethodStore.data
                                                .payment_method
                                        }
                                        delivery_method={
                                            paymentMethodStore.deliveryMethodData
                                        }
                                    />
                                    <Drawer
                                        loading={orderStore.loading}
                                        title={
                                            <div
                                                className="flex flex-col gap-1 p-4 shadow-sm"
                                                style={{
                                                    borderBottom:
                                                        "1px solid var(--border-gray)",
                                                }}
                                            >
                                                <span className="text-base font-semibold">
                                                    #
                                                    {orderStore.data
                                                        .order_selected || ""}
                                                </span>
                                                <span className="text-sm font-normal text-gray-700">
                                                    Chi tiết đơn hàng
                                                </span>
                                            </div>
                                        }
                                        placement="right"
                                        onClose={() =>
                                            orderStore.setOpenDetail(false)
                                        }
                                        open={orderStore.isOpenDetail}
                                        width={600}
                                        key="right"
                                    >
                                        <OrderDetail
                                            orderDetail={
                                                orderStore.data.order_detail
                                            }
                                            order_store={orderStore}
                                            skus_store={skusStore}
                                            orderNo={
                                                orderStore.data.order_selected
                                            }
                                            handleUpdateOrderStatus={
                                                handleUpdateOrderStatus
                                            }
                                            handleCancelOrderStatus={
                                                handleCancelOrderStatus
                                            }
                                            handleFailedDelivery={
                                                handleFailedDelivery
                                            }
                                            handleConfirmOrderStatus={
                                                handleConfirmOrderStatus
                                            }
                                            handleExportOrderStatus={
                                                handleExportOrderStatus
                                            }
                                            handleHandoverOrderStatus={
                                                handleHandoverOrderStatus
                                            }
                                            handleDeliverOrderStatus={
                                                handleDeliverOrderStatus
                                            }
                                            handleShipOrderStatus={
                                                handleShipOrderStatus
                                            }
                                            handleShipSuccessOrderStatus={
                                                handleShipSuccessOrderStatus
                                            }
                                        />
                                    </Drawer>
                                    <OrdersTable
                                        data={{
                                            data: orderStore.data?.orders || [],
                                        }}
                                        handleViewOrders={handleViewOrders}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* <CustomizeModal
                isOpen={openModalCreateOrder}
                title="Tạo đơn hàng mới"
                okText="Lưu"
                cancelText="Hủy"
                handleCloseModal={handleCloseModalCreateOrder}
                handleSaveModal={handleSaveModalCreateOrder}
            >
                <Form></Form>
            </CustomizeModal> */}
        </section>
    );
};

export default observer(Orders);
