import { Table, Image } from "antd";
import { AntdTableLocale } from "../../../constants";
import { useNavigate } from "react-router";
import { formatVNDMoney } from "../../../utils";
import PropTypes from "prop-types";

const getColumnsConfig = ({ handleViewProducts }) => {
    return [
        {
            title: "Sản phẩm",
            dataIndex: ["skus"],
            key: "order_details",
            render: (order_details) => {
                return (
                    <div className="flex items-center gap-2">
                        <Image
                            src={order_details?.image}
                            alt={order_details?.name}
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src =
                                    "http://static.tapchitaichinh.vn/w640/images/upload/08122020/honda-crv-7-1312-1597115159_860x0_5b796724.jpg"; // Placeholder image
                            }}
                            width={48}
                            height={48}
                            preview={false}
                            className="min-w-12 min-h-12 rounded-md cursor-pointer"
                        />
                        <div className="flex flex-col items-start gap-2 justify-start overflow-hidden">
                            <span className="text-sm font-semibold">
                                {order_details?.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {order_details?.masku}
                            </span>
                        </div>
                    </div>
                );
            },
            width: "40%",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            ellipsis: true,
            render: (value) => {
                return <span className="text-sm font-medium">{value}</span>;
            },
            width: "30%",
        },
        {
            title: "Giá",
            dataIndex: ["skus", "price_sold"],
            key: "price_sold",
            render: (value) => {
                return (
                    <span className="text-sm font-medium">
                        {formatVNDMoney(value) + "đ"}
                    </span>
                );
            },
            ellipsis: true,
            width: "30%",
        },
    ];
};

const OrderProductsTable = ({ data }) => {
    const navigate = useNavigate();
    const handleViewProducts = (item) => {
        navigate(`/products/${item.productId}`, { replace: true });
    };

    return (
        <div className="flex flex-col">
            <Table
                locale={{
                    ...AntdTableLocale,
                }}
                columns={getColumnsConfig({
                    handleViewProducts,
                })}
                dataSource={data || []}
                rowKey={"id"}
                pagination={false}
                style={{
                    border: "none",
                }}
            />
        </div>
    );
};

OrderProductsTable.propTypes = {
    data: PropTypes.array,
};

export default OrderProductsTable;
