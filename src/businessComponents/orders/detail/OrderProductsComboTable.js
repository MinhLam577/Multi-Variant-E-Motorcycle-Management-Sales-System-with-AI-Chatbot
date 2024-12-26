import { Button, Table } from "antd";
import { AntdTableLocale } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { formatVNDMoney } from "../../../utils";
import PropTypes from 'prop-types';

const getColumnsConfig = ({
  handleViewProductsCombo,
}) => {
  return [
    {
      title: 'Tên món ăn',
      dataIndex: 'comboName',
      key: 'comboName',
      render: (value, item) => {
        return <Button type="link" className="custom-antd-btn-ellipsis-content !p-0" onClick={() => typeof handleViewProductsCombo === 'function' && handleViewProductsCombo(item)}>
          {value}
        </Button>;
      },
      ellipsis: true,
    },
    {
      title: 'SL người',
      dataIndex: 'numberPeople',
      key: 'numberPeople',
      ellipsis: true,
    },
    {
      title: 'Nguyên liệu',
      dataIndex: 'products',
      key: 'products',
      render: (value) => <>{value?.map(i=>i.productName).join(', ')}</>,
      ellipsis: true,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'comboPrice',
      key: 'comboPrice',
      render: (value) => {
        return formatVNDMoney(value) + "đ"
      },
      ellipsis: true,
    },
  ];
}

const OrderProductsComboTable = ({ data }) => {
  const navigate = useNavigate();
  const handleViewProductsCombo = (item) => {
    navigate(`/combo_product/${item.comboId}`, { replace: true });
  };
  const getColumnsConfigProducts = () => {
    return [
      {
        title: 'Tên nguyên liệu',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
        render: (value, item)=> <div>{item.quantity*item.oneUnit} {item.unit}</div>
      },
      {
        title: 'Đơn giá',
        dataIndex: 'price',
        key: 'price',
        render: (value, item)=> <div>{formatVNDMoney(item.price)}/{item.oneUnit} {item.unit}</div>
      },
      {
        title: 'Tổng giá',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        render: (totalPrice)=> <div>{formatVNDMoney(totalPrice)}</div>
  
      },
    ];
  }
  return (
    <>
      <div className="my-4 font-bold text-sm">Danh sách món ăn</div>
      <Table
        locale={{
          ...AntdTableLocale,
        }}
        columns={getColumnsConfig({
          handleViewProductsCombo
        })}
        tableLayout='auto'
        key={0}
        dataSource={data || []}
        rowKey={'comboId'}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => (
            <Table
              className='table-fixed's
              columns={getColumnsConfigProducts()}
              dataSource={record.products}
            />
          ),
        }}
      />
    </>
  );
};

OrderProductsComboTable.propTypes = {
  data: PropTypes.array,
};

export default OrderProductsComboTable;