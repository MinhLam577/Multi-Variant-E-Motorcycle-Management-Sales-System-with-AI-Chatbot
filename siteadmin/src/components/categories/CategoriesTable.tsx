import GroupActionButton from "../GroupActionButton";
import TableComponent from "../../containers/TableComponent";
import { Button } from "antd";
import { useStore } from "../../stores";
import { ALL_MODULES } from "../../constants/permissions";
import { useEffect } from "react";

const getColumnsConfig = ({
    handleDeleteCategories,
    handleViewCategories,
    handleEditCategories,
}) => {
    const store = useStore();
    const AccountStore = store.accountObservable;
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        await AccountStore.getAccount();
    };
    return [
        {
            title: "Tên danh mục",
            dataIndex: "name",
            key: "name",
            render: (value, item) => {
                return (
                    <Button
                        type="link"
                        onClick={() => handleViewCategories(item)}
                    >
                        {value}
                    </Button>
                );
            },
            ellipsis: true,
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
            render: (value) => <span>{value}</span>,
            ellipsis: true,
            responsive: ["md"],
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (value) => {
                return <span>{value}</span>;
            },
            ellipsis: true,
            responsive: ["sm"],
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <GroupActionButton
                        handleUpdate={handleEditCategories}
                        handleDelete={handleDeleteCategories}
                        item={item}
                        moduleName={ALL_MODULES.CATEGORIES}
                    />
                );
            },
            width: 140,
        },
    ];
};

const CategoriesTable = ({
    handleEditCategories,
    handleViewCategories,
    handleDeleteCategories,
    data,
}) => {
    const store = useStore();
    const { categoriesObservable: categoriesStore } = store;
    return (
        <>
            <TableComponent
                getColumnsConfig={() =>
                    getColumnsConfig({
                        handleDeleteCategories,
                        handleViewCategories,
                        handleEditCategories,
                    })
                }
                loading={categoriesStore.loading}
                data={data}
                rowKey="id"
                scroll={{ y: "200px" }}
            />
        </>
    );
};

export default CategoriesTable;
