import { Button } from "antd";
import { useNavigate } from "react-router";
import TableComponent from "../../containers/TableComponent";
import React from "react";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
import GroupActionButton from "../../components/GroupActionButton";
import {
    processWithModals,
    ProcessModalName,
} from "../../containers/processWithModals.js";
import { ExportResponseType } from "src/stores/exports.store";

interface ExportPageProps {
    data: ExportResponseType[];
    handleUpdateExport?: (item: ExportResponseType) => void;
    handleDeleteExport?: (id: string) => void;
}

const ExportPage: React.FC<ExportPageProps> = ({
    data,
    handleUpdateExport,
    handleDeleteExport,
}) => {
    const store = useStore();
    const exportStore = store.exportObservable;
    const getColumnsConfig = ({
        handleUpdate,
        handleDelete,
    }: {
        handleUpdate: (item: ExportResponseType) => void;
        handleDelete: (id: string) => void;
    }) => {
        return [
            {
                title: "Mã phiếu xuất hàng",
                dataIndex: "id",
                key: "id",
            },
            {
                title: "Ngày xuất",
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
                title: "Số lượng xuất",
                dataIndex: "detail_export",
                key: "detail_export",
                render: (
                    detail_export: ExportResponseType["detail_export"]
                ) => {
                    return detail_export?.reduce(
                        (total: number, item) => total + item.quantity_export,
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
                                    `Bạn có chắc chắn muốn xóa phiếu xuất hàng #${item.id} không?`
                                )(async () => {
                                    try {
                                        await handleDelete(item.id);
                                    } catch (e: any) {
                                        console.error(e);
                                        const errorMessage =
                                            e?.message ||
                                            "Có lỗi xảy ra trong quá trình xóa phiếu xuất hàng, vui lòng thử lại sau.";
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
                        />
                    );
                },
            },
        ];
    };
    return (
        <>
            <TableComponent
                loading={exportStore.loading}
                getColumnsConfig={() =>
                    getColumnsConfig({
                        handleUpdate: handleUpdateExport,
                        handleDelete: handleDeleteExport,
                    })
                }
                loadData={() => {}}
                observableName={exportStore.constructor.name}
                data={data || []}
                rowKey={(item: ExportResponseType) => item.id}
                scroll={{ y: "200px" }}
            />
        </>
    );
};
export default observer(ExportPage);
