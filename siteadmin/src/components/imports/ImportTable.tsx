import { Button } from "antd";
import { useNavigate } from "react-router";
import TableComponent from "../../containers/TableComponent";
import React from "react";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
import { ImportType } from "src/stores/imports.store";
import GroupActionButton from "../../components/GroupActionButton";
interface IColumnsConfig {}

const getColumnsConfig = () => {
    return [
        {
            title: "Mã nhập hàng",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Ngày nhập",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => {
                return new Date(text).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                });
            },
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
        },
        {
            title: "Số lượng nhập",
            dataIndex: "detail_imports",
            key: "detail_imports",
            render: (text: ImportType["detail_imports"]) => {
                return text.reduce(
                    (acc, item) => acc + item.quantity_import,
                    0
                );
            },
        },
        {
            title: "Thao tác",
            dataIndex: "action",
            key: "action",
            render: (_value, item) => {
                return (
                    <GroupActionButton
                        handleDelete={() => {}}
                        handleRestore={() => {}}
                        handleUpdate={() => {}}
                        item={item}
                    />
                );
            },
        },
    ];
};

interface ImportTableProps {
    data: ImportType[];
}

const ImportTable: React.FC<ImportTableProps> = ({ data }) => {
    const navigate = useNavigate();
    const store = useStore();
    const importStore = store.importObservable;
    return (
        <>
            <TableComponent
                loading={importStore.loading}
                getColumnsConfig={getColumnsConfig}
                loadData={() => {}}
                observableName={importStore.constructor.name}
                data={data || []}
                rowKey={(item: ImportType) => item.id}
                scroll={{ y: "200px" }}
            />
        </>
    );
};
export default observer(ImportTable);
