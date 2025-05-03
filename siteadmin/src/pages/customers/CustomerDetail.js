import { Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import UserForm from "../../components/customers/detail/UserForm";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import AddressCustomerTable from "../../components/users/detail/AddressUserTable";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "../../containers/layout/index";
const CustomerDetail = () => {
    const { id } = useParams();
    const [error] = useState(false);
    const [loading] = useState(false);

    const [userInfo, setUserInfo] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiClient.get(
                    endpoints.customers.details(id)
                );
                if (data) {
                    setUserInfo(data.data);
                } else {
                    setUserInfo([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);
    if (error) {
        return <div>Error!</div>;
    }

    const items = [
        {
            key: "1",
            label: "Thông tin người dùng",
            children: (
                <div>
                    <UserForm userBasicInfo={userInfo} refetch={() => {}} />
                </div>
            ),
        },
        {
            key: "2",
            label: "Quản lý địa chỉ",
            children: <AddressCustomerTable />,
        },
    ];
    return (
        <div>
            <Spin tip="Loading... " spinning={loading}>
                <div className="animate-slideDown">
                    <AdminBreadCrumb
                        description="Thông tin danh sách người dùng hệ thống"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />
                </div>
                <div className="w-full flex mt-6 flex-col gap-4 px-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                    <Tabs defaultActiveKey="1" items={items} />
                </div>
            </Spin>
        </div>
    );
};

CustomerDetail.propTypes = {};

export default CustomerDetail;
