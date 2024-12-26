import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Tag } from "antd";
import PropTypes from "prop-types";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import TableComponent from "../../containers/TableComponent";

import { useEffect, useState } from "react";
import { getCars } from "../../api/cars";
import { formatVNDMoney } from "../../utils";

const getColumnsConfig = ({
  handleEditProducts,
  handleViewProducts,
  handleStatusProducts,
  hanleDeleteProducts,
}) => {
  return [
    // Product id
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      render: (value, item) => {
        return (
          <Button
            className="items-center justify-start p-0"
            type="link"
            onClick={() => handleViewProducts(item)}
          >
            <a className="custom-antd-btn-ellipsis-content !p-0 truncate max-w-[6ch] overflow-hidden whitespace-nowrap">
              {value}
            </a>
          </Button>
        );
      },
      ellipsis: true,
      width: "80px",
    },
    // Product name
    {
      title: "Tên xe",
      dataIndex: "title",
      key: "title",
      render: (value) => {
        return <div>{value}</div>;
      },
      ellipsis: true,
      width: "180px",
    },
    // Car Brand
    {
      title: "Hãng xe",
      dataIndex: "brand",
      key: "brand",
      render: (value) => {
        return (
          <div className="custom-antd-btn-ellipsis-content !p-0 truncate max-w-[16ch] overflow-hidden whitespace-nowrap">
            {value.name}
          </div>
        );
      },
      ellipsis: true,
      width: "120px",
    },
    // Car category
    {
      title: "Loại xe",
      dataIndex: "category",
      key: "category",
      render: (value) => {
        return (
          <>
            <div>{value.name}</div>
          </>
        );
      },
      ellipsis: true,
      width: "120px",
    },
    // Price
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (value) => {
        return (
          <>
            <div>{formatVNDMoney(value)} đ</div>
          </>
        );
      },
      ellipsis: true,
      width: "140px",
    },
    // Inventory
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (status) => <div>{status}</div>,
      ellipsis: true,
      width: "100px",
    },
    // Status
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (!status) return "-";
        return (
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
        );
      },
      ellipsis: false,
      width: "100px",
    },
    // Action
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_value, item) => {
        return (
          <div className="flex gap-x-3">
            <Button
              onClick={() => handleEditProducts(item)}
              icon={<EditOutlined title="Chỉnh sửa" />}
            />

            <Button
              icon={
                item.status !== "active" ? (
                  <EyeOutlined />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
              title={item.status !== "active" ? "Hiển thị" : "Ẩn"}
              onClick={() =>
                handleStatusProducts(
                  item.productId,
                  item.status !== "active" ? "ACTIVE" : "InACTIVE"
                )
              }
            />
            <Button
              icon={<DeleteOutlined />}
              title="Xóa"
              onClick={() => hanleDeleteProducts(item.productId)}
            />
          </div>
        );
      },
      width: 140,
    },
  ];
};

const ProductsTable = ({
  filterValue,
  handleEditProducts,
  handleViewProducts,
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const { data } = await getCars({ page: 1, size: 5 });
      setData(data);
    };
    fetchCars();
  }, []);

  const handleStatusProducts = (id, status) => {
    processWithModals(ProcessModalName.ConfirmCustomContent)(
      "Xác nhận",
      status === "ACTIVE"
        ? "Bạn chắc chắn muốn hiển thị sản phẩm này?"
        : "Bạn chắc chắn muốn ẩn sản phẩm này?"
    )(() => {
      if (status === "ACTIVE") {
        // handleActiveProduct({ variables: { id } });
      } else {
        // handleInActiveProduct({ variables: { id } });
      }
    });
  };

  // const [removeProduct] = useMutation(REMOVE_PRODUCT, {
  //   onCompleted: (res) => {
  //     if (res?.removeProduct?.status) {
  //       message.success("Xóa sản phẩm thành công!");
  //     }
  //   },
  // });
  const handleDeleteProducts = (id) => {
    // processWithModals(ProcessModalName.ConfirmCustomContent)(
    //   "Xác nhận",
    //   "Bạn chắc chắn muốn xóa sản phẩm này?"
    // )(() => removeProduct({ variables: { id } }));
  };

  return (
    <TableComponent
      filtersInput="filters"
      getColumnsConfig={getColumnsConfig}
      filterValue={filterValue}
      loadData={() => {}}
      data={data}
      handleStatusProducts={handleStatusProducts}
      handleEditProducts={handleEditProducts}
      handleViewProducts={handleViewProducts}
      handleDeleteProducts={handleDeleteProducts}
    />
  );
};

ProductsTable.propTypes = {
  filterValue: PropTypes.object,
  handleEditProducts: PropTypes.func,
  handleViewProducts: PropTypes.func,
};
export default ProductsTable;
