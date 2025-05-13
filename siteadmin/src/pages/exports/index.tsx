import { Button } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { al } from "react-router/dist/development/route-data-BL8ToWby";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import CustomizeTab from "src/components/common/CustomizeTab";
import ModalCreateExport from "src/components/exports/detail/ModalCreateExport";
import ModalUpdateExport from "src/components/exports/detail/ModalUpdateExport";
import ExportSearch from "src/components/exports/ExportSearch";
import ExportTable from "src/components/exports/ExportTable";
import { SelectType } from "src/components/products/detail/ModalCreateProduct/ModalCreateProduct";
import { getBreadcrumbItems } from "src/containers/layout";
import { useStore } from "src/stores";
import {
    CreateExportDto,
    ExportResponseType,
    globalFilterExportDataType,
} from "src/stores/exports.store";

interface ExportPageProps {}

const ExportPage: React.FC<ExportPageProps> = () => {
    const [globalFilterExportData, setGlobalFilterExportData] =
        useState<globalFilterExportDataType>({
            search: undefined,
            warehouse_id: undefined,
            start_date: undefined,
            end_date: undefined,
            product_id: undefined,
            skus_id: undefined,
        });
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const store = useStore();
    const productStore = store.productObservable;
    const warehouseStore = store.warehouseObservable;
    const exportStore = store.exportObservable;
    const orderStore = store.orderObservable;
    const paymentMethodStore = store.paymentMethodObservable;

    const [skusData, setSkusData] = useState<SelectType[]>([]);

    const fetchData = async () => {
        await Promise.all([
            productStore.getListProduct({
                ...productStore.pagination,
            }),
            orderStore.getOrderStatus(),
            warehouseStore.getListWarehouse(),
            exportStore.getListExport({
                ...exportStore.pagination,
            }),
            orderStore.getListOrder({
                ...orderStore.pagination,
            }),
            paymentMethodStore.getPaymentStatus(),
            paymentMethodStore.getMethods(),
        ]);
        getFullSelect();
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const products = productStore.data;
        if (products) {
            const productId = globalFilterExportData.product_id;
            let skus = [];
            if (productId) {
                skus = products.products.data
                    ?.filter((p) => p.products.id === productId)
                    .flatMap((item) => {
                        const sku = item.products.skus.map((item) => ({
                            label: item.name,
                            value: item.id,
                        }));
                        return sku;
                    });
            } else {
                skus = products.products.data?.flatMap((item) => {
                    const sku = item.products.skus.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }));
                    return sku;
                });
            }
            setSkusData(skus);
            if (!productId) {
                setGlobalFilterExportData((prev) => ({
                    ...prev,
                    skus_id: undefined,
                }));
            }
        }
    }, [globalFilterExportData.product_id]);

    const getProductSelect = () => {
        const products = productStore.data;
        if (!products) return [];
        const selectProducts = products.products.data?.map((item) => ({
            label: item.products.title,
            value: item.products.id,
        }));
        return selectProducts;
    };

    const getWarehouseSelect = () => {
        const warehouses = warehouseStore.data;
        if (!warehouses) return [];
        const selectWarehouses = warehouses?.map((item) => ({
            label: item.name as string,
            value: item.id as string,
        }));
        return selectWarehouses;
    };

    const getFullSelect = () => {
        const products = productStore.data;
        if (!products) return [];
        const skus = products.products.data?.flatMap((item) => {
            const sku = item.products.skus.map((item) => ({
                label: item.name,
                value: item.id,
            }));
            return sku;
        });
        setSkusData(skus);
    };

    const [exportSelected, setExportSelected] = useState<ExportResponseType>();
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const handleUpdateExportRecord = (item: ExportResponseType) => {
        setExportSelected(toJS(item));
        setOpenUpdateModal(true);
    };

    const handleDeleteImportRecord = (id: string) => {
        alert(id);
    };

    const handleSaveModalExport = async (
        createExportData: CreateExportDto
    ) => {};

    const handleCloseModalExport = () => {
        setOpenCreateModal(false);
    };

    const handleSaveUpdateExport = async () => {
        await exportStore.getListExport({
            ...exportStore.pagination,
        });
    };

    const handleCloseUpdateExport = () => {
        setExportSelected(undefined);
        setOpenUpdateModal(false);
    };

    return (
        <section className="w-full flex flex-col">
            <div className="w-full flex flex-col animate-slideDown">
                <div className="flex justify-between items-center">
                    <AdminBreadCrumb
                        description="Thông tin chi tiết về danh sách các đợt xuất hàng"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />
                    <Button
                        type="primary"
                        size="large"
                        className="!rounded-none"
                        onClick={() => {
                            setOpenCreateModal(true);
                        }}
                    >
                        Tạo phiếu xuất hàng
                    </Button>
                </div>
            </div>
            <div className="w-full mt-4 mb-6 flex flex-col gap-4 px-4 pb-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả phiếu xuất",
                            children: (
                                <div className="w-full mt-2">
                                    <ExportSearch
                                        setFilters={setGlobalFilterExportData}
                                        productsSelect={getProductSelect()}
                                        warehouseSelect={getWarehouseSelect()}
                                        skusSelect={skusData}
                                        globalFilterExportData={
                                            globalFilterExportData
                                        }
                                    />
                                    <ExportTable
                                        data={exportStore.data}
                                        handleUpdateExport={
                                            handleUpdateExportRecord
                                        }
                                        handleDeleteExport={
                                            handleDeleteImportRecord
                                        }
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            <ModalCreateExport
                onClose={handleCloseModalExport}
                open={openCreateModal}
                onSave={handleSaveModalExport}
            />

            <ModalUpdateExport
                open={openUpdateModal}
                onClose={handleCloseUpdateExport}
                onSubmit={handleSaveUpdateExport}
                exportSelected={exportSelected}
            />
        </section>
    );
};

export default observer(ExportPage);
