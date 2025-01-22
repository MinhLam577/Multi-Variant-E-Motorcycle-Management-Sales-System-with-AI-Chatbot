import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";

const getColumnsConfig = ({
  handleEditProducts,
  handleViewProducts,
  hanleDeleteProducts,
}) => {
  return [
    {
      title: "Đơn vị",
      dataIndex: "name",
      key: "name",
      render: (value, item) => {
        return (
          <Button
            type="link"
            className="custom-antd-btn-ellipsis-content !p-0"
            onClick={() => handleViewProducts(item)}
          >
            {value}
          </Button>
        );
      },
      ellipsis: true,
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy) => <>{createdBy?.fullname}</>,
      sorter: true,
      ellipsis: true,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_value, item) => {
        return (
          <>
            <EditOutlined
              className="ml-1"
              title="Chỉnh sửa"
              onClick={() => handleEditProducts(item)}
            />
            <DeleteOutlined
              className="ml-1"
              title="Xóa"
              onClick={() => hanleDeleteProducts(item.productUnitId)}
            />
          </>
        );
      },
      width: 100,
    },
  ];
};

const ProductUnitsTable = ({ handleEditProducts, handleViewProducts }) => {
  const [loading] = useState(false);
  const hanleDeleteProducts = (id) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      "Bạn chắc chắn muốn xóa đơn vị này?"
    )(() => {});
  };
  return (
    <TableComponent
      loading={loading}
      filtersInput="filters"
      filterValue={null}
      getColumnsConfig={getColumnsConfig}
      loadData={() => {}}
      data={[]}
      handleEditProducts={handleEditProducts}
      handleViewProducts={handleViewProducts}
      hanleDeleteProducts={hanleDeleteProducts}
    />
  );
};
ProductUnitsTable.propTypes = {
  handleEditProducts: PropTypes.func,
  handleViewProducts: PropTypes.func,
};
export default ProductUnitsTable;
