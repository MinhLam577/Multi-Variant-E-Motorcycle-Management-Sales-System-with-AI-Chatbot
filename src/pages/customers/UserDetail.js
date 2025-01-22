import { Spin, Tabs } from "antd";
import { useState } from "react";
import { useParams } from "react-router";
import AddressUserTable from "../../businessComponents/users/detail/AddressUserTable";
import UserForm from "../../businessComponents/users/detail/UserForm";

const UserDetail = () => {
  const { id } = useParams();
  const [error] = useState(false);
  const [loading] = useState(false);

  if (error) {
    return <div>Error!</div>;
  }

  const items = [
    {
      key: "1",
      label: "Thông tin người dùng",
      children: (
        <div>
          <UserForm userBasicInfo={null} refetch={() => {}} />
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

UserDetail.propTypes = {};

export default UserDetail;
