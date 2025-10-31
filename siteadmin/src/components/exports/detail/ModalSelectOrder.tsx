import { CopyOutlined } from "@ant-design/icons";
import { Checkbox, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import CustomizeModal from "src/components/common/CustomizeModal";
import OrderSearch from "src/components/orders/OrderSearch";
import { handleCopy } from "src/components/orders/OrdersTable";
import {
    EnumOrderColorStatuses,
    EnumOrderStatuses,
    EnumOrderStatusesValue,
} from "src/constants";
import TableComponent from "src/containers/TableComponent";
import { useStore } from "src/stores";
import { globalFiltersDataOrder } from "src/types/order.type";
import { paginationData } from "src/stores/base";
import { formatVNDMoney } from "src/utils";

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

    const handleCheckboxChange = (recordId: string) => {
        setSelectedRowKeys((prevKeys) => {
            if (prevKeys.includes(recordId)) {
                return prevKeys.filter((key) => key !== recordId);
            } else {
                if (!orderSelected.includes(recordId)) {
                    return [...prevKeys, recordId];
                }
                return prevKeys;
            }
        });
    };
    const getColumnsConfig = () => {
        return [
            {
                title: (
                    <Checkbox
                        checked={
                            selectedRowKeys.length === filterOrder().length
                        }
                        onChange={(e) => {
                            if (e.target.checked) {
                                const allRowKeys = filterOrder().map(
                                    (item) => item.id
                                );
                                handleRowSelection(allRowKeys);
                            } else {
                                handleRowSelection([]);
                            }
                        }}
                    />
                ),
                dataIndex: "selection",
                key: "selection",
                render: (_, record) => (
                    <Checkbox
                        checked={selectedRowKeys.includes(record.id)}
                        onChange={() => handleCheckboxChange(record.id)}
                    />
                ),
                width: "5%",
                fixed: "left",
            },
            {
                title: "Mã đơn hàng",
                dataIndex: "id",
                key: "id",
                render: (_, record) => (
                    <div className="flex items-center gap-2">
                        <span
                            className="!p-0 whitespace-normal"
                            key={record.id}
                        >
                            {record.id}
                        </span>
                        <CopyOutlined
                            onClick={() => {
                                handleCopy(record.id);
                            }}
                        />
                    </div>
                ),
                width: "20%",
                responsive: ["md"],
            },
            {
                title: "Khách hàng",
                dataIndex: ["customer", "username"],
                key: "username",
                render: (_, record) => (
                    <div>
                        <span className="font-semibold">
                            {record.customer.username}
                        </span>
                    </div>
                ),
                ellipsis: true,
                width: "20%",
            },
            {
                title: "Thông tin nhận hàng",
                dataIndex: "receive_address",
                key: "receive_address",
                render: (_, record) => (
                    <>
                        <div>
                            <span className="font-semibold">Tên: </span>
                            <div className="cursor-pointer inline-flex gap-2">
                                {record.receive_address.receiver_name}
                                <CopyOutlined
                                    onClick={() => {
                                        handleCopy(record.id);
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold">SDT: </span>
                            <div className="cursor-pointer inline-flex gap-2">
                                {record.receive_address.receiver_phone}
                                <CopyOutlined
                                    onClick={() => {
                                        handleCopy(record.id);
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold">Địa chỉ: </span>
                            <span className="cursor-pointer whitespace-normal break-words">
                                {record.receive_address.address}
                                <CopyOutlined
                                    onClick={() => {
                                        handleCopy(record.id);
                                    }}
                                    className="ml-2"
                                />
                            </span>
                        </div>
                    </>
                ),
                ellipsis: true,
                width: "25%",
                responsive: ["xl"],
            },
            {
                title: "Tổng tiền",
                dataIndex: "total_price",
                key: "total_price",
                render: (_, record) => (
                    <>{formatVNDMoney(record.total_price) + "đ"}</>
                ),
                ellipsis: true,
                width: "10%",
                responsive: ["lg"],
            },
            {
                title: "Trạng thái đơn hàng",
                dataIndex: "order_status",
                key: "order_status",
                render: (status) => (
                    <Tag color={EnumOrderColorStatuses[status]}>
                        {EnumOrderStatuses[status]}
                    </Tag>
                ),
                ellipsis: true,
                width: "15%",
            },
        ];
    };
    const handleCloseModal = () => {
        setSelectedRowKeys([]);
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
                    getColumnsConfig={getColumnsConfig}
                    scroll={{ y: "300px" }}
                />
            </div>
        </CustomizeModal>
    );
};

export default observer(ModalSelectOrder);
