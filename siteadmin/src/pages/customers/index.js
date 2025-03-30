import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CustomerSearch from "../../components/customers/CustomerSearch";
import CustomerTable from "../../components/customers/UserTable";
import { GlobalContext } from "../../contexts/global";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints.ts";

const Customer = () => {
    const navigate = useNavigate();
    const [globalFilters, setGlobalFilters] = useState({ searchText: null });
    const [originalData, setOriginalData] = useState([]); // Lưu dữ liệu gốc
    const { globalDispatch } = useContext(GlobalContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(
                    endpoints.customers.list(1, 3)
                );
                console.log(response.data.result);
                setOriginalData(response?.data?.result || []); // Lưu dữ liệu gốc
                setData(response?.data?.result || []); // Đảm bảo dữ liệu hợp lệ
            } catch (error) {
                console.error("Error fetching customer data:", error);
            } finally {
                setLoading(false); // Luôn dừng loading dù có lỗi hay không
            }
        };

        fetchCustomer();
        console.log(globalFilters);
    }, []);
    // 🔍 Tìm kiếm ngay trên FE khi globalFilters thay đổi
    useEffect(() => {
        if (!globalFilters.searchText) {
            setData(originalData); // Nếu không có từ khóa, hiển thị toàn bộ dữ liệu
        } else {
            console.log(globalFilters.searchText);
            const filteredData = originalData.filter((item) =>
                item?.username
                    .toLowerCase()
                    .includes(globalFilters.searchText.toLowerCase())
            );
            console.log(filteredData);
            setData(filteredData);
        }
    }, [globalFilters, originalData]); // Theo dõi cả filters và dữ liệu gốc

    const handleEditUser = (usersData) => {
        globalDispatch({
            type: "breadcrum",
            data: usersData.username,
        });
        navigate(`/customer/${usersData.id}/edit`, { replace: true });
    };

    const handleViewUser = (usersData) => {
        globalDispatch({
            type: "breadcrum",
            data: usersData.username,
        });
        navigate(`/customer/${usersData.id}`, { replace: true });
    };

    return (
        <>
            <CustomerSearch setFilters={setGlobalFilters} />
            <div className="flex justify-end mb-4">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {}}
                >
                    Tạo mới
                </Button>
            </div>

            <CustomerTable
                data={data}
                loading={loading}
                globalFilters={globalFilters}
                handleUpdateUser={handleEditUser}
                handleViewUser={handleViewUser}
            />
        </>
    );
};

export default Customer;
