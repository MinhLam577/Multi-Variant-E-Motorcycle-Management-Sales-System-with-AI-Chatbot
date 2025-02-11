import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import CustomerSearch from "../../components/customers/CustomerSearch";
import CustomerTable from "../../components/customers/UserTable";
import { GlobalContext } from "../../contexts/global";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Customer = () => {
  const navigate = useNavigate();
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);

  const handleEditUser = (usersData) => {
    globalDispatch({
      type: "breadcrum",
      data: usersData.fullname,
    });
    navigate(`/users/${usersData.userId}/edit`, { replace: true });
  };

  const handleViewUser = (usersData) => {
    globalDispatch({
      type: "breadcrum",
      data: usersData.fullname,
    });
    navigate(`/users/${usersData.userId}`, { replace: true });
  };

  return (
    <>
      <CustomerSearch setFilters={setGlobalFilters} />
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
          Tạo mới
        </Button>
      </div>

      <CustomerTable
        globalFilters={globalFilters}
        handleUpdateUser={handleEditUser}
        handleViewUser={handleViewUser}
      />
    </>
  );
};

export default Customer;
