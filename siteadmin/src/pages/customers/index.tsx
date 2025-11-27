import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CustomerTable from "../../components/customers/UserTable";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import CustomerModalCreate from "../../components/customers/CustomerModalCreate";
import AdminBreadCrumb from "@/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "@/containers/layout";
import CustomizeTab from "@/components/common/CustomizeTab";
import Access from "@/access/access";
import { ALL_PERMISSIONS } from "@/constants/permissions";
import CustomerSearch from "@/components/customers/CustomerSearch";
import { GenderEnum } from "@/types/user-staff.type";
import { paginationData } from "@/stores/base";
import { convertDate, filterEmptyFields } from "@/utils";
import { DateTimeFormat } from "@/constants";
export enum SpendingEnumRange {
    BELOW_1M = "BELOW_1M",
    FROM_1M_TO_5M = "FROM_1M_TO_5M",
    FROM_5M_TO_20M = "FROM_5M_TO_20M",
    FROM_20M_TO_50M = "FROM_20M_TO_50M",
    ABOVE_50M = "ABOVE_50M",
}

export const getSpendingEnumRangeLabel = (range: SpendingEnumRange): string => {
    const labels = {
        [SpendingEnumRange.BELOW_1M]: "Dưới 1 triệu",
        [SpendingEnumRange.FROM_1M_TO_5M]: "Từ 1 triệu đến 5 triệu",
        [SpendingEnumRange.FROM_5M_TO_20M]: "Từ 5 triệu đến 20 triệu",
        [SpendingEnumRange.FROM_20M_TO_50M]: "Từ 20 triệu đến 50 triệu",
        [SpendingEnumRange.ABOVE_50M]: "Trên 50 triệu",
    };
    return labels[range];
};

export type globalFilterCustomerData = {
    search?: string;
    created_from?: string;
    created_to?: string;
    status?: boolean;
    gender?: GenderEnum;
    spending_range?: SpendingEnumRange;
};

const Customer = () => {
    const navigate = useNavigate();
    const [globalFilters, setGlobalFilters] = useState<
        globalFilterCustomerData & paginationData
    >({
        search: undefined,
        created_from: undefined,
        created_to: undefined,
        gender: undefined,
        spending_range: undefined,
        status: undefined,
        current: undefined,
        pageSize: undefined,
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    useEffect(() => {
        fetchCustomer();
    }, []);
    const validateQuery = (query?: string | object): string => {
        // Xử lý chuyển đổi query string thành object
        let parsedQuery: globalFilterCustomerData & paginationData = {
            ...(typeof query === "string"
                ? Object.fromEntries(new URLSearchParams(query.trim()))
                : query),
            current: 1,
            pageSize: 10,
        };

        // Gộp filters và xử lý dữ liệu
        const filters: paginationData & globalFilterCustomerData =
            filterEmptyFields({
                ...globalFilters,
                ...parsedQuery,
                created_from: parsedQuery?.created_from
                    ? convertDate(
                          parsedQuery.created_from,
                          DateTimeFormat.Date,
                          DateTimeFormat.TIME_STAMP_POSTGRES
                      )
                    : undefined,
                created_to: parsedQuery?.created_to
                    ? convertDate(
                          parsedQuery.created_to,
                          DateTimeFormat.Date,
                          DateTimeFormat.TIME_STAMP_POSTGRES
                      )
                    : undefined,
                search: parsedQuery?.search?.trim(),
            });

        // Tạo query string
        const queryString = new URLSearchParams(
            Object.fromEntries(
                Object.entries(filters).map(([key, value]) => [
                    key,
                    String(value),
                ])
            )
        ).toString();
        return queryString;
    };
    const fetchCustomer = async (
        query: globalFilterCustomerData & paginationData = {
            current: 1,
            pageSize: 10,
        }
    ) => {
        try {
            setLoading(true);
            const newQuery = validateQuery(query);
            const response = await apiClient.get(
                endpoints.customers.list(newQuery)
            );
            setData(response?.data?.result || []);
        } catch (error) {
            console.error("Error fetching customer data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCustomer(
            filterEmptyFields({
                ...globalFilters,
            })
        );
    }, [globalFilters]);

    const handleEditUser = (usersData) => {
        navigate(`/customer/${usersData.id}/edit`, { replace: true });
    };

    const handleViewUser = (usersData) => {
        navigate(`/customer/${usersData.id}`, { replace: true });
    };

    return (
        <>
            <div className="flex justify-between items-center animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin danh sách người dùng hệ thống"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
                <Access
                    permission={ALL_PERMISSIONS.CUSTOMERS.CREATE}
                    hideChildren
                >
                    <div className="flex justify-end items-center">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setOpenModalCreate(true);
                            }}
                            size="large"
                            className="!rounded-none"
                        >
                            Tạo mới
                        </Button>
                    </div>
                </Access>
            </div>
            <div className="w-full my-6 flex flex-col gap-4 px-4 pb-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả khách hàng",
                            children: (
                                <div className="w-full mt-2">
                                    <CustomerSearch
                                        setFilters={setGlobalFilters}
                                    />
                                    <CustomerTable
                                        data={data}
                                        loading={loading}
                                        globalFilters={globalFilters}
                                        handleUpdateUser={handleEditUser}
                                        handleViewUser={handleViewUser}
                                        fetchCustomer={fetchCustomer}
                                    />

                                    <CustomerModalCreate
                                        openModalCreate={openModalCreate}
                                        setOpenModalCreate={setOpenModalCreate}
                                        fetchUser={fetchCustomer}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </>
    );
};

export default Customer;
