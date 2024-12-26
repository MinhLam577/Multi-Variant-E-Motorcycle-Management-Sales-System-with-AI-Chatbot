import PropTypes from 'prop-types';
import { Table } from "antd";

const getColumnsConfig = () => {
  return [
    {
      title: 'Tên nguyên liệu',
      dataIndex: 'productName',
      key: 'productName',
      width: '140px',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value, item)=> <div>{item.quantity*item.oneUnit} {item.unit}</div>,
      width: '100px',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'price',
      key: 'price',
      render: (value, item)=> <div>{item.oneUnit} {item.unit}</div>,
      width: '100px',
    },
  ];
}

function MaterialTable({ data, loading }) {
  return (
    <>
      <Table
        loading={loading}
        className='table-fixed's
        columns={getColumnsConfig()}
        dataSource={data}
        scroll={{x:400}}
      />
    </>
  );
}

MaterialTable.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool
};

export default MaterialTable;