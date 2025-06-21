import { CopyOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Tag, Tooltip, message } from "antd";
import { EnumOrderColorStatuses, EnumOrderStatuses } from "../../constants";
import TableComponent from "src/containers/TableComponent";
import { formatVNDMoney } from "../../utils";
import { useStore } from "src/stores";
import GroupActionButton from "../GroupActionButton";
import { ALL_MODULES, ALL_PERMISSIONS } from "src/constants/permissions";
import Access from "src/access/access";

const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.info("Copied!!");
};

export const getOrderColumnsConfig = ({ handleViewOrders }) => {
    return [
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            key: "id",
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <span className="!p-0 whitespace-normal" key={record.id}>
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
            responsive: ["sm"],
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <div className="flex gap-x-4 ">
                        <Access
                            permission={ALL_PERMISSIONS.ORDERS.UPDATE}
                            hideChildren
                        >
                            <Tooltip title="Cât nhật đơn hàng">
                                <Button
                                    variant="link"
                                    icon={<EditOutlined />}
                                    onClick={() => handleViewOrders(item.id)}
                                />
                            </Tooltip>
                        </Access>
                    </div>
                );
            },
            width: "10%",
        },
    ];
};
const OrdersTable = ({ handleViewOrders, data }) => {
    const store = useStore();
    const order_store = store.orderObservable;

    return (
        <>
            <TableComponent
                data={data}
                observableName={order_store.constructor.name}
                loading={order_store.loading}
                getColumnsConfig={() => {
                    return getOrderColumnsConfig({ handleViewOrders });
                }}
                scroll={{ y: "180px" }}
            />
        </>
    );
};

export default OrdersTable;
