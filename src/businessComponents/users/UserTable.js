import { Button } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";

const getColumnsConfig = ({ handleViewUser }) => {
  return [
    {
      title: "Họ tên",
      dataIndex: "customer",
      key: "customer",
      render: (value, item) => {
        return (
          <Button
            className="!p-0"
            type="link"
            onClick={() => handleViewUser(item)}
          >
            {value}
          </Button>
        );
      },
      width: "140px",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "140px",
      ellipsis: true,
    },

    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: "80px",
      ellipsis: true,
    },
  ];
};

const UserTable = ({ globalFilters, handleUpdateUser, handleViewUser }) => {
  const navigate = useNavigate();

  const handleResetPassword = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn cài lại mật khẩu của người dùng này về mặc định là ngày sinh (Ví dụ: ngày sinh 15/09/1990 thì mật khẩu là 15091990)?"
    )(() => {});
  };

  const handleDeleteUser = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn có chắc chắn ngưng hoạt động của người dùng này?"
    )(() => {});
  };
  const hanleAddressUser = (item) => {
    navigate(`/users/${item}/address`, { replace: true });
  };

  const hanleActivateUser = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn active lại người dùng này ?"
    )(() => {});
  };

  return (
    <>
      <TableComponent
        loading={false}
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        filterValue={globalFilters}
        loadData={() => {}}
        data={[
          {
            customer: "Nguyễn Văn A",
            phone: "123456789",
            role: "Quản lý cửa hàng",
          },
          {
            customer: "Nguyễn Văn B",
            phone: "987654321",
            role: "Nhân viên",
          },
          {
            customer: "Nguyễn Văn B",
            phone: "987654321",
            role: "Kế toán",
          },
        ]}
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
  handleViewUser: PropTypes.func,
};
export default UserTable;
