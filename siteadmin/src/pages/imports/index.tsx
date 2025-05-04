import {
    Button,
    Col,
    ConfigProvider,
    DatePicker,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Spin,
    Tooltip,
} from "antd";
import { Add, ArrowDown2 } from "iconsax-react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import CustomizeModal from "src/components/common/CustomizeModal";
import CustomizeTab from "src/components/common/CustomizeTab";
import ImportSearch from "src/components/imports/ImportSearch";
import ImportTable from "src/components/imports/ImportTable";
import { getBreadcrumbItems } from "src/containers/layout";
import { useStore } from "src/stores";
import { globalFiltersImportDataType } from "src/stores/imports.store";
import { paginationData } from "src/stores/voucher";

interface ImportPageProps {}
const ImportPage: React.FC<ImportPageProps> = () => {
    const [globalFilterImportData, setGlobalFilterImportData] =
        useState<globalFiltersImportDataType>({
            search: "",
            warehouse_id: "",
            start_date: "",
            end_date: "",
        });
    const store = useStore();
    const importStore = store.importObservable;
    const warehouseStore = store.warehouseObservable;
    const fetchImportData = async (
        query: globalFiltersImportDataType & paginationData
    ) => {
        await importStore.getListImports(query);
    };
    const fetchData = async () => {
        await Promise.all([
            fetchImportData({
                ...importStore.pagination,
            }),
            warehouseStore.getListWarehouse(),
        ]);
    };
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchImportData({
            ...importStore.pagination,
            ...globalFilterImportData,
        });
    }, [globalFilterImportData]);

    const [openModal, setOpenModal] = useState(false);
    const [typeModal, setTypeModal] = useState("add");
    const [createImportForm] = Form.useForm();
    const handleCloseModal = () => {
        setOpenModal(false);
        setTypeModal("add");
    };

    const handleOkModal = () => {
        setOpenModal(false);
        setTypeModal("add");
    };
    return (
        <section className="w-full flex flex-col">
            <div className="w-full flex flex-col animate-slideDown">
                <div className="flex justify-between items-center">
                    <AdminBreadCrumb
                        description="Thông tin chi tiết về danh sách các đợt nhập hàng"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />
                    <Button
                        type="primary"
                        size="large"
                        className="!rounded-none"
                        onClick={() => {
                            setOpenModal(true);
                            setTypeModal("add");
                        }}
                    >
                        Tạo phiếu nhập hàng
                    </Button>
                </div>
            </div>
            <div className="w-full mt-4 mb-6 flex flex-col gap-4 px-4 pb-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả đơn hàng",
                            children: (
                                <div className="w-full mt-2">
                                    <ImportSearch
                                        setFilters={setGlobalFilterImportData}
                                    />
                                    <ImportTable data={importStore.data} />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            <CustomizeModal
                okText="Lưu"
                cancelText="Hủy"
                handleCloseModal={handleCloseModal}
                handleSaveModal={handleOkModal}
                isOpen={openModal}
                key={typeModal}
                width={800}
                title="Tạo phiếu nhập hàng"
            >
                <Form
                    form={createImportForm}
                    layout="vertical"
                    labelWrap
                    className="w-full mt-2"
                    initialValues={{
                        warehouse_id: warehouseStore.data[0]?.id,
                        note: "",
                        start_date: "",
                        end_date: "",
                    }}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item
                                label="Kho hàng"
                                name="warehouse_id"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn kho hàng",
                                    },
                                ]}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    optionFilterProp="label"
                                    options={warehouseStore.data.map(
                                        (item) => ({
                                            label: item.name,
                                            value: item.id,
                                        })
                                    )}
                                    placeholder="Chọn kho hàng"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Ghi chú" name="note">
                                <Input.TextArea
                                    placeholder="Nhập ghi chú"
                                    autoSize={{ minRows: 6, maxRows: 6 }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </CustomizeModal>
        </section>
    );
};

export default observer(ImportPage);
