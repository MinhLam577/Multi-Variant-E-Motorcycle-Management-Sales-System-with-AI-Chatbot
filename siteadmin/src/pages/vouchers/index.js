import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GlobalContext } from "../../contexts/global";
import VouchersTable from "../../components/vouchers/VouchersTable";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "../../containers/layout";
import CustomizeTab from "../../components/common/CustomizeTab";
import VoucherSearch from "../../components/vouchers/VoucherSearch";
const Vouchers = observer(() => {
    const navigate = useNavigate();
    const { globalDispatch } = useContext(GlobalContext);
    const store = useStore();
    const voucherStore = store.voucherObservable;
    const handleAddVouchers = () => {
        navigate("/vouchers/add", { replace: true });
    };
    const [globalFilters, setGlobalFilters] = useState({});
    useEffect(() => {
        const fetchData = () => {
            voucherStore.getListVoucher();
        };
        fetchData();
    }, []);

    const handleEditVouchers = (voucherData) => {
        globalDispatch({
            type: "breadcrum",
            data: voucherData.voucher_name,
        });
        navigate(`/vouchers/${voucherData.id}/edit`, {
            replace: true,
        });
    };

    const handleViewVouchers = (voucherData) => {
        globalDispatch({
            type: "breadcrum",
            data: voucherData.voucher_name,
        });
        navigate(`/vouchers/${voucherData.id}`, { replace: true });
    };
    useEffect(() => {}, [globalFilters]);
    return (
        <>
            <div className="flex justify-between items-center animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin danh sách voucher"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
                <div className="flex justify-end items-center">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddVouchers}
                        size="large"
                        className="!rounded-none"
                    >
                        Tạo mới
                    </Button>
                </div>
            </div>
            <div className="w-full my-6 flex flex-col gap-4 px-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả voucher",
                            children: (
                                <div className="w-full mt-2">
                                    <VoucherSearch
                                        setFilters={setGlobalFilters}
                                    />
                                    <VouchersTable
                                        data={voucherStore.data}
                                        handleEditVouchers={handleEditVouchers}
                                        handleViewVouchers={handleViewVouchers}
                                        voucherStore={voucherStore}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </>
    );
});
export default Vouchers;
