import { CopyOutlined } from "@ant-design/icons";
import { Button, Image, Tag, message } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import {
    DateTimeFormat,
    EnumOrderColorStatuses,
    EnumOrderStatuses,
} from "../../constants";
import TableComponent from "src/containers/TableComponent";
import { formatVNDMoney } from "../../utils";
import { useEffect } from "react";
import { useStore } from "src/stores";

const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.info("Copied!!");
};

const getColumnsConfig = ({ handleViewOrders }) => {
    return [
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            key: "id",
            render: (_, record) => (
                <div className="flex items-center gap-2">
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
                    <span
                        className="cursor-pointer text-sky-500 font-semibold"
                        onClick={() => {}}
                    >
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
const OrdersTable = ({ globalFilters, handleViewOrders, data }) => {
    const navigate = useNavigate();
    const store = useStore();
    const order_store = store.orderObservable;
    const handleViewUser = (id: string) => {
        navigate(`/users/${id}`, { replace: true });
    };

    return (
        <>
            <TableComponent
                filterValue={globalFilters}
                data={data}
                observableName={order_store.constructor.name}
                loading={order_store.loading}
                getColumnsConfig={getColumnsConfig}
                handleViewOrders={handleViewOrders}
                handleViewUser={handleViewUser}
                scroll={{ y: "350px" }}
            />
        </>
    );
};

OrdersTable.propTypes = {
    globalFilters: PropTypes.object,
    handleViewOrders: PropTypes.func,
    data: PropTypes.object,
    loadData: PropTypes.func,
    order_store: PropTypes.object,
};

export default OrdersTable;
