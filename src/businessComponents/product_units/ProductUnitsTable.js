import { Button, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import PropTypes from 'prop-types';
import TableComponent from "../../containers/TableComponent";
import { GET_PRODUCT_UNITS, REMOVE_PRODUCT_UNIT } from "../../graphql/products_unit";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";

const getColumnsConfig = ({
  handleEditProducts,
  handleViewProducts,
  hanleDeleteProducts,
}) => {
  return [
    {
      title: 'Đơn vị',
      dataIndex: 'name',
      key: 'name',
      render: (value, item) => {
        return <Button type="link" className="custom-antd-btn-ellipsis-content !p-0" onClick={() => handleViewProducts(item)}>
          {value}
        </Button>;
      },
      ellipsis: true,
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy) => <>{createdBy?.fullname}</>,
      sorter: true,
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_value, item) => {
        return <>
          <EditOutlined className='ml-1' title="Chỉnh sửa" onClick={() => handleEditProducts(item)} />
          <DeleteOutlined className='ml-1' title="Xóa" onClick={() => hanleDeleteProducts(item.productUnitId)} />
        </>
      },
      width: 100,
    },
  ];
}

const ProductUnitsTable = ({ handleEditProducts, handleViewProducts }) => {
  const [loadData, { data, loading, refetch }] = useLazyQuery(GET_PRODUCT_UNITS, { fetchPolicy: 'no-cache' });
  const [removeProductUnit] = useMutation(REMOVE_PRODUCT_UNIT, {
    onCompleted: (res) => {
      if (res?.removeProductUnit?.status) {
        refetch();
        message.success('Xóa danh mục thành công!');
      }
    },
  });

  const hanleDeleteProducts = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      'Xác nhận',
      'Bạn chắc chắn muốn xóa đơn vị này?'
    )(
      () => removeProductUnit({ variables: { id } })
    );
  }
  return (
    <TableComponent 
      loading={loading}
      filtersInput='filters'
      filterValue={null}
      getColumnsConfig={getColumnsConfig}
      loadData={loadData}
      data={data?.admin_productUnits}
      handleEditProducts={handleEditProducts}
      handleViewProducts={handleViewProducts}
      hanleDeleteProducts={hanleDeleteProducts}
    />
  );
};
ProductUnitsTable.propTypes = {
  handleEditProducts: PropTypes.func,
  handleViewProducts: PropTypes.func
};
export default ProductUnitsTable;