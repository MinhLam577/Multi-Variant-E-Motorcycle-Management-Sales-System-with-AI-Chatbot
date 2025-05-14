import { CopyOutlined } from "@ant-design/icons";
import { Button, Tag, message } from "antd";
import moment from "moment";
import { useNavigate } from "react-router";
import {
    DateTimeFormat,
    EnumOrderColorStatuses,
    EnumOrderStatuses,
} from "../../constants";
import TableComponent from "src/containers/TableComponent";
import { formatVNDMoney } from "../../utils";
import { useStore } from "src/stores";

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
                    {handleViewOrders ? (
                        <Button
                            type="link"
                            className="!p-0 whitespace-normal"
                            key={record.id}
                            onClick={() => {
                                handleViewOrders(record.id);
                            }}
                        >
                            {record.id}
                        </Button>
                    ) : (
                        <span className="font-semibold">{record.id}</span>
                    )}
                    <CopyOutlined
                        onClick={() => {
                            handleCopy(record.id);
                        }}
                    />
                </div>
            ),
            width: 140,
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
            width: 140,
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
            width: 150,
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_price",
            key: "total_price",
            render: (_, record) => (
                <>{formatVNDMoney(record.total_price) + "đ"}</>
            ),
            ellipsis: true,
            width: 120,
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
            width: 150,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) =>
                moment(createdAt).format(DateTimeFormat.TimeStamp),
            ellipsis: true,
            width: 120,
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
                getColumnsConfig={getOrderColumnsConfig}
                handleViewOrders={handleViewOrders}
                scroll={{ y: "180px" }}
            />
        </>
    );
};

export default OrdersTable;
