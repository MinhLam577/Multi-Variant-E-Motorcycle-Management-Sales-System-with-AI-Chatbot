import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UserTable from "../../components/users/UserTable";
import { GlobalContext } from "../../contexts/global";
import UserSearch from "../../components/users/UserSearch";
import { Button } from "antd";
import {
  CloudUploadOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getListUser } from "../../api/user";
import { CSVLink } from "react-csv";
import UserImport from "../../components/users/UserImport";
import UserModalCreate from "../../components/users/UserModalCreate";

const User = () => {
  const navigate = useNavigate();
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);

  const [users, setUsers] = useState([]); // Lưu danh sách người dùng
  const [filteredUsers, setFilteredUsers] = useState([]); // Dữ liệu đã lọc
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [dataFile, setDataFile] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalImport, setOpenModalImport] = useState(false); // import user
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
    fetchUsers();
  }, []);

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

  // xử lý get Data với CSVLink
  const getUsers = (event, done) => {
    console.log(filteredUsers);
    const ListUser = filteredUsers.map((item) => ({
      id: item.id,
      username: item.username,
      email: item.email,
      age: item.age.toString(), // Chuyển số về string để tránh lỗi
      address: item.address,
      phoneNumber: item.phoneNumber?.toString() || "", // Đảm bảo là string
      avatarUrl: item.avatarUrl,
      birthday: item.birthday,
      isActive: item.isActive ? "TRUE" : "FALSE", // Chuyển boolean về string
      role: item?.Roles?.[0]?.name || "N/A", // Tránh lỗi undefined
    }));

    setDataFile(ListUser);
    done(true);
  };
  const headers = [
    { label: "ID", key: "id" },
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
    { label: "Age", key: "age" },
    { label: "Address", key: "address" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Avatar URL", key: "avatarUrl" },
    { label: "Birthday", key: "birthday" },
    { label: "Active Status", key: "isActive" },
    { label: "Role", key: "role" },
  ];

  // import data

  return (
    <>
      <UserSearch setFilters={setGlobalFilters} />
      <div className="flex justify-end mb-4">
        <Button
          icon={<CloudUploadOutlined />}
          type="primary"
          style={{
            backgroundColor: "green",
            borderColor: "green",
            marginRight: 8,
          }}
          onClick={() => setOpenModalImport(true)}
        >
          Import
        </Button>

        <CSVLink
          data={dataFile}
          filename={"danh-sach.csv"}
          asyncOnClick={true}
          onClick={getUsers}
          headers={headers}
        >
          <Button className="mr-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">
            <ExportOutlined />
            Export
          </Button>
        </CSVLink>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenModalCreate(true)}
        >
          Tạo mới
        </Button>
      </div>
      <UserTable
        data={filteredUsers}
        globalFilters={globalFilters}
        handleUpdateUser={handleEditUser}
        handleViewUser={handleViewUser}
      />

      <UserImport
        openModalImport={openModalImport}
        setOpenModalImport={setOpenModalImport}
      />

      <UserModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchUser={fetchUsers}
      />
    </>
  );
};
//setFilters : search toàn cục

export default User;
