import { Button, Table } from "antd";
import { AntdTableLocale } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { formatVNDMoney } from "../../../utils";
import PropTypes from 'prop-types';

const getColumnsConfig = ({
  handleViewProducts,
}) => {
  return [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (value, item) => {
        return <Button type="link" className="custom-antd-btn-ellipsis-content !p-0" onClick={() => typeof handleViewProducts === 'function' && handleViewProducts(item)}>
          {value}
        </Button>;
      },
      ellipsis: true,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      ellipsis: true,
      render: (value, item) => {
        return <div>
          {item.quantity * item.oneUnit} {item.unit}
        </div>;
      },
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (value) => {
        return formatVNDMoney(value) + "đ"
      },
      ellipsis: true,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (value) => {
        return formatVNDMoney(value) + "đ"
      },
      ellipsis: true,
    },
  ];
}

const OrderProductsTable = ({ data }) => {
  const navigate = useNavigate();
  const handleViewProducts = (item) => {
    navigate(`/products/${item.productId}`, { replace: true });
  };

  return (
    <>
      <div className="my-4 font-bold text-sm">Danh sách sản phẩm</div>
      <Table
        locale={{
          ...AntdTableLocale,
        }}
        columns={getColumnsConfig({
          handleViewProducts,
        })}
        tableLayout='auto'
        key={0}
        dataSource={data || []} 
        rowKey={'productId'}
        pagination={false}
      />
    </>
  );
};

OrderProductsTable.propTypes = {
  data: PropTypes.array,
};

export default OrderProductsTable;