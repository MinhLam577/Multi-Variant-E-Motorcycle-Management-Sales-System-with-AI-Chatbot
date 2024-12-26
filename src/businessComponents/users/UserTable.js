import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Tag, message } from "antd";
import { KeyOutlined, EditOutlined, DeleteOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { ACTIVATE_USER, GET_USERS, REMOVE_USER, RESET_PASSWORD } from "../../graphql/users";
import * as moment from "moment";
import { DateTimeFormat, UserRoleConstant, UserType } from "../../constants";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import TableComponent from "../../containers/TableComponent";

const getColumnsConfig = ({
  handleUpdateUser,
  handleViewUser,
  handleDeleteUser,
  handleResetPassword,
  hanleActivateUser
}) => {
  return [
    {
      title: 'Họ tên',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (value, item) => {
        return <Button className="!p-0" type="link" onClick={() => handleViewUser(item)}>
          {value}
        </Button>;
      },
      width: '140px'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: '140px',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag className="uppercase" color={status === 'active'? '#87d068' : status === 'inactive' ? '#ff4d4f' : '#108ee9'}>{status}</Tag>,
      width: '100px'
    },
    {
      title: 'Loại',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={role === 'user'? 'magenta' : role === 'sales'? 'orange': 'blue'}>{UserType[role]}</Tag>,
      width: '100px'
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => moment(created_at).format(DateTimeFormat.TimeStamp),
      sorter: true,
      width: '140px'
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_value, item) => {
        return <>
          <KeyOutlined className='ml-1' title="Cài lại mật khẩu" onClick={() => handleResetPassword(item.userId)} />
          <EditOutlined className='ml-1' title="Chỉnh sửa" onClick={() => handleUpdateUser(item)} />
          {item?.status === 'inactive' && <EyeInvisibleOutlined onClick={()=> hanleActivateUser(item.userId)} className='ml-1' title="Ẩn" />}
          {item?.role !== UserRoleConstant.ADMIN && item?.status !== 'inactive' && <>
            <DeleteOutlined className='ml-1' title="Xóa" onClick={() => handleDeleteUser(item.userId)} />
          </> }
   
        </>;
      },
      width: '100px'
    },
  ];
}

const UserTable = ({ globalFilters, handleUpdateUser, handleViewUser }) => {
  const navigate = useNavigate();
  
  const [loadData, { data, loading, refetch }] = useLazyQuery(GET_USERS, { fetchPolicy: 'no-cache' });

  const [resetPassword] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      message.success('Cài lại mật khẩu về mặc định thành công!');
    },
  });
  const [removeUser] = useMutation(REMOVE_USER, {
    onCompleted: () => {
      refetch();
      message.success('Ngưng hoạt động của người dùng thành công!');
    },
  });
  const [activateUser] = useMutation(ACTIVATE_USER, {
    onCompleted: (res) => {
      if (res?.activateUser) {
        refetch();
        message.success('Active người dùng thành công!');
      }
    },
  });

  const handleResetPassword = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      'Bạn chắc chắn muốn cài lại mật khẩu của người dùng này về mặc định là ngày sinh (Ví dụ: ngày sinh 15/09/1990 thì mật khẩu là 15091990)?'
    )(
      () => resetPassword({ variables: { id } })
    );
  }

  const handleDeleteUser = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      'Bạn có chắc chắn ngưng hoạt động của người dùng này?'
    )(
      () => removeUser({ variables: { id } })
    );
  }
  const hanleAddressUser = (item) => {
    navigate(`/users/${item}/address`, { replace: true });
  };

  const hanleActivateUser = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      'Bạn chắc chắn muốn active lại người dùng này ?'
    )(
      () => activateUser({ variables: { id } })
    );
  }

  return (
    <>
      <TableComponent
        loading={loading}
        filtersInput='filters'
        getColumnsConfig={getColumnsConfig}
        filterValue={globalFilters}
        loadData={loadData}
        data={data?.users}
        handleResetPassword={handleResetPassword}
        handleDeleteUser={handleDeleteUser}
        handleUpdateUser={handleUpdateUser}
        handleViewUser={handleViewUser}
        hanleActivateUser={hanleActivateUser}
        hanleAddressUser={hanleAddressUser}
      />
    </>
  );
};
UserTable.propTypes = {
  globalFilters: PropTypes.object,
  handleUpdateUser: PropTypes.func,
  handleViewUser: PropTypes.func
};
export default UserTable;