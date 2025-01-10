import { useQuery } from "@apollo/client";
import { Tabs, Spin } from "antd";
import { GET_USER } from "../../graphql/users";
import { useParams } from "react-router-dom";
import AddressUserTable from "../../businessComponents/users/detail/AddressUserTable";
import UserForm from "../../businessComponents/users/detail/UserForm";

const UserDetail = () => {
  const { id } = useParams();
  const { data: userInfo, loading, error, refetch } = useQuery(GET_USER, {
    variables: {
      id: id
    }
  });

  if (error) {
    return <div>Error!</div>
  }
  
  const items = [
    {
      key: '1',
      label: 'Thông tin người dùng',
      children: <div>
        <UserForm 
          userBasicInfo={userInfo?.user}
          refetch={refetch}
        />
      </div>
    },
    {
      key: '2',
      label: 'Quản lý địa chỉ',
      children: <AddressUserTable />,
    },
   
  ]
  return <div>
    <Spin tip="Loading... " spinning={loading}>
      <Tabs
        defaultActiveKey='1'
        items={items}
      />
    </Spin>
  </div>
};

UserDetail.propTypes = {
};

export default UserDetail;