import moment from "moment";
import GroupActionButton from "../../components/GroupActionButton";
import TableComponent from "../../containers/TableComponent";
import { Button } from "antd";
import { useStore } from "../../stores";
import { ALL_MODULES, ALL_PERMISSIONS } from "../../constants/permissions";
import { useEffect, useState } from "react";

const getColumnsConfig = ({
    handleDeleteCategories,
    handleViewCategories,
    handleEditCategories,
}) => {
    const [canUpdate, setCanUpdate] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const store = useStore();
    const AccountStore = store.accountObservable;
    const { loginObservable } = useStore();
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        await AccountStore.getAccount();
        await loginObservable.getAccountApi(AccountStore.account.email);
        const update = await AccountStore.checkPermission(
            ALL_PERMISSIONS.CATEGORIES.UPDATE
        );
        const del = await AccountStore.checkPermission(
            ALL_PERMISSIONS.CATEGORIES.DELETE
        );
        setCanUpdate(update);
        setCanDelete(del);
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
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            render: (value) => {
                return <span>{value}</span>;
            },
            ellipsis: true,
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <GroupActionButton
                        handleUpdate={canUpdate ? handleEditCategories : ""}
                        handleDelete={canDelete ? handleDeleteCategories : ""}
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
