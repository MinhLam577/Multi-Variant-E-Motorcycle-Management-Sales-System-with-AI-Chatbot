import { ConfigProvider, Table } from "antd";
import { ForwardedRef, forwardRef } from "react";
import { formatVNDMoney } from "../../../utils";
import dayjs from "dayjs";
import { useStore } from "src/stores";
import { ColumnType } from "antd/es/table";
import { OrderDetailDataResponseType } from "src/stores/order.store";

interface OrderPrintProps {}

const getColumnsConfig = (): ColumnType<OrderDetailDataResponseType>[] => {
    return [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (text, record, index) => index + 1,
            ellipsis: true,
            align: "left",
        },
        {
            title: "Sản phẩm",
            dataIndex: ["skus"],
            key: "order_details",
            ellipsis: true,
            align: "left",
            width: "40%",
            render: (order_details) => {
                return (
                    <span className="text-sm font-semibold">
                        {order_details?.name}
                    </span>
                );
            },
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            ellipsis: true,
            align: "left",
            render: (value) => {
                return <span className="text-sm font-medium">{value}</span>;
            },
        },
        {
            title: "Giá",
            dataIndex: ["skus", "pricesold"],
            key: "pricesold",
            render: (value) => {
                return (
                    <span className="text-sm font-medium">
                        ${formatVNDMoney(value) + "đ"}
                    </span>
                );
            },
            align: "left",
            ellipsis: true,
        },
        {
            title: "Thành tiền",
            dataIndex: ["skus", "pricesold"],
            key: "pricesold",
            render: (value, item) => {
                return (
                    <span className="text-sm font-medium">
                        {formatVNDMoney(value * item.quantity) + "đ"}
                    </span>
                );
            },
            ellipsis: true,
            align: "right",
        },
    ];
};

const OrderPrint = forwardRef(
    (props: OrderPrintProps, ref: ForwardedRef<HTMLDivElement>) => {
        const store = useStore();
        const data = store.orderObservable;
        const orderDetail = data?.data?.order_detail;
        const orderProductTableData = orderDetail?.order_details?.map(
            (item) => {
                return {
                    ...item,
                    key: item.id,
                };
            }
        );

        return (
            <div ref={ref} className="px-16 pt-3">
                <div className="font-bold">CÔNG TY TNHH Ô tô hồng sơn</div>
                <div className="font-semibold text-xl my-1 text-center">
                    HÓA ĐƠN BÁN LẺ
                </div>
                <div className="text-start">
                    <strong>Đơn Hàng: </strong> #{orderDetail?.id}
                </div>
                <div>
                    <strong>Tên Khách Hàng:</strong>
                    {orderDetail?.customer?.username}
                </div>
                <div className="mt-1">
                    <strong>SĐT:</strong> {orderDetail?.customer?.phoneNumber}
                </div>
                <div className="mt-1 mb-2">
                    <strong>Địa chỉ: </strong>
                    <span className="whitespace-nowrap">
                        {orderDetail?.receive_address?.address ? (
                            <span>{orderDetail?.receive_address?.address}</span>
                        ) : (
                            <span>Nhận tại cửa hàng</span>
                        )}
                    </span>
                </div>
                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                cellPaddingBlockSM: 0,
                            },
                        },
                    }}
                >
                    <Table
                        size="small"
                        columns={getColumnsConfig()}
                        dataSource={orderProductTableData}
                        pagination={false}
                        bordered
                        footer={() => (
                            <div className="flex justify-between">
                                <div className="font-bold">Tổng cộng</div>
                                <div className="font-bold">
                                    {formatVNDMoney(orderDetail?.total_price)} đ
                                </div>
                            </div>
                        )}
                    />
                </ConfigProvider>
                <div className="mt-3 text-end text-sm mr-12">
                    Đà Nẵng, {dayjs().format("DD/MM/YYYY HH:mm")}
                </div>
                <div className="text-end font-bold text-base mr-14">
                    Người viết hóa đơn
                </div>
            </div>
        );
    }
);
OrderPrint.displayName = "OrderPrint";
export default OrderPrint;
