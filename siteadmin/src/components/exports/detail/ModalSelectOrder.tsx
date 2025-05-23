import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomizeModal from "src/components/common/CustomizeModal";
import OrderSearch from "src/components/orders/OrderSearch";
import OrdersTable, {
    getOrderColumnsConfig,
} from "src/components/orders/OrdersTable";
import OrderStatusSearch from "src/components/orders/OrderStatusSearch";
import { EnumOrderStatuses } from "src/constants";
import TableComponent from "src/containers/TableComponent";
import { useStore } from "src/stores";
import { convertDate } from "src/utils";

export interface ModalSelectOrderProps {
    open: boolean;
    onClose: () => void;
    onSave: (selectedRowKeys: string[]) => void;
    orderSelected?: string[];
}

const ModalSelectOrder: React.FC<ModalSelectOrderProps> = ({
    open,
    onClose,
    onSave,
    orderSelected,
}) => {
    const store = useStore();
    const orderStore = store.orderObservable;

    const paymentMethodStore = store.paymentMethodObservable;
    const [filterData, setFilterData] = useState([]);

    useEffect(() => {
        orderStore.setOrderStatusSelected(Object.keys(EnumOrderStatuses)[1]);
    }, []);
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
            const orderFilter =
                orderSelected?.length && orderSelected.length > 0
                    ? !orderSelected.includes(order.id)
                    : true;
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
                matchDate &&
                orderFilter
            );
        });
        setFilterData(filteredData);
    }, [
        orderStore.data?.order_status_selected,
        orderStore.data?.orders,
        orderStore.globalFilters,
        orderSelected,
    ]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const handleRowSelection = (selectedRowKeys: string[]) => {
        const filterSelectedRowKeys = selectedRowKeys.filter((item) => {
            if (orderSelected) {
                return !orderSelected.includes(item);
            }
            return true;
        });
        setSelectedRowKeys(filterSelectedRowKeys);
    };
    const handleCloseModal = () => {
        orderStore.setOrderStatusSelected(undefined);
        onClose();
    };
    return (
        <CustomizeModal
            isOpen={open}
            handleCloseModal={handleCloseModal}
            handleSaveModal={() => {
                onSave(selectedRowKeys);
            }}
            cancelText="Hủy"
            title="Chọn đơn hàng"
            width={1400}
            okText="Lưu"
        >
            <div className="flex flex-col w-full h-full gap-2">
                <OrderSearch
                    globalFilters={orderStore.globalFilters}
                    setGlobalFilters={orderStore.setGlobalFilters}
                    payment_status={paymentMethodStore.data.payment_status}
                    payment_method={paymentMethodStore.data.payment_method}
                />

                <TableComponent
                    data={filterData || []}
                    observableName={orderStore.constructor.name}
                    loading={false}
                    getColumnsConfig={getOrderColumnsConfig}
                    scroll={{ y: "300px" }}
                    rowSelection={{
                        onChange: handleRowSelection,
                    }}
                />
            </div>
        </CustomizeModal>
    );
};

export default observer(ModalSelectOrder);
