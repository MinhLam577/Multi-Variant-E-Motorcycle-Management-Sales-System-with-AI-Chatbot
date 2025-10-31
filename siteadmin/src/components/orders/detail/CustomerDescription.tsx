import { Descriptions } from "antd";
const getDescriptionCustomerItems = (orderDetail) => [
    {
        key: "1",
        label: "Tên khách hàng",
        children: (
            <span className="text-sm font-semibold">
                {orderDetail?.customer?.username}
            </span>
        ),
    },
    {
        key: "2",
        label: "Email",
        children: (
            <span className="text-sm font-semibold">
                {orderDetail?.customer?.email}
            </span>
        ),
    },
    {
        key: "3",
        label: "Số điện thoại",
        children: (
            <span className="text-sm font-semibold">
                {orderDetail?.customer?.phoneNumber}
            </span>
        ),
    },
    {
        key: "4",
        label: "Địa chỉ giao hàng",
        children: (
            <span className="text-sm font-semibold">
                {orderDetail?.receive_address?.address}
            </span>
        ),
    },
    {
        key: "5",
        label: "Ghi chú",
        children: (
            <span className="text-sm font-semibold">
                {orderDetail?.receive_address?.note || "N/A"}
            </span>
        ),
    },
];
const CustomerDescription = ({ orderDetail }) => {
    return (
        <Descriptions
            title={
                <span className="text-base font-semibold">
                    Thông tin khách hàng
                </span>
            }
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
            items={getDescriptionCustomerItems(orderDetail)}
        />
    );
};

export default CustomerDescription;
