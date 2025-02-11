import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Tag } from "antd";
import * as moment from "moment";
import PropTypes from "prop-types";
import { useState } from "react";
import { DateTimeFormat } from "../../constants";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";

const getColumnsConfig = ({
  handleEditProducts,
  handleViewProducts,
  handleStatusProducts,
  hanleDeleteProducts,
}) => {
  return [
    {
      title: "Tên món ăn",
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
      width: "240px",
    },
    {
      title: "Cửa hàng",
      dataIndex: "stores",
      key: "stores",
      render: (value) => {
        return (
          <>
            {" "}
            {value?.map((i, x) => (
              <Tag key={x} color="#108ee9">
                {i?.storeName}
              </Tag>
            ))}{" "}
          </>
        );
      },
      ellipsis: true,
      width: "140px",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          className="uppercase"
          color={
            status === "active"
              ? "#87d068"
              : status === "inactive"
              ? "#ff4d4f"
              : "#108ee9"
          }
        >
          {status}
        </Tag>
      ),
      ellipsis: true,
      width: "100px",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) =>
        moment(created_at).format(DateTimeFormat.TimeStamp),
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
            {item.status !== "active" ? (
              <EyeOutlined
                className="ml-1"
                title="Hiển thị"
                onClick={() =>
                  handleStatusProducts(item.productComboId, "ACTIVE")
                }
              />
            ) : (
              <EyeInvisibleOutlined
                className="ml-1"
                title="Ẩn"
                onClick={() =>
                  handleStatusProducts(item.productComboId, "InACTIVE")
                }
              />
            )}
            <DeleteOutlined
              className="ml-1"
              title="Xóa"
              onClick={() => hanleDeleteProducts(item.productComboId)}
            />
          </>
        );
      },
      width: 100,
    },
  ];
};

const ProductsComboTable = ({
  filterValue,
  handleEditProducts,
  handleViewProducts,
}) => {
  const [loading] = useState(false);
  const handleStatusProducts = (id, status) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      status === "ACTIVE"
        ? "Bạn chắc chắn muốn hiển thị món ăn này?"
        : "Bạn chắc chắn muốn ẩn món ăn này?"
    )(() => {});
  };

  const hanleDeleteProducts = (id) => {};
  return (
    <TableComponent
      loading={loading}
      filtersInput="filters"
      getColumnsConfig={getColumnsConfig}
      filterValue={filterValue}
      loadData={() => {}}
      data={[]}
      handleStatusProducts={handleStatusProducts}
      handleEditProducts={handleEditProducts}
      handleViewProducts={handleViewProducts}
      hanleDeleteProducts={hanleDeleteProducts}
    />
  );
};
ProductsComboTable.propTypes = {
  filterValue: PropTypes.object,
  handleEditProducts: PropTypes.func,
  handleViewProducts: PropTypes.func,
};
export default ProductsComboTable;
