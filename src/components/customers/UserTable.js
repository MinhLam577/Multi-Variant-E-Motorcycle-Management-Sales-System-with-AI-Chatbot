import { Button } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";
const getColumnsConfig = ({
  handleUpdateUser,
  handleViewUser,
  handleDeleteUser,
  handleResetPassword,
  hanleActivateUser,
}) => {
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
      title: "Địa chỉ nhận hàng",
      dataIndex: "address",
      key: "address",
      width: "140px",
      ellipsis: true,
    },
    {
      title: "Đơn gần nhất",
      dataIndex: "lastOrder",
      key: "lastOrder",
      width: "80px",
      ellipsis: true,
    },
    {
      title: "SL Đơn hàng",
      dataIndex: "quantity",
      key: "quantity",
      width: "80px",
      ellipsis: true,
    },
    {
      title: "Nợ phải thu",
      dataIndex: "debt",
      key: "debt",
      width: "80px",
      ellipsis: true,
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalSpent",
      key: "totalSpent",
      width: "80px",
      ellipsis: true,
    },
  ];
};

const CustomerTable = ({ globalFilters, handleUpdateUser, handleViewUser }) => {
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
            customer: "Khách hàng 1",
            phone: "123456789",
            address: "Địa chỉ 1",
            lastOrder: "Đơn gần nhất 1",
            quantity: 10,
            debt: 1000000,
            totalSpent: 5000000,
          },
          {
            customer: "Khách hàng 2",
            phone: "987654321",
            address: "Địa chỉ 2",
            lastOrder: "Đơn gần nhất 2",
            quantity: 20,
            debt: 2000000,
            totalSpent: 10000000,
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
CustomerTable.propTypes = {
  globalFilters: PropTypes.object,
  handleUpdateUser: PropTypes.func,
  handleViewUser: PropTypes.func,
};
export default CustomerTable;
