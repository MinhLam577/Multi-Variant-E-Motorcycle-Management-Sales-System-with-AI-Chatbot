import { Descriptions, Tag } from "antd";
import {
    DateTimeFormat,
    EnumOrderColorStatuses,
    EnumOrderStatuses,
    EnumPaymentStatusColors,
    PaymentStatus,
} from "../../../constants";
import { convertDate, formatVNDMoney } from "../../../utils";
import PropTypes from "prop-types";

const getDescriptionOrderItems = (orderDetail) => [
    {
        key: "2",
        label: "Trạng thái đơn hàng",
        children: (
            <Tag color={EnumOrderColorStatuses[orderDetail?.order_status]}>
                {EnumOrderStatuses[orderDetail?.order_status]}
            </Tag>
        ),
    },
    {
        key: "3",
        label: "Thời gian tạo",
        children: (
            <span className="text-sm font-semibold">
                {convertDate(
                    orderDetail?.createdAt,
                    DateTimeFormat.TIME_STAMP_POSTGRES_TZ,
                    DateTimeFormat.TimeStamp
                )}
            </span>
        ),
    },
    {
        key: "4",
        label: "Tổng tiền",
        children: (
            <span className="text-sm font-semibold">
                {formatVNDMoney(orderDetail?.total_price)}
            </span>
        ),
    },
    {
        key: "5",
        label: "Giảm giá",
        children: (
            <span className="text-sm font-semibold">
                {formatVNDMoney(orderDetail?.discount_price)}
            </span>
        ),
    },
    {
        key: "6",
        label: "Hình thức thanh toán",
        children: (
            <span className="text-sm font-semibold">
                {orderDetail?.payment_method?.name}
            </span>
        ),
    },
    {
        key: "1",
        label: "Trạng thái thanh toán",
        children: (
            <Tag color={EnumPaymentStatusColors[orderDetail?.payment_status]}>
                {PaymentStatus[orderDetail?.payment_status]}
            </Tag>
        ),
    },
    {
        key: "8",
        label: "Hình thức giao hàng",
        children: (
            <span className="text-sm font-semibold">
                {orderDetail?.delivery_method?.name || "N/A"}
            </span>
        ),
    },
    {
        key: "7",
        label: "Ghi chú",
        children: (
            <span className="text-sm font-semibold">
                {orderDetail?.note || "N/A"}
            </span>
        ),
    },
];
const OrderDescription = ({ orderDetail }) => {
    return (
        <Descriptions
            bordered
            column={1}
            styles={{
                content: {
                    width: "60%",
                },
                label: {
                    width: "40%",
                },
            }}
            items={getDescriptionOrderItems(orderDetail)}
        />
    );
};

OrderDescription.propTypes = {
    orderDetail: PropTypes.object,
};

export default OrderDescription;
