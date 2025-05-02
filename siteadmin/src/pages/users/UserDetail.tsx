import { Spin, Tabs } from "antd";
import { useParams } from "react-router";
import AddressUserTable from "../../components/users/detail/AddressUserTable";
import UserForm from "../../components/users/detail/UserForm";
import { useEffect } from "react";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "src/containers/layout";
const UserDetail = () => {
    const { id } = useParams();
    const store = useStore();
    const userStore = store.userStaffObservable;
    useEffect(() => {
        const fetchUser = async () => {
            try {
                await userStore.getUserById(id);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    const items = [
        {
            key: "1",
            label: "Thông tin người dùng",
            children: (
                <div>
                    <UserForm userBasicInfo={userStore.data.detail} />
                </div>
            ),
        },
        {
            key: "2",
            label: "Quản lý địa chỉ",
            children: <AddressUserTable />,
        },
    ];
    return (
        <div>
            <Spin tip="Loading... " spinning={userStore.loading}>
                <div className="animate-slideDown">
                    <AdminBreadCrumb
                        description="Thông tin danh sách người dùng hệ thống"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />
                </div>
                <div className="w-full my-6 flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
            </Spin>
        </div>
    );
};

export default observer(UserDetail);
