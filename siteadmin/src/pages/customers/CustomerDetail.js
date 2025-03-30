import { Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AddressUserTable from "../../components/users/detail/AddressUserTable";
import UserForm from "../../components/customers/detail/UserForm";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints.ts";

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
                console.log(data.data);
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
            children: <AddressUserTable />,
        },
    ];
    return (
        <div>
            <Spin tip="Loading... " spinning={loading}>
                <Tabs defaultActiveKey="1" items={items} />
            </Spin>
        </div>
    );
};

CustomerDetail.propTypes = {};

export default CustomerDetail;
