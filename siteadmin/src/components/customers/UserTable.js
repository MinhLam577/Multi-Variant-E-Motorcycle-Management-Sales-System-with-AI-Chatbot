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
      dataIndex: "username",
      key: "username",
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
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "140px",
      ellipsis: true,
    },
    {
      title: "Địa chỉ nhận hàng",
      dataIndex: "receive_address",
      key: "receive_address",
      width: "140px",
      ellipsis: true,
      render: (address) => {
        if (!Array.isArray(address) || address.length === 0) {
          return "Chưa có địa chỉ nhận hàng";
        }

        const findAddress =
          address.find((addr) => addr.is_default) || address[0];

        if (!findAddress) return "Chưa có địa chỉ nhận hàng";

        return (
          [
            findAddress?.street,
            findAddress?.ward,
            findAddress?.district,
            findAddress?.province,
          ]
            .filter(Boolean) // Loại bỏ các giá trị `undefined` hoặc `null`
            .join(" ") || "Chưa có địa chỉ nhận hàng"
        );
      },
    },

    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
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

const CustomerTable = ({
  globalFilters,
  handleUpdateUser,
  handleViewUser,
  data,
  loading,
}) => {
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
        loading={loading}
        filtersInput="filters"
        getColumnsConfig={getColumnsConfig}
        filterValue={globalFilters}
        loadData={() => {}}
        data={data}
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
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};
export default CustomerTable;
