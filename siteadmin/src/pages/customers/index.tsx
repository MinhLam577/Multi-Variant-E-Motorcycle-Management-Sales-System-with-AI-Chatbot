import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CustomerTable from "../../components/customers/UserTable";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import CustomerModalCreate from "../../components/customers/CustomerModalCreate";
import UserSearch from "../../components/users/UserSearch";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "src/containers/layout";
import CustomizeTab from "src/components/common/CustomizeTab";
import Access from "src/access/access";
import { ALL_PERMISSIONS } from "src/constants/permissions";

const Customer = () => {
  const navigate = useNavigate();
  const [globalFilters, setGlobalFilters] = useState({ search: null });
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openModalCreate, setOpenModalCreate] = useState(false);
  useEffect(() => {
    fetchCustomer();
  }, []);
  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(endpoints.customers.list("", ""));
      setOriginalData(response?.data?.result || []);
      setData(response?.data?.result || []);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false); // Luôn dừng loading dù có lỗi hay không
    }
  };
  // 🔍 Tìm kiếm ngay trên FE khi globalFilters thay đổi
  useEffect(() => {
    if (!globalFilters.search) {
      setData(originalData); // Nếu không có từ khóa, hiển thị toàn bộ dữ liệu
    } else {
      console.log(globalFilters.search);
      const filteredData = originalData.filter((item) =>
        item?.username
          .toLowerCase()
          .includes(globalFilters.search.toLowerCase())
      );
      setData(filteredData);
    }
  }, [globalFilters, originalData]); // Theo dõi cả filters và dữ liệu gốc

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
        <Access permission={ALL_PERMISSIONS.CUSTOMERS.CREATE} hideChildren>
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
                  <UserSearch setFilters={setGlobalFilters} />
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
