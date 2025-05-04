import { Breadcrumb, Button, Drawer, message } from "antd";
import { useEffect, useState } from "react";

import OrderSearch from "src/components/orders/OrderSearch";
import OrdersTable from "src/components/orders/OrdersTable";
import OrderDetail from "./OrderDetail";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import OrderStatusSearch from "../../components/orders/OrderStatusSearch";
import { convertDate } from "../../utils";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "src/containers/layout";
import CustomizeTab from "src/components/common/CustomizeTab";
const Orders = () => {
    const store = useStore();
    const orderStore = store.orderObservable;
    const skusStore = store.skusObservable;
    const paymentMethodStore = store.paymentMethodObservable;
    const fetchListOrder = async (query = undefined) => {
        orderStore.getListOrder(query);
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
        } catch (e: any) {
            console.log(e);
            store.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi fetch danh sách order.",
                ""
            );
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const loadData = async () => {
        await fetchData();
    };

    const handleViewOrders = async (id: string) => {
        try {
            orderStore.setOrderSelected(id);
            await orderStore.getOrderDetail(id);
            orderStore.setOpenDetail(true);
        } catch (e: any) {
            store.setStatusMessage(
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
                ? convertDate(globalFilters?.created_from)
                : null;
            const createdTo = globalFilters?.created_to
                ? convertDate(globalFilters?.created_to)
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

    const handleUpdateOrderStatus = async (id: string) => {
        try {
            await orderStore.updateOrderStatus(id);
        } catch (e: any) {
            console.log(e);
            store.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi cật nhật trạng thái order.",
                ""
            );
        }
    };

    const handleCancelOrderStatus = async (id: string, reason?: string) => {
        try {
            await orderStore.cancelOrder(id, reason);
        } catch (e: any) {
            console.log(e);
            store.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi hủy đơn hàng",
                ""
            );
        }
    };

    const handleFailedDelivery = async (id: string, reason?: string) => {
        try {
            await orderStore.failedDelivery(id, reason);
        } catch (e: any) {
            console.log(e);
            store.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi xử lí đơn hàng giao thất bại.",
                ""
            );
        }
    };

    const handleReturnOrder = async (id: string, reason?: string) => {
        try {
            await orderStore.returnOrder(id, reason);
        } catch (e: any) {
            console.log(e);
            store.setStatusMessage(
                500,
                e?.message || "Có lỗi xảy ra khi trả hàng.",
                ""
            );
        }
    };

    return (
        <section className="w-full flex flex-col">
            <div className="w-full flex flex-col animate-slideDown">
                <div className="flex justify-between items-center">
                    <AdminBreadCrumb
                        description="Thông tin chi tiết về danh sách đơn hàng"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />
                    <Button
                        type="primary"
                        size="large"
                        className="!rounded-none"
                    >
                        Xuất excel
                    </Button>
                </div>
                <OrderStatusSearch
                    order_status={orderStore?.data?.order_status}
                    order_store={orderStore}
                />
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
                                        order_status={
                                            orderStore.data.order_status
                                        }
                                        payment_status={
                                            paymentMethodStore.data
                                                .payment_status
                                        }
                                        payment_method={
                                            paymentMethodStore.data
                                                .payment_method
                                        }
                                        order_store={orderStore}
                                        load_data={loadData}
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
                                        closable={false}
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
                                            handleReturnOrder={
                                                handleReturnOrder
                                            }
                                        />
                                    </Drawer>
                                    <OrdersTable
                                        globalFilters={orderStore.globalFilters}
                                        data={{
                                            data: filterData,
                                        }}
                                        handleViewOrders={handleViewOrders}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </section>
    );
};

export default observer(Orders);
