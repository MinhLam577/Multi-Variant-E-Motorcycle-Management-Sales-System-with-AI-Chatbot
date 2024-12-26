import { Button, Tag, message } from "antd";
import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { DateTimeFormat } from "../../constants";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";
import { ACTIVE_PRODUCT, GET_PRODUCTS_LIST, INACTIVE_PRODUCT, REMOVE_PRODUCT } from "../../graphql/products";
import * as moment from "moment";
import PropTypes from 'prop-types';
import { formatVNDMoney } from "../../utils";
import TableComponent from "../../containers/TableComponent";

const getColumnsConfig = ({
  handleEditProducts,
  handleViewProducts,
  handleStatusProducts,
  hanleDeleteProducts
}) => {
  return [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (value, item) => {
        return <Button type="link" className="custom-antd-btn-ellipsis-content !p-0" onClick={() => handleViewProducts(item)}>
          {value}
        </Button>;
      },
      ellipsis: true,
      width: '180px',
    },
    {
      title: 'Giá sản phẩm',
      dataIndex: 'prices',
      key: 'prices',
      render: (value) => {
        return <> {value?.map((i, x) => (<div key={x}>{i?.name} {i?.oneUnit} - {formatVNDMoney(i?.price)} đ</div>))} </>
      },
      ellipsis: true,
      width: '140px',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag className="uppercase" color={status === 'active'? '#87d068' : status === 'inactive' ? '#ff4d4f' : '#108ee9'}>{status}</Tag>,
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
          <EditOutlined className='ml-1' title="Chỉnh sửa" onClick={() => handleEditProducts(item)} />
          {
            item.status !== 'active'
              ?
              <EyeOutlined className='ml-1' title="Hiển thị" onClick={() => handleStatusProducts(item.productId, 'ACTIVE')} />
              :
              <EyeInvisibleOutlined className='ml-1' title="Ẩn" onClick={() => handleStatusProducts(item.productId, 'InACTIVE')} />
          }
          <DeleteOutlined className='ml-1' title="Xóa" onClick={() => hanleDeleteProducts(item.productId)} />

        </>
      },
      width: 100,
    },
  ];
}

const ProductsTable = ({ filterValue, handleEditProducts, handleViewProducts }) => {
  const [loadData, { data, loading, refetch }] = useLazyQuery(GET_PRODUCTS_LIST, { fetchPolicy: 'no-cache' });
  const [handleInActiveProduct] = useMutation(INACTIVE_PRODUCT, {
    onCompleted: () => {
      refetch();
      message.success('Ẩn sản phẩm thành công!');
    },
  });
  const [handleActiveProduct] = useMutation(ACTIVE_PRODUCT, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleStatusProducts = (id, status) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      status === 'ACTIVE' ? 'Bạn chắc chắn muốn hiển thị sản phẩm này?' : 'Bạn chắc chắn muốn ẩn sản phẩm này?'
    )(
      () => {
        if (status === 'ACTIVE') {
          handleActiveProduct({ variables: { id } });
        } else {
          handleInActiveProduct({ variables: { id } });
        }
      }
    );
  }

  const [removeProduct] = useMutation(REMOVE_PRODUCT, {
    onCompleted: (res) => {
      if (res?.removeProduct?.status) {
        refetch();
        message.success('Xóa sản phẩm thành công!');
      }
    },
  });
  const hanleDeleteProducts = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      'Bạn chắc chắn muốn xóa sản phẩm này?'
    )(
      () => removeProduct({ variables: { id } })
    );
  }
  return (
    <TableComponent 
      loading={loading}
      filtersInput='filters'
      getColumnsConfig={getColumnsConfig}
      filterValue={filterValue}
      loadData={loadData}
      data={data?.admin_getProductList}
      handleStatusProducts={handleStatusProducts}
      handleEditProducts={handleEditProducts}
      handleViewProducts={handleViewProducts}
      hanleDeleteProducts={hanleDeleteProducts}

    />
  );
};
ProductsTable.propTypes = {
  filterValue: PropTypes.object,
  handleEditProducts: PropTypes.func,
  handleViewProducts: PropTypes.func
};
export default ProductsTable;