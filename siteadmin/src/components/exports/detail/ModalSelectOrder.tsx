import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import CustomizeModal from "src/components/common/CustomizeModal";
import OrderSearch from "src/components/orders/OrderSearch";
import { getOrderColumnsConfig } from "src/components/orders/OrdersTable";
import { EnumOrderStatusesValue } from "src/constants";
import TableComponent from "src/containers/TableComponent";
import { useStore } from "src/stores";
import { globalFiltersDataOrder } from "src/stores/order.store";
import { paginationData } from "src/stores/voucher";

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
    const fetchListOrder = async (
        query?:
            | (globalFiltersDataOrder & paginationData)
            | globalFiltersDataOrder
            | paginationData
    ) => {
        await orderStore.getListOrder(query);
    };
    useEffect(() => {
        fetchListOrder({
            ...orderStore.pagination,
            order_status: EnumOrderStatusesValue.CONFIRMED,
        });
    }, []);

    useEffect(() => {
        fetchListOrder({
            ...orderStore.globalFilters,
            ...orderStore.pagination,
            order_status: EnumOrderStatusesValue.CONFIRMED,
        });
    }, [orderStore.globalFilters]);
    const filterOrder = () => {
        return orderStore.data.orders?.filter(
            (order) => !orderSelected.includes(order.id)
        );
    };
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
                    delivery_method={paymentMethodStore.deliveryMethodData}
                />

                <TableComponent
                    data={filterOrder() || []}
                    observableName={orderStore.constructor.name}
                    loading={orderStore.loading}
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
