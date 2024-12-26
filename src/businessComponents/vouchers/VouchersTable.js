import { Button, Tag, message } from "antd";
import { DateTimeFormat } from "../../constants";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";
import { useLazyQuery, useMutation } from "@apollo/client";
import moment from "moment";
import PropTypes from 'prop-types';
import TableComponent from "../../containers/TableComponent";
import { GET_VOUCHERS_LIST, REMOVE_VOUCHER } from "../../graphql/vouchers";

const getColumnsConfig = ({
  handleEditVouchers,
  handleViewVouchers,
  hanleDeleteVouchers,
}) => {
  return [
    {
      title: 'Mã giảm giá',
      dataIndex: 'discountCode',
      key: 'discountCode',
      render: (value, item) => {
        return <Button type="link" className="custom-antd-btn-ellipsis-content !p-0" onClick={() => handleViewVouchers(item)}>
          {value}
        </Button>;
      },
      ellipsis: true,
      width: '140px',
    },
    {
      title: 'Tên giảm giá',
      dataIndex: 'discountName',
      key: 'discountName',
      ellipsis: true,
      width: '140px',
    },
    {
      title: 'Loại giảm giá',
      dataIndex: 'discountType',
      key: 'discountType',
      ellipsis: true,
      width: '100px',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag className="uppercase" color={status === 'ACTIVE'? '#87d068' : status === 'INACTIVE' ? '#ff4d4f' : '#108ee9'}>{status}</Tag>,
      ellipsis: true,
      width: '100px',
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => moment(created_at).format(DateTimeFormat.TimeStamp),
      sorter: true,
      ellipsis: true,
      width: '140px',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_value, item) => {
        return <>
          <EditOutlined className='ml-1' title="Chỉnh sửa" onClick={() => handleEditVouchers(item)} />
          {/* {item?.isActive === true ?
            <EyeOutlined className='ml-1' title="Hiển thị"/>
            :   <EyeInvisibleOutlined className='ml-1' title="Ẩn" />
          } */}
          <DeleteOutlined className='ml-1' title="Xóa" onClick={() => hanleDeleteVouchers(item.discountId)} />
        </>;
      },
      width: 100,
    },
  ];
}

const VouchersTable = ({ handleEditVouchers, handleViewVouchers}) => {
  const [loadData, { data, loading, refetch }] = useLazyQuery(GET_VOUCHERS_LIST, { fetchPolicy: 'no-cache' });
  const [removeDiscount] = useMutation(REMOVE_VOUCHER, {
    onCompleted: (res) => {
      if (res?.removeDiscount?.status) {
        refetch();
        message.success('Xóa voucher thành công!');
      }
    },
  });

  const hanleDeleteVouchers = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      'Bạn chắc chắn muốn xóa voucher này?'
    )(
      () => removeDiscount({ variables: { id } })
    );
  }

  return (
    <>
      <TableComponent 
        loading={loading}
        filtersInput='filters'
        getColumnsConfig={getColumnsConfig}
        loadData={loadData}
        data={data?.admin_discounts}
        filterValue={null}
        handleEditVouchers={handleEditVouchers}
        handleViewVouchers={handleViewVouchers}
        hanleDeleteVouchers={hanleDeleteVouchers}
      />
    </>
  );
};

VouchersTable.propTypes = {
  handleEditVouchers: PropTypes.func, 
  handleViewVouchers: PropTypes.func
};

export default VouchersTable;