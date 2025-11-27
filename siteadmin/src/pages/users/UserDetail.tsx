import { Spin, Tabs } from "antd";
import { useParams } from "react-router";
import UserForm from "../../components/users/detail/UserForm";
import { useEffect } from "react";
import { useStore } from "@/stores";
import { observer } from "mobx-react-lite";
import AdminBreadCrumb from "@/components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "@/containers/layout";
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
                <div className="w-full my-6 flex flex-col px-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
            </Spin>
        </div>
    );
};

export default observer(UserDetail);
