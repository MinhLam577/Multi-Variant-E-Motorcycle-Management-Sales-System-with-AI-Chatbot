import { DeleteOutlined } from "@ant-design/icons";
import { Button, Select, Table, Tag } from "antd";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  AntdTableLocale,
  AntdTablePagingLocale,
  DateTimeFormat,
} from "../../../constants";
import { GlobalContext } from "../../../contexts/global";

const pageSizeOptions = [10, 20, 30, 40, 50];

const getColumnsConfig = ({
  page,
  pageSize,
  handleViewProducts,
  handleDeleteProducts,
}) => {
  return [
    {
      title: "No",
      key: "index",
      render: (_value, _item, index) =>
        index + (page - 1 < 0 ? 0 : page - 1) * pageSize + 1,
      width: 80,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (value, item) => {
        return (
          <Button
            type="link"
            className="custom-antd-btn-ellipsis-content"
            onClick={() => handleViewProducts(item)}
          >
            {value}
          </Button>
        );
      },
      ellipsis: true,
    },
    {
      title: "Tóm tắt",
      dataIndex: "brief",
      key: "brief",
      ellipsis: true,
    },
    {
      title: "Danh mục",
      dataIndex: "productCategories",
      key: "productCategories",
      render: (value) => {
        return (
          <>
            {" "}
            {value?.map((i, x) => (
              <Tag key={x} color="#108ee9">
                {i?.category?.categoryName}
              </Tag>
            ))}{" "}
          </>
        );
      },
      ellipsis: true,
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
            <DeleteOutlined
              className="ml-1"
              title="Xóa sản phẩm ra khỏi danh mục"
              onClick={() => handleDeleteProducts(item)}
            />
          </>
        );
      },
      width: 100,
    },
  ];
};

const ProductsTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { globalDispatch } = useContext(GlobalContext);
  const [product, setProduct] = useState();
  const [loading] = useState(false);
  const [filters, setFilters] = useState({
    filters: {
      searchText: null,
      categoryId: id ? [id] : null,
    },
    paging: {
      page: 1,
      pageSize: pageSizeOptions[0],
    },
    sorters: null,
  });

  const handleAddProduct = async () => {
    const existingItem = product?.productCategories?.find(
      (item) => item?.category?.categoryId === id
    );

    if (product) {
      const item = product?.productCategories?.map(
        (item) => item?.category?.categoryId
      );
    }
  };

  const handleViewProducts = (productsData) => {
    globalDispatch({
      type: "breadcrum",
      data: productsData.productName,
    });
    navigate(`/products/${productsData.productId}`, { replace: true });
  };
  const handleDeleteProducts = async (product) => {};

  useEffect(() => {
    setFilters((filters) => ({
      ...filters,
      filters: {
        ...filters.filters,
      },
    }));
  }, []);

  return (
    <>
      <div className="flex justify-between my-4 gap-2">
        <h4>Danh sách sản phẩm</h4>
        <div className="flex">
          <h4>Thêm sản phẩm: </h4>
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            options={[]?.data?.map((i) => ({
              value: i.productId,
              label: i.productName,
              item: i,
            }))}
            onChange={(value, option) => {
              setProduct(option?.item);
            }}
            className="w-[200px] mx-2 h-8 mt-4"
          />
          <Button type="primary" className="mt-4" onClick={handleAddProduct}>
            OK
          </Button>
        </div>
      </div>
      <Table
        locale={{
          ...AntdTableLocale,
        }}
        loading={loading}
        className="table-fixed"
        columns={getColumnsConfig({
          page: filters?.paging?.page,
          pageSize: filters?.paging?.pageSize,
          handleDeleteProducts,
          handleViewProducts,
        })}
        key={0}
        pagination={{
          current: filters.paging.page,
          pageSize: filters.paging.pageSize,
          pageSizeOptions: pageSizeOptions,
          showSizeChanger: true,
          total: []?.total,
          locale: {
            ...AntdTablePagingLocale,
          },
        }}
        onChange={(pagination, paramFilters, sorter) => {
          setFilters((filters) => ({
            ...filters,
            paging: {
              page: pagination.current,
              pageSize: pagination.pageSize,
            },
            sorters: sorter?.field
              ? {
                  [sorter?.field]:
                    sorter?.order === "ascend"
                      ? "asc"
                      : sorter?.order === "descend"
                      ? "desc"
                      : null,
                }
              : null,
          }));
        }}
        dataSource={[]}
        rowKey={"productId"}
      />
    </>
  );
};

export default ProductsTable;
