import { Spin, Tabs } from "antd";
import { useParams } from "react-router";
import AddressUserTable from "../../components/users/detail/AddressUserTable";
import UserForm from "../../components/users/detail/UserForm";

const UserDetail = () => {
  const { id } = useParams();
  const userInfo = null;

  const items = [
    {
      key: "1",
      label: "Thông tin người dùng",
      children: (
        <div>
          <UserForm userBasicInfo={userInfo?.user} />
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
