import { Button, Grid, Image, Tag, Tooltip } from "antd";
import GroupActionButton from "../GroupActionButton";
import TableComponent from "src/containers/TableComponent";
import { formatVNDMoney } from "../../utils";
import React from "react";
import { useStore } from "src/stores";
import { toJS } from "mobx";
import { Status, StatusColor } from "src/constants";
import { observer } from "mobx-react-lite";
const { useBreakpoint } = Grid;
const getColumnsConfig = ({
    handleEditProducts,
    handleViewProducts,
    handleStatusProducts,
    handleDeleteProducts,
    screens,
}) => {
    return [
        // Product name
        {
            title: "Sản phẩm",
            dataIndex: "title",
            key: "title",
            render: (value: string, item) => {
                return !screens.lg ? (
                    <Tooltip
                        placement="topLeft"
                        title={
                            <div className="flex items-center gap-2 justify-start">
                                <div className="w-14 h-14 shrink-0 flex justify-center items-center">
                                    <Image
                                        className="w-full h-full object-cover rounded-[50%]"
                                        src={
                                            "https://www.characterparties.com.au/wp-content/uploads/2017/05/CARS-ROUND-EI.jpg"
                                        }
                                        fallback="https://www.characterparties.com.au/wp-content/uploads/2017/05/CARS-ROUND-EI.jpg"
                                    />
                                </div>
                                <div className="">
                                    <Button
                                        type="link"
                                        className="items-center justify-start p-0 "
                                        onClick={() => handleViewProducts(item)}
                                    >
                                        <span className="text-white font-semibold">
                                            {value}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        }
                        color="black"
                        trigger={["hover"]}
                    >
                        <div
                            className={`flex items-center gap-2 justify-start`}
                        >
                            <div
                                className={`w-14 h-14 shrink-0 flex justify-center items-center ${screens.lg ? "" : "hidden"}`}
                            >
                                <Image
                                    className="w-full h-full object-cover rounded-[50%]"
                                    src={
                                        "https://www.characterparties.com.au/wp-content/uploads/2017/05/CARS-ROUND-EI.jpg"
                                    }
                                    fallback="https://www.characterparties.com.au/wp-content/uploads/2017/05/CARS-ROUND-EI.jpg"
                                />
                            </div>
                            <div>
                                <Button
                                    type="link"
                                    className="items-center justify-start p-0"
                                    onClick={() => handleViewProducts(item)}
                                >
                                    {value}
                                </Button>
                            </div>
                        </div>
                    </Tooltip>
                ) : (
                    <div className={`flex items-center gap-2 justify-start`}>
                        <div
                            className={`w-14 h-14 shrink-0 flex justify-center items-center ${screens.lg ? "" : "hidden"}`}
                        >
                            <Image
                                className="w-full h-full object-cover rounded-[50%]"
                                src={
                                    "https://www.characterparties.com.au/wp-content/uploads/2017/05/CARS-ROUND-EI.jpg"
                                }
                                fallback="https://www.characterparties.com.au/wp-content/uploads/2017/05/CARS-ROUND-EI.jpg"
                            />
                        </div>
                        <div>
                            <Button
                                type="link"
                                className="items-center justify-start p-0"
                                onClick={() => handleViewProducts(item)}
                            >
                                {value}
                            </Button>
                        </div>
                    </div>
                );
            },
            ellipsis: true,
            width: screens.xl
                ? "25%"
                : screens.lg
                  ? "25%"
                  : screens.md
                    ? "20%"
                    : "15%",
        },
        // Car Brand
        {
            title: "Nhãn hàng",
            dataIndex: "brand",
            key: "brand",
            render: (value) => {
                return <span className="text-sm">{value?.name}</span>;
            },
            ellipsis: false,
        },
        // Car category
        {
            title: "Loại xe",
            dataIndex: "category",
            key: "category",
            render: (value) => {
                return <span className="text-sm">{value?.name}</span>;
            },
            ellipsis: false,
        },
        // Inventory
        {
            title: "Tồn kho",
            dataIndex: "totalStock",
            key: "stock",
            render: (value, item) => (
                <span className="text-sm">{`${value} trong ${item?.totalSKU} biến thể`}</span>
            ),
            ellipsis: true,
        },
        // Status
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const statusText = status === true ? "Active" : "InActive";
                const statusColor = StatusColor[statusText];
                const statusLabel = Status[statusText];
                return (
                    <Tag className="uppercase" color={statusColor}>
                        <span className="font-semibold text-sm">
                            {statusLabel}
                        </span>
                    </Tag>
                );
            },
            ellipsis: false,
            responsive: ["xl"],
        },
        // Action
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <GroupActionButton
                        handleEditProducts={handleEditProducts}
                        handleStatusProducts={handleStatusProducts}
                        handleDeleteProducts={handleDeleteProducts}
                        item={item}
                    />
                );
            },
        },
    ];
};

interface IProductsTableProps {
    data: any[];
}

const ProductsTable: React.FC<IProductsTableProps> = ({ data }) => {
    const screens = useBreakpoint();

    const store = useStore();
    const productStore = store.productObservable;
    return (
        <TableComponent
            getColumnsConfig={getColumnsConfig}
            data={data}
            size="large"
            loading={productStore.loading}
            observableName={productStore.constructor.name}
            filterValue={productStore.data.globalFilter}
            screens={screens}
            rowKey={(item) => item?.products?.id || item?.id}
        />
    );
};

export default observer(ProductsTable);
