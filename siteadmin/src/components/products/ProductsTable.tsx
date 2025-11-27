import { Button, Dropdown, Grid, Image, Tag, Tooltip } from "antd";
import GroupActionButton from "../GroupActionButton";
import TableComponent from "@/containers/TableComponent";
import { formatVNDMoney } from "../../utils";
import React from "react";
import { useStore } from "@/stores";
import { toJS } from "mobx";
import { Status, StatusColor } from "@/constants";
import { observer } from "mobx-react-lite";
import { Breakpoint } from "antd/lib";
import { productTableFilterDataType } from "@/pages/products";
import { ALL_MODULES } from "@/constants/permissions";
import {
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    MenuOutlined,
    UndoOutlined,
} from "@ant-design/icons";
const { useBreakpoint } = Grid;

interface IGetColumnsConfigProps {
    handleEditProducts: (item: any) => void;
    handleViewProducts: (item: any) => void;
    handleRestoreProducts: (item: any) => void;
    handleDeleteProducts: (item: any) => void;
    handleHardDeleteProducts?: (item: any) => void;
    screens: Partial<Record<Breakpoint, boolean>>;
}

const getColumnsConfig = ({
    handleEditProducts,
    handleViewProducts,
    handleRestoreProducts,
    handleDeleteProducts,
    handleHardDeleteProducts,
    screens,
}: IGetColumnsConfigProps): Array<any> => {
    return [
        {
            title: "Sản phẩm",
            dataIndex: "title",
            key: "title",
            render: (value: string, item: productTableFilterDataType) => {
                return (
                    <div className="flex items-center gap-2 justify-start">
                        <div className="w-14 h-14 shrink-0 hidden lg:flex justify-center items-center">
                            <Image
                                className="w-full h-full object-cover rounded-md"
                                src={
                                    item.images && item.images.length > 0
                                        ? item.images[0]
                                        : ""
                                }
                                fallback="/images/default_product_image.jpg"
                            />
                        </div>
                        <div>
                            <span className="items-center justify-start p-0">
                                {value}
                            </span>
                        </div>
                    </div>
                );
            },
            ellipsis: true,
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
            responsive: ["lg"],
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
            responsive: ["lg"],
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
            responsive: ["sm"],
        },
        // Status
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
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
                    <div className="flex items-center justify-start">
                        {screens.xxl ? (
                            <GroupActionButton
                                handleDelete={handleDeleteProducts}
                                handleRestore={handleRestoreProducts}
                                handleUpdate={handleEditProducts}
                                item={item}
                                moduleName={ALL_MODULES.PRODUCTS}
                                handleHardDelete={handleHardDeleteProducts}
                            />
                        ) : (
                            <Dropdown
                                trigger={["click"]}
                                placement="bottomLeft"
                                menu={{
                                    items: [
                                        {
                                            key: "edit",
                                            label: (
                                                <Button
                                                    type="text"
                                                    onClick={() =>
                                                        handleEditProducts(item)
                                                    }
                                                    className="!w-full !p-2"
                                                >
                                                    Chỉnh sửa
                                                </Button>
                                            ),
                                        },
                                        {
                                            key: "restore",
                                            label: (
                                                <Button
                                                    type="text"
                                                    onClick={() =>
                                                        handleRestoreProducts(
                                                            item.id
                                                        )
                                                    }
                                                    className="!w-full !p-2"
                                                >
                                                    Khôi phục
                                                </Button>
                                            ),
                                        },
                                        {
                                            key: "delete",
                                            label: (
                                                <Button
                                                    type="text"
                                                    danger
                                                    onClick={() =>
                                                        handleDeleteProducts(
                                                            item.id
                                                        )
                                                    }
                                                    className="!w-full !p-2"
                                                >
                                                    Xóa tạm thời
                                                </Button>
                                            ),
                                        },
                                        {
                                            key: "hardDelete",
                                            label: (
                                                <Button
                                                    type="text"
                                                    danger
                                                    onClick={() =>
                                                        handleHardDeleteProducts(
                                                            item.id
                                                        )
                                                    }
                                                    className="!w-full !p-2"
                                                >
                                                    Xóa vĩnh viễn
                                                </Button>
                                            ),
                                        },
                                    ],
                                }}
                            >
                                <Button type="text" className="!p-0 !text-base">
                                    <Tooltip title="Thao tác">
                                        <MenuOutlined />
                                    </Tooltip>
                                </Button>
                            </Dropdown>
                        )}
                    </div>
                );
            },
        },
    ];
};

interface IProductsTableProps {
    data: productTableFilterDataType[];
    handleDeleteProducts: (id: string) => void;
    handleRestoreProducts: (id: string) => void;
    handleViewOrUpdateProduct: (item: productTableFilterDataType) => void;
    handleHardDeleteProducts: (id: string) => void;
}

const ProductsTable: React.FC<IProductsTableProps> = ({
    data,
    handleDeleteProducts,
    handleRestoreProducts,
    handleViewOrUpdateProduct,
    handleHardDeleteProducts,
}) => {
    const screens = useBreakpoint();
    const store = useStore();
    const productStore = store.productObservable;
    return (
        <TableComponent
            getColumnsConfig={() =>
                getColumnsConfig({
                    handleEditProducts: handleViewOrUpdateProduct,
                    handleViewProducts: handleViewOrUpdateProduct,
                    handleRestoreProducts: handleRestoreProducts,
                    handleDeleteProducts: handleDeleteProducts,
                    handleHardDeleteProducts: handleHardDeleteProducts,
                    screens: screens,
                })
            }
            data={data}
            size="large"
            loading={productStore.loading}
            observableName={productStore.constructor.name}
            filterValue={productStore.data.globalFilter}
            screens={screens}
            rowKey={(item: productTableFilterDataType) => item.id}
            scroll={{ y: "200px" }}
        />
    );
};

export default observer(ProductsTable);
