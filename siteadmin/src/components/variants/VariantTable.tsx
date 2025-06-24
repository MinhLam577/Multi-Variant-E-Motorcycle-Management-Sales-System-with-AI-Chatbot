import { observer } from "mobx-react-lite";
import TableComponent from "src/containers/TableComponent";
import { useStore } from "src/stores";
import { SkusResponseType } from "src/stores/skus.store";
import GroupActionButton from "../GroupActionButton";
import {
    processWithModals,
    ProcessModalName,
} from "src/containers/processWithModals.js";
import { DetailImportResponseType } from "src/stores/imports.store";
import { Image, Tooltip, Grid } from "antd";
import { getErrorMessage } from "src/utils";
import { ALL_MODULES } from "src/constants/permissions";
const { useBreakpoint } = Grid;

interface VariantTableProps {
    data: SkusResponseType[];
    handleUpdateSkus?: (item: SkusResponseType) => void;
    handleDeleteSkus?: (id: string) => void;
}

const VariantTable: React.FC<VariantTableProps> = ({
    data,
    handleUpdateSkus,
    handleDeleteSkus,
}) => {
    const store = useStore();
    const screen = useBreakpoint();
    const skusStore = store.skusObservable;
    const getColumnsConfig = ({
        handleUpdate,
        handleDelete,
    }: {
        handleUpdate: (item: SkusResponseType) => void;
        handleDelete: (id: string) => void;
    }) => {
        return [
            {
                title: "Biến thể",
                dataIndex: "name",
                key: "name",
                render: (text: string, record: SkusResponseType) => {
                    const optionValue = record.optionValue
                        .map((ov) => ov.value)
                        .join(" / ");
                    return (
                        <div
                            className={`flex items-center gap-2 justify-start`}
                        >
                            <div
                                className={`w-14 h-14 shrink-0 hidden md:flex justify-center items-center`}
                            >
                                <Image
                                    src={record.image}
                                    alt={record.name}
                                    className="w-full h-full object-cover"
                                    fallback="/images/default_product_image.jpg"
                                />
                            </div>
                            <div className="flex flex-col gap-2 overflow-hidden">
                                <Tooltip
                                    title={record?.product?.title || "---"}
                                    placement="topLeft"
                                >
                                    <span className="text-base font-medium truncate">
                                        {record?.product?.title || "---"}
                                    </span>
                                </Tooltip>
                                <Tooltip
                                    title={optionValue}
                                    placement="topLeft"
                                >
                                    <span className="text-sm font-normal text-gray-500 truncate">
                                        {optionValue}
                                    </span>
                                </Tooltip>
                            </div>
                        </div>
                    );
                },
                width: screen.md ? 250 : 150,
            },
            {
                title: "Mã SKU/Barcode",
                dataIndex: "masku",
                key: "masku",
                render: (text: string, record: SkusResponseType) => {
                    return (
                        <div className="flex flex-col gap-2">
                            <div className="text-sm font-medium">
                                {record.masku || "---"}
                            </div>
                            <div className="text-sm text-gray-500">
                                {record.barcode || "---"}
                            </div>
                        </div>
                    );
                },
                responsive: ["xl"],
            },
            {
                title: "Giá bán",
                dataIndex: "price_sold",
                key: "price_sold",
                render: (text: string) => {
                    return (
                        <div className="text-sm font-semibold">
                            {Number(text).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                        </div>
                    );
                },
                responsive: ["lg"],
            },
            {
                title: "Tồn kho",
                dataIndex: "quantity",
                key: "quantity",
                render: (text: string, record: SkusResponseType) => {
                    const totalQuantity = record.detail_import.reduce(
                        (acc: number, item: DetailImportResponseType) =>
                            acc + item.quantity_remaining,
                        0
                    );
                    return (
                        <div className="text-sm font-semibold">
                            {Number(totalQuantity) || 0}
                        </div>
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
                                        const errorMessage = getErrorMessage(
                                            e,
                                            "Có lỗi xảy ra trong quá trình xóa biến thể, vui lòng thử lại sau."
                                        );
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
                            moduleName={ALL_MODULES.SKUS}
                        />
                    );
                },
            },
        ];
    };
    return (
        <>
            <TableComponent
                loading={skusStore.loading}
                getColumnsConfig={() =>
                    getColumnsConfig({
                        handleUpdate: handleUpdateSkus,
                        handleDelete: handleDeleteSkus,
                    })
                }
                loadData={() => {}}
                observableName={skusStore.constructor.name}
                data={data || []}
                rowKey={(item: SkusResponseType) => item.id}
                scroll={{ y: "200px" }}
            />
        </>
    );
};
export default observer(VariantTable);
