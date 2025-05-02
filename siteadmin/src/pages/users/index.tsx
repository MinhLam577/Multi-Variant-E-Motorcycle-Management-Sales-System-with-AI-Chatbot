import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import UserTable from "src/components/users/UserTable";
import { GlobalContext } from "../../contexts/global";
import UserSearch from "../../components/users/UserSearch";
import { Button, message } from "antd";
import {
    CloudUploadOutlined,
    ExportOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";
import UserImport from "../../components/users/UserImport";
import UserModalCreate from "../../components/users/UserModalCreate";
import dayjs from "dayjs";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "src/containers/layout";
import { paginationData } from "src/stores/voucher";
import {
    globalFiltersDataUserStaff,
    UserStaffResponseType,
} from "src/stores/user.store";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
const User = () => {
    const navigate = useNavigate();
    const store = useStore();
    const userStore = store.userStaffObservable;
    const [globalFilters, setGlobalFilters] =
        useState<globalFiltersDataUserStaff>(userStore.globalFilter);
    const { globalDispatch } = useContext<any>(GlobalContext);
    const [dataFile, setDataFile] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalImport, setOpenModalImport] = useState(false); // import user
    const handleEditUser = (usersData: UserStaffResponseType) => {
        globalDispatch({
            type: "breadcrum",
            data: usersData.username,
        });
        navigate(`/users/${usersData.id}/edit`);
    };
    // Gọi API danh sách người dùng khi component mount
    useEffect(() => {
        fetchUsers({
            ...userStore.pagination,
        });
    }, []);

    const fetchUsers = async (
        query: (globalFiltersDataUserStaff & paginationData) | string
    ) => {
        try {
            await userStore.getListUser(query);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
            store.setStatusMessage(
                500,
                "Có lỗi xảy ra khi lấy danh sách người dùng. Vui long thử lại sau.",
                "",
                false
            );
        }
    };
    // Lọc danh sách người dùng khi globalFilters thay đổi
    useEffect(() => {
        if (!globalFilters) return;
        fetchUsers({
            ...userStore.pagination,
            ...globalFilters,
        });
    }, [globalFilters]);
    const handleViewUser = (usersData: UserStaffResponseType) => {
        globalDispatch({
            type: "breadcrum",
            data: usersData.username,
        });
        navigate(`/users/${usersData.id}`, { replace: true });
    };

    // xử lý get Data với CSVLink
    const getUsers = (event, done) => {
        const ListUser = userStore.data.listData.map((item) => ({
            id: item.id,
            username: item.username,
            email: item.email,
            age: item.age,
            address: item.address,
            phoneNumber: item.phoneNumber || "",
            avatarUrl: item.avatarUrl,
            birthday: item.birthday
                ? dayjs(item.birthday).format("MM/DD/YYYY")
                : "", // Định dạng ngày
            isActive: item.isActive ? "TRUE" : "FALSE",
            role: item?.roles?.[0]?.name || "N/A",
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
            <div className="flex justify-between items-center animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin danh sách người dùng hệ thống"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
                <div className="flex justify-end items-center">
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
            </div>
            <div className="w-full my-6 flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <UserSearch setFilters={setGlobalFilters} />
                <UserTable
                    data={userStore.data.listData || []}
                    handleUpdateUser={handleEditUser}
                    handleViewUser={handleViewUser}
                />
                <UserImport
                    openModalImport={openModalImport}
                    setOpenModalImport={setOpenModalImport}
                    fetchUser={fetchUsers}
                />
                <UserModalCreate
                    openModalCreate={openModalCreate}
                    setOpenModalCreate={setOpenModalCreate}
                    fetchUser={fetchUsers}
                />
            </div>
        </>
    );
};

export default observer(User);
