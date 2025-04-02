import { Table } from "antd";
import { AntdTableLocale, AntdTablePagingLocale } from "../constants";
import { convertSortFromAntToServer } from "../utils";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const pageSizeOptions = [5, 10, 20, 30, 40, 50, 100];

const TableComponent = ({
  loading,
  filtersInput,
  getColumnsConfig,
  filterValue,
  data,
  loadData,
  pagination,
  order_store,
  ...res
}) => {
  const [filters, setFilters] = useState({
    filters: {
      ...filterValue,
    },
    paging: {
      page: 1,
      pageSize: order_store?.pagination?.pageSize || 10,
    },
    sorters: null,
  });

  useEffect(() => {
    setFilters((filters) => ({
      ...filters,
      filters: {
        ...filters.filters,
        ...filterValue,
      },
    }));
  }, [filterValue]);

  const handleSort = (sortField, sortOrder) => {
    if (!sortField) {
      return null;
    }
    let sortValue = {};
    sortValue[sortField] = convertSortFromAntToServer(sortOrder);
    return sortValue;
  };

  const handleOnchange = (pagination, paramFilters, sorter) => {
    setFilters((filters) => ({
      ...filters,
      filters: {
        ...paramFilters,
        ...filterValue,
      },
      paging: {
        page: pagination.current,
        pageSize: pagination.pageSize,
      },
      sorters: handleSort(sorter.field, sorter.order),
    }));
    if (order_store) {
      order_store?.setPagination(pagination.current, pagination.pageSize);
    }
  };

  return (
    <Table
      {...res}
      locale={{
        ...AntdTableLocale,
      }}
      loading={order_store?.loading || loading}
      columns={getColumnsConfig({
        page: filters?.paging?.page,
        pageSize: filters?.paging?.pageSize,
        ...res,
      })}
      key={0}
      pagination={
        typeof res?.pagination === "boolean"
          ? res?.pagination
          : {
              current: filters.paging.page,
              pageSize: filters.paging.pageSize,
              pageSizeOptions: pageSizeOptions,
              showSizeChanger: true,
              total: data?.total,
              locale: {
                ...AntdTablePagingLocale,
              },
              ...pagination,
            }
      }
      onChange={handleOnchange}
      dataSource={data?.data || data || []}
      scroll={{ x: 200, ...res.scroll }}
    />
  );
};

TableComponent.propTypes = {
  loading: PropTypes.bool,
  filtersInput: PropTypes.string,
  getColumnsConfig: PropTypes.func,
  filterValue: PropTypes.object,
  data: PropTypes.object,
  loadData: PropTypes.func,
  pagination: PropTypes.any,
  order_store: PropTypes.object,
};
export default TableComponent;
