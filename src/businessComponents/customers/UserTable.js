import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Tag, message } from "antd";
import {
  KeyOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import {
  ACTIVATE_USER,
  GET_USERS,
  REMOVE_USER,
  RESET_PASSWORD,
} from "../../graphql/users";
import * as moment from "moment";
import { DateTimeFormat, UserRoleConstant, UserType } from "../../constants";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
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

  const [resetPassword] = useMutation(RESET_PASSWORD, {
    // onCompleted: () => {
    //   message.success('Cài lại mật khẩu về mặc định thành công!');
    // },
  });
  const [removeUser] = useMutation(REMOVE_USER, {
    // onCompleted: () => {
    //   refetch();
    //   message.success('Ngưng hoạt động của người dùng thành công!');
    // },
  });
  const [activateUser] = useMutation(ACTIVATE_USER, {
    // onCompleted: (res) => {
    //   if (res?.activateUser) {
    //     refetch();
    //     message.success('Active người dùng thành công!');
    //   }
    // },
  });

  const handleResetPassword = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn cài lại mật khẩu của người dùng này về mặc định là ngày sinh (Ví dụ: ngày sinh 15/09/1990 thì mật khẩu là 15091990)?"
    )(() => resetPassword({ variables: { id } }));
  };

  const handleDeleteUser = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn có chắc chắn ngưng hoạt động của người dùng này?"
    )(() => removeUser({ variables: { id } }));
  };
  const hanleAddressUser = (item) => {
    navigate(`/users/${item}/address`, { replace: true });
  };

  const hanleActivateUser = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn active lại người dùng này ?"
    )(() => activateUser({ variables: { id } }));
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
