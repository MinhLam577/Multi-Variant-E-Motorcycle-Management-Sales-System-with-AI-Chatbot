import { Button } from "antd";
import { useNavigate } from "react-router";
import TableComponent from "../../containers/TableComponent";
import React from "react";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
import { ImportResponseType } from "src/stores/imports.store";
import GroupActionButton from "../GroupActionButton";
import {
    processWithModals,
    ProcessModalName,
} from "../../containers/processWithModals.js";
import { ALL_MODULES } from "src/constants/permissions";

interface ImportTableProps {
    data: ImportResponseType[];
    handleUpdateImport?: (item: ImportResponseType) => void;
    handleDeleteImport?: (id: string) => void;
}

const ImportTable: React.FC<ImportTableProps> = ({
    data,
    handleUpdateImport,
    handleDeleteImport,
}) => {
    const store = useStore();
    const importStore = store.importObservable;
    const getColumnsConfig = ({
        handleUpdate,
        handleDelete,
    }: {
        handleUpdate: (item: ImportResponseType) => void;
        handleDelete: (id: string) => void;
    }) => {
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
                render: (text: ImportResponseType["detail_imports"]) => {
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
                            handleDelete={() => {
                                processWithModals(
                                    ProcessModalName.ConfirmCustomContent
                                )(
                                    "Xác nhận",
                                    `Bạn có chắc chắn muốn xóa phiếu nhập hàng #${item.id} không?`
                                )(async () => {
                                    try {
                                        await handleDelete(item.id);
                                    } catch (e: any) {
                                        console.error(e);
                                        const errorMessage =
                                            e?.message ||
                                            "Có lỗi xảy ra trong quá trình xóa phiếu nhập hàng, vui lòng thử lại sau.";
                                        store.setStatusMessage(
                                            500,
                                            errorMessage,
                                            "",
                                            false
                                        );
                                    }
                                });
                            }}
                            handleUpdate={handleUpdate}
                            item={item}
                            moduleName={ALL_MODULES.IMPORT}
                        />
                    );
                },
            },
        ];
    };
    return (
        <>
            <TableComponent
                loading={importStore.loading}
                getColumnsConfig={() =>
                    getColumnsConfig({
                        handleUpdate: handleUpdateImport,
                        handleDelete: handleDeleteImport,
                    })
                }
                loadData={() => {}}
                observableName={importStore.constructor.name}
                data={data || []}
                rowKey={(item: ImportResponseType) => item.id}
                scroll={{ y: "200px" }}
            />
        </>
    );
};
export default observer(ImportTable);
