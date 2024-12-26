import { Button, Select, Table, Tag, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AntdTableLocale, AntdTablePagingLocale, DateTimeFormat } from "../../../constants";
import { useContext, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTCATEGORIES_LIST, GET_PRODUCTNAME_LIST, UPDATE_PRODUCT } from "../../../graphql/products";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
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
      title: 'No',
      key: 'index',
      render: (_value, _item, index) => index + (page - 1 < 0 ? 0 : page - 1) * pageSize + 1,
      width: 80,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (value, item) => {
        return <Button type="link" className="custom-antd-btn-ellipsis-content" onClick={() => handleViewProducts(item)}>
          {value}
        </Button>;
      },
      ellipsis: true,
    },
    {
      title: 'Tóm tắt',
      dataIndex: 'brief',
      key: 'brief',
      ellipsis: true,
    },
    {
      title: 'Danh mục',
      dataIndex: 'productCategories',
      key: 'productCategories',
      render: (value) => {
        return <> {value?.map((i,x)=>(<Tag key={x} color="#108ee9">{i?.category?.categoryName}</Tag>))} </>
      },
      ellipsis: true,
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => moment(created_at).format(DateTimeFormat.TimeStamp),
      sorter: true,
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_value, item) => {
        return <>
          <DeleteOutlined className='ml-1' title="Xóa sản phẩm ra khỏi danh mục" onClick={() => handleDeleteProducts(item)} />
        </>;
      },
      width: 100,
    },
  ];
}

const ProductsTable = () => {
  const [loadData, { data, loading, refetch }] = useLazyQuery(GET_PRODUCTCATEGORIES_LIST);
  const [getProducts, { data: dataProducts }] = useLazyQuery(GET_PRODUCTNAME_LIST);
  const { id } = useParams();
  const navigate = useNavigate();
  const { globalDispatch } = useContext(GlobalContext);
  const [product, setProduct] = useState()
  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: res => {
      if (res?.updateProduct?.status === true) {
        message.success('Cập nhật sản phẩm thành công!');
        refetch()
      }
    },
  });
  const [filters, setFilters] = useState({
    filters: {
      searchText: null,
      categoryId: id ? [id] : null
    },
    paging: {
      page: 1,
      pageSize: pageSizeOptions[0]
    },
    sorters: null,
  });

  const handleAddProduct = async() => {
    const existingItem = product?.productCategories?.find(item => item?.category?.categoryId === id);
    
    if(product) {
      const item = product?.productCategories?.map(item => item?.category?.categoryId)
      await updateProduct({
        variables: {
          updateProductInput: {
            categoryIds: existingItem ? item : [...item, id],
            productId: product?.productId,
            agencyPrice: product?.agencyPrice,
            retailPrice: product?.retailPrice,
            productName: product?.productName,
            brief: product?.brief,
            description: product?.description,
            listImgUrl: product?.listImgUrl
          }
        }
      });
    }

  }

  const handleViewProducts = (productsData) => {
    globalDispatch({
      type: 'breadcrum',
      data: productsData.productName
    });
    navigate(`/products/${productsData.productId}`, { replace: true });
  };
  const handleDeleteProducts = async(product) => {
    const newData = product?.productCategories;
    const index = [...newData].findIndex((item) => item?.category?.categoryId === id);
    
    if (index !== -1) {
      await updateProduct({
        variables: {
          updateProductInput: {
            categoryIds: index !== 0 ? newData.splice(index, 1)?.map(item => item?.category?.categoryId) : [],
            productId: product?.productId,
            agencyPrice: product?.agencyPrice,
            retailPrice: product?.retailPrice,
            productName: product?.productName,
            brief: product?.brief,
            description: product?.description,
            listImgUrl: product?.listImgUrl
          }
        }
      });
    }
  };

  useEffect(() => {
    if(id){
      loadData({
        variables: {
          filters: {
            ...filters,
          }
        }
      });
    }

    getProducts({
      variables: {
        filters: {
          filters: {
            searchText: null,
          },
        }
      }
    })
  }, [filters, loadData, getProducts]);

  useEffect(() => {
    setFilters(filters => ({
      ...filters,
      filters: {
        ...filters.filters,
      },
    }));
  }, []);

  return (
    <>
      <div className="flex justify-between my-4 gap-2">
        <h4 >Danh sách sản phẩm</h4> 
        <div className="flex">
          <h4>Thêm sản phẩm: </h4>
          <Select 
            allowClear
            showSearch
            optionFilterProp="label"
            options={dataProducts?.admin_products?.data?.map(i=>(
              {
                value: i.productId,
                label: i.productName,
                item: i
              }
            ))}
            onChange={ (value, option) => {
              setProduct(option?.item)           
            }}
            className="w-[200px] mx-2 h-8 mt-4"
          />
          <Button type="primary" className="mt-4" onClick={handleAddProduct}>OK</Button>
        </div>
      </div> 
      <Table
        locale={{
          ...AntdTableLocale,
        }}
        loading={loading}
        className='table-fixed'
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
          total: data?.admin_products?.total,
          locale: {
            ...AntdTablePagingLocale
          }
        }}
        onChange={(pagination, paramFilters, sorter) => {
          setFilters(filters => ({
            ...filters,
            paging: {
              page: pagination.current,
              pageSize: pagination.pageSize,
            },
            sorters: sorter?.field ?
              {
                [sorter?.field]: sorter?.order === 'ascend' ? 'asc'
                  : sorter?.order === 'descend' ? 'desc' : null
              } : null,
          }));
        }}
        dataSource={data?.admin_products?.data || []}
        rowKey={'productId'}
      />
    </>
  );
};

export default ProductsTable;