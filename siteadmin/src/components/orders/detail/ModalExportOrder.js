import { Form, Table, Image, Select, Input, Button, Tooltip } from "antd";
import CustomizeModal from "../../common/CustomizeModal";
import PropTypes from "prop-types";
import { AntdTableLocale } from "../../../constants";
import { formatVNDMoney } from "../../../utils";
import { useState } from "react";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { CustomizeButton } from "../../common/CustomizeButton";

const getColumnsConfig = () => {
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
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            ellipsis: true,
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
            ellipsis: true,
        },
    ];
};

const getExpandedRowConfig = (removeLot, selected_lot, set_selected_lot) => {
    return [
        {
            title: "Lô hàng",
            render: (_) => {
                const options = [
                    {
                        value: "lot1",
                        label: "Test overload lô hàngTest overload lô hàngTest overload lô hàngTest overload lô hàngTest overload lô hàng",
                    },
                    { value: "lot2", label: "Lô 2" },
                    { value: "lot3", label: "Lô 3" },
                ];
                return (
                    <div className="w-full overflow-hidden max-w-40">
                        <Tooltip
                            placement="topLeft"
                            title={selected_lot?.label}
                            color="#000"
                            trigger={["hover"]}
                        >
                            <Select
                                allowClear
                                showSearch
                                options={options.map((o) => ({
                                    ...o,
                                    label: <span>{o.label}</span>,
                                }))}
                                className="w-full"
                                placeholder="Chọn lô hàng"
                                onChange={(_, option) => {
                                    set_selected_lot(option || null);
                                }}
                            />
                        </Tooltip>
                    </div>
                );
            },
            width: "40%",
        },
        {
            title: "Số lượng xuất kho",
            render: (value) => {
                return (
                    <Input
                        type="number"
                        defaultValue={value}
                        min={0}
                        className="w-full"
                        placeholder="Nhập số lượng xuất kho"
                        onChange={(e) => {
                            if (e.target.value < 0) {
                                e.target.value = 0;
                            }
                        }}
                    />
                );
            },
            width: "30%",
        },
        {
            title: "Thao tác",
            render: (_, record) => {
                return (
                    <DeleteOutlined
                        style={{ fontSize: 16, color: "red" }}
                        onClick={() => removeLot(record.id)}
                    />
                );
            },
            width: "30%",
        },
    ];
};

const ModalExportOrder = ({ orderDetail, isOpen, handleClose, handleSave }) => {
    const [lotData, setLotData] = useState([]);

    const [selected_lot, set_selected_lot] = useState(null);
    const addNewLot = () => {
        const newLot = {
            id: Date.now(),
            lot: "lot1",
            quantity: 0,
        };
        setLotData((prev) => [...prev, newLot]);
    };

    const removeLot = (id) => {
        setLotData((prev) => prev.filter((lot) => lot.id !== id));
    };
    const orderProductTableData = orderDetail?.order_details?.map((item) => {
        return {
            ...item,
            key: item.id,
        };
    });

    const expandedRowRender = () => {
        return (
            <div>
                <Table
                    columns={getExpandedRowConfig(
                        removeLot,
                        selected_lot,
                        set_selected_lot
                    )}
                    dataSource={lotData}
                    pagination={false}
                    rowKey="id"
                    locale={{ ...AntdTableLocale }}
                />
                <Button
                    type="primary"
                    onClick={addNewLot}
                    style={{ marginTop: 16 }}
                >
                    Thêm mới lô
                </Button>
            </div>
        );
    };
    return (
        <CustomizeModal
            isOpen={isOpen}
            handleCloseModal={handleClose}
            handleSaveModal={handleSave}
            okText="Xuất đơn hàng"
            cancelText="Hủy"
            title="Xuất đơn hàng"
            centered
            width={600}
        >
            <Table
                locale={{
                    ...AntdTableLocale,
                }}
                columns={getColumnsConfig()}
                dataSource={orderProductTableData || []}
                rowKey={"id"}
                pagination={false}
                style={{
                    border: "none",
                }}
                expandable={{
                    expandedRowRender,
                }}
            />
        </CustomizeModal>
    );
};

ModalExportOrder.propTypes = {
    orderDetail: PropTypes.object,
    isOpen: PropTypes.bool,
    handleClose: PropTypes.func,
    handleSave: PropTypes.func,
};

export default ModalExportOrder;
