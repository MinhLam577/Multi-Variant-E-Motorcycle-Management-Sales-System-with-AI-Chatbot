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
import Access from "../../access/access.tsx";
import { ALL_PERMISSIONS } from "../../constants/permissions";
const Vouchers = observer(() => {
    const [filteredVouchers, setFilteredVouchers] = useState([]);
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
    useEffect(() => {
        const { search, status, fixed, start_date, end_date } =
            globalFilters || {};

        const filtered = voucherStore.data?.filter((voucher) => {
            if (!voucher) return false;
            const matchSearch = search
                ? voucher?.voucher_name
                      ?.toLowerCase()
                      ?.includes(search.toLowerCase()) ||
                  voucher?.voucher_code
                      ?.toLowerCase()
                      ?.includes(search.toLowerCase())
                : true;

            const matchStatus = status ? voucher?.status === status : true;

            const matchFixed =
                fixed !== undefined && fixed !== ""
                    ? String(voucher?.fixed) === String(fixed)
                    : true;

            const matchStartDate = start_date
                ? new Date(voucher?.start_date) >= new Date(start_date)
                : true;

            const matchEndDate = end_date
                ? new Date(voucher?.end_date) <= new Date(end_date)
                : true;

            return (
                matchSearch &&
                matchStatus &&
                matchFixed &&
                matchStartDate &&
                matchEndDate
            );
        });

        setFilteredVouchers(filtered);
    }, [globalFilters, voucherStore.data]);

    return (
        <>
            <div className="flex justify-between items-start animate-slideDown flex-col gap-4 md:flex-row md:gap-0 md:items-center">
                <AdminBreadCrumb
                    description="Thông tin danh sách voucher"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
                <Access
                    permission={ALL_PERMISSIONS.VOURCHERS.CREATE}
                    hideChildren
                >
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
                </Access>
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
                                        data={filteredVouchers}
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
