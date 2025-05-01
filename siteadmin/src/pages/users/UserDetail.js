import { Spin, Tabs } from "antd";
import { useParams } from "react-router";
import AddressUserTable from "../../components/users/detail/AddressUserTable";
import UserForm from "../../components/users/detail/UserForm";
import { useEffect, useState } from "react";
import UserAPI from "../../api/user.api";
const UserDetail = () => {
    const [userInfo, setUserInfo] = useState(null);
    const { id } = useParams();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await UserAPI.getUserById(id);
                setUserInfo(data);
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
                    <UserForm userBasicInfo={userInfo} />
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
            <Spin tip="Loading... " spinning={false}>
                <Tabs defaultActiveKey="1" items={items} />
            </Spin>
        </div>
    );
};

UserDetail.propTypes = {};

export default UserDetail;
