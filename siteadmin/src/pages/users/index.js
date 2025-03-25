import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UserTable from "../../components/users/UserTable";
import { GlobalContext } from "../../contexts/global";
import UserSearch from "../../components/users/UserSearch";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getListUser } from "../../api/user";

const User = () => {
  const navigate = useNavigate();
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);

  const [users, setUsers] = useState([]); // Lưu danh sách người dùng
  const [filteredUsers, setFilteredUsers] = useState([]); // Dữ liệu đã lọc
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handleEditUser = (usersData) => {
    console.log(usersData);
    globalDispatch({
      type: "breadcrum",
      data: usersData.fullname,
    });
    navigate(`/users/${usersData.userId}/edit`, { replace: true });
  };
  // Gọi API danh sách người dùng khi component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getListUser(1, 2);
        if (response.data) {
          setUsers(response.data); // Cập nhật dữ liệu vào state
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Lọc danh sách người dùng khi globalFilters thay đổi
  useEffect(() => {
    if (!globalFilters) return;

    setFilteredUsers(() => {
      let data = users;

      if (globalFilters.username) {
        const keyword = globalFilters.username.toLowerCase();
        data = data.filter((user) =>
          user.username.toLowerCase().includes(keyword)
        );
      }

      if (globalFilters.role?.length > 0) {
        data = data.filter((user) =>
          user.Roles?.some((userRole) =>
            globalFilters.role.some((role) => userRole.name.includes(role))
          )
        );
      }

      return data;
    });
  }, [globalFilters, users]); // Chỉ chạy khi bộ lọc hoặc danh sách người dùng thay đổi
  const handleViewUser = (usersData) => {
    console.log(usersData);
    globalDispatch({
      type: "breadcrum",
      data: usersData.username,
    });
    navigate(`/users/${usersData.id}`, { replace: true });
  };
  console.log("re-render");
  return (
    <>
      <UserSearch setFilters={setGlobalFilters} />
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
          Tạo mới
        </Button>
      </div>
      <UserTable
        data={filteredUsers}
        globalFilters={globalFilters}
        handleUpdateUser={handleEditUser}
        handleViewUser={handleViewUser}
      />
    </>
  );
};
//setFilters : search toàn cục

export default User;
