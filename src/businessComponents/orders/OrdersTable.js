import { Button, Tag, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { DateTimeFormat, EnumOrderColorStatuses, EnumOrderStatuses } from "../../constants";
import moment from "moment";
import { formatVNDMoney } from "../../utils";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import TableComponent from "../../containers/TableComponent";

const handleCopy = (text) => {
  navigator.clipboard.writeText(text);
  message.info("Copied!!")
}
const getColumnsConfig = ({
  handleViewOrders,
  handleViewUser
}) => {
  return [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (value, item) => {
        return <Button
          type="link"
          className="custom-antd-btn-ellipsis-content !p-0"
          onClick={() => handleViewOrders(item)}
        >
          {value}
        </Button>;
      },
      width: 140
    },
    {
      title: 'Khách hàng',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy) => <>
        <div>
          <span
            className="cursor-pointer text-sky-500 font-semibold"
            onClick={() => { handleViewUser(createdBy.userId)}}
          >
            {createdBy?.fullname}{" "}
          </span>
        </div>
      </>,
      ellipsis: true,
      width: 140
    },
    {
      title: 'Thông tin nhận hàng',
      dataIndex: 'orderAddress',
      key: 'orderAddress',
      render: (orderAddress) => <>
        <div>
          <span className="font-semibold">Tên:</span>
          {" "}
          <span
            className="cursor-pointer"
            onClick={() => handleCopy(orderAddress?.receiverName)}
          >
            {orderAddress?.receiverName}{" "}<CopyOutlined />
          </span>
        </div>
        <div>
          <span className="font-semibold">SDT:</span>
          {" "}
          <span
            className="cursor-pointer"
            onClick={() => handleCopy(orderAddress.receiverPhone)}
          >
            {orderAddress?.receiverPhone} {" "}<CopyOutlined />
          </span>
        </div>
        {/* <div>
          <span className="font-semibold">DC:</span>
          {" "}
          <span
            className="cursor-pointer"
            onClick={() => handleCopy(orderAddress.street + ", " + orderAddress.ward + ", " + orderAddress.district + ", " + orderAddress.province)}
          >
            {orderAddress.street + ", " + orderAddress.ward + ", " + orderAddress.district + ", " + orderAddress.province}{" "}<CopyOutlined />
          </span>
        </div> */}
      </>,
      ellipsis: true,
      width: 150
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => <>{formatVNDMoney(totalPrice) + "đ"}</>,
      ellipsis: true,
      width: 120,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {

        return <>
          <Tag
            color={EnumOrderColorStatuses[status]}
          >
            {EnumOrderStatuses[status]}
          </Tag>
        </>
      },
      ellipsis: true,
      width: 150
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => moment(created_at).format(DateTimeFormat.TimeStamp),
      ellipsis: true,
      width: 120
    },
    // {
    //   title: '',
    //   dataIndex: 'action',
    //   key: 'action',
    //   render: (_value, item) => {
    //     return <>
    //       <EditOutlined 
    //         className='ml-1' 
    //         title="Chỉnh sửa" 
    //         onClick={() => handleViewOrders(item)} 
    //       />
    //     </>;
    //   },
    // },
  ];
}

const OrdersTable = ({ globalFilters, handleViewOrders, data, loadData, loading }) => {
  const navigate = useNavigate();

  const handleViewUser = (id) => {
    navigate(`/users/${id}`, { replace: true })
  }
  return (
    <>
      <TableComponent
        loading={loading}
        filtersInput='filterOrderInput'
        getColumnsConfig={getColumnsConfig}
        filterValue={globalFilters}
        loadData={loadData}
        data={data?.orders}
        handleViewOrders={handleViewOrders}
        handleViewUser={handleViewUser}
      />
    </>
  );
};

OrdersTable.propTypes = {
  globalFilters: PropTypes.object,
  handleViewOrders: PropTypes.func,
  data: PropTypes.object,
  loadData: PropTypes.func,
  loading: PropTypes.bool
};

export default OrdersTable;