import { Button } from "antd";
import { useNavigate } from "react-router";
import TableComponent from "../../containers/TableComponent";
import React from "react";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
import GroupActionButton from "../GroupActionButton";
import {
    processWithModals,
    ProcessModalName,
} from "../../containers/processWithModals";
import { ExportResponseType } from "src/types/export.type";
import { ALL_MODULES } from "src/constants/permissions";

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
                responsive: ["md"],
            },
            {
                title: "Ghi chú",
                dataIndex: "note",
                key: "note",
                responsive: ["lg"],
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
                responsive: ["sm"],
            },
            {
                title: "Thao tác",
                dataIndex: "action",
                key: "action",
                render: (_value, item) => {
                    return (
                        <GroupActionButton
                            handleDelete={() => {
                                processWithModals({
                                    modalName:
                                        ProcessModalName.ConfirmCustomContent,
                                    title: "Xác nhận",
                                    content: `Bạn có chắc chắn muốn xóa phiếu xuất hàng #${item.id} không?`,
                                    onOk: async () => {
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
                                    },
                                });
                            }}
                            handleUpdate={handleUpdate}
                            item={item}
                            moduleName={ALL_MODULES.EXPORT}
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
