import { Drawer, message } from "antd";
import { useEffect, useState } from "react";

import OrderSearch from "../../components/orders/OrderSearch";
import OrdersTable from "../../components/orders/OrdersTable";
import OrderDetail from "./OrderDetail";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import OrderStatusSearch from "../../components/orders/OrderStatusSearch";
import { convertDD_MM_YYYY_To_DateToTimeStamp } from "../../utils";
import { reaction } from "mobx";

const Orders = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const store = useStore();
    const orderStore = store.orderObservable;
    const paymentMethodStore = store.paymentMethodObservable;
    const fetchListOrder = async (query = undefined) => {
        return await orderStore.getListOrder(query);
    };
    const [filterData, setFilterData] = useState([]);
    const fetchData = async () => {
        try {
            await Promise.all([
                fetchListOrder(),
                orderStore.getOrderStatus(),
                paymentMethodStore.getPaymentStatus(),
                paymentMethodStore.getMethods(),
            ]);
            setFilterData(orderStore.data?.orders);
        } catch (e) {
            console.log(e);
            orderStore.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi fetch danh sách order.",
                ""
            );
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const reaction_status = reaction(
            () => ({
                status: orderStore.status,
                showSuccessMsg: orderStore.showSuccessMsg,
            }),
            (current_status) => {
                if (!current_status) return;
                const { status, showSuccessMsg } = current_status;
                displayMessage(status, orderStore, showSuccessMsg || false);
            }
        );
        return () => {
            reaction_status();
        };
    }, []);

    const loadData = async (query) => {
        await fetchData(query);
    };

    const displayMessage = (status, orderStore, isDisplaySuccess) => {
        const success_status = [200, 201, 204];
        if (!success_status.includes(status) && orderStore.errorMsg) {
            messageApi.error(orderStore.errorMsg, 5);
        } else {
            if (isDisplaySuccess && orderStore.successMsg) {
                messageApi.success(orderStore.successMsg, 5);
            }
        }
        orderStore.clearMessage();
    };

    const handleViewOrders = async (id) => {
        try {
            orderStore.setOrderSelected(id);
            await orderStore.getOrderDetail(id);
            orderStore.setOpenDetail(true);
        } catch (e) {
            orderStore.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi view order.",
                ""
            );
        }
    };

    useEffect(() => {
        const status = orderStore.data?.order_status_selected;
        const globalFilters = orderStore.globalFilters;
        let filteredData = orderStore.data?.orders || [];

        // Kiểm tra dữ liệu đầu vào
        if (!Array.isArray(filteredData)) {
            console.error(
                "orderStore.data.orders is not an array:",
                filteredData
            );
            filteredData = [];
        }
        filteredData = filteredData.filter((order) => {
            // Điều kiện status
            const statusMatch =
                !status || status === "All" || order.order_status === status;

            // Điều kiện search
            const searchMatch =
                !globalFilters?.search ||
                order.id === globalFilters.search ||
                order.customer.username
                    .toLowerCase()
                    .includes(globalFilters.search.toLowerCase()) ||
                order.customer.email
                    .toLowerCase()
                    .includes(globalFilters.search.toLowerCase()) ||
                order.customer.id === globalFilters.search;

            const matchPaymentMethod =
                !globalFilters?.payment_method ||
                order.payment_method.name.toLowerCase() ===
                    globalFilters?.payment_method?.toLowerCase();

            const matchPaymentStatus =
                !globalFilters?.payment_status ||
                order.payment_status.toLowerCase() ===
                    globalFilters?.payment_status?.toLowerCase();

            const createdFrom = globalFilters?.created_from
                ? convertDD_MM_YYYY_To_DateToTimeStamp(
                      globalFilters?.created_from
                  )
                : null;
            const createdTo = globalFilters?.created_to
                ? convertDD_MM_YYYY_To_DateToTimeStamp(
                      globalFilters?.created_to
                  )
                : null;

            const matchDate =
                !(createdFrom && createdTo) ||
                (order.createdAt >= createdFrom &&
                    order.createdAt <= createdTo);

            return (
                statusMatch &&
                searchMatch &&
                matchPaymentMethod &&
                matchPaymentStatus &&
                matchDate
            );
        });
        setFilterData(filteredData);
    }, [
        orderStore.data?.order_status_selected,
        orderStore.data?.orders,
        orderStore.globalFilters,
    ]);

    const handleUpdateOrderStatus = async (id) => {
        try {
            await orderStore.updateOrderStatus(id);
        } catch (e) {
            console.log(e);
            orderStore.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi cật nhật trạng thái order.",
                ""
            );
        }
    };

    const handleCancelOrderStatus = async (id, reason) => {
        try {
            await orderStore.cancelOrder(id, reason);
        } catch (e) {
            console.log(e);
            orderStore.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi hủy đơn hàng",
                ""
            );
        }
    };

    const handleFailedDelivery = async (id, reason) => {
        try {
            await orderStore.failedDelivery(id, reason);
        } catch (e) {
            console.log(e);
            orderStore.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi xử lí đơn hàng giao thất bại.",
                ""
            );
        }
    };

    const handleReturnOrder = async (id, reason) => {
        try {
            await orderStore.returnOrder(id, reason);
        } catch (e) {
            console.log(e);
            orderStore.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi trả hàng.",
                ""
            );
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <OrderStatusSearch
                order_status={orderStore?.data?.order_status}
                order_store={orderStore}
            />
            <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                {contextHolder}
                <OrderSearch
                    globalFilters={orderStore.globalFilters}
                    setGlobalFilters={orderStore.setGlobalFilters}
                    order_status={orderStore.data.order_status}
                    payment_status={paymentMethodStore.data.payment_status}
                    payment_method={paymentMethodStore.data.payment_method}
                    loading={orderStore.loading}
                    order_store={orderStore}
                    load_data={loadData}
                />
                <Drawer
                    loading={orderStore.loading}
                    title={
                        <div
                            className="flex flex-col gap-1 p-4 shadow-sm"
                            style={{
                                borderBottom: "1px solid var(--border-gray)",
                            }}
                        >
                            <span className="text-base font-semibold">
                                #{orderStore.data.order_selected || ""}
                            </span>
                            <span className="text-sm font-normal text-gray-700">
                                Chi tiết đơn hàng
                            </span>
                        </div>
                    }
                    placement="right"
                    closable={false}
                    onClose={() => orderStore.setOpenDetail(false)}
                    open={orderStore.isOpenDetail}
                    width={600}
                    key="right"
                >
                    <OrderDetail
                        orderDetail={orderStore.data.order_detail}
                        order_store={orderStore}
                        orderNo={orderStore.data.order_selected}
                        handleUpdateOrderStatus={handleUpdateOrderStatus}
                        handleCancelOrderStatus={handleCancelOrderStatus}
                        handleFailedDelivery={handleFailedDelivery}
                        handleReturnOrder={handleReturnOrder}
                        displayMessage={displayMessage}
                    />
                </Drawer>
                <OrdersTable
                    globalFilters={orderStore.globalFilters}
                    data={{
                        data: filterData,
                    }}
                    handleViewOrders={handleViewOrders}
                    order_store={orderStore}
                    loadData={() => {}}
                />
            </div>
        </div>
    );
};

export default observer(Orders);
