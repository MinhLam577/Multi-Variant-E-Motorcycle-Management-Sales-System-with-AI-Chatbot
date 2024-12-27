import { Table } from "antd";
import { AntdTableLocale, AntdTablePagingLocale } from "../constants";
import { convertSortFromAntToServer } from "../utils";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const pageSizeOptions = [10, 20, 30, 40, 50];

const TableComponent = ({
  loading,
  filtersInput,
  getColumnsConfig,
  filterValue,
  data,
  loadData,
  ...res
}) => {
  const [filters, setFilters] = useState({
    filters: {
      ...filterValue,
    },
    paging: {
      page: 1,
      pageSize: pageSizeOptions[0],
    },
    sorters: null,
  });

  useEffect(() => {
    loadData({
      variables: {
        [filtersInput]: {
          ...filters,
        },
      },
    });
  }, [filters, loadData]);

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

  return (
    <Table
      locale={{
        ...AntdTableLocale,
      }}
      loading={loading}
      columns={getColumnsConfig({
        page: filters?.paging?.page,
        pageSize: filters?.paging?.pageSize,
        ...res,
      })}
      key={0}
      pagination={{
        current: filters.paging.page,
        pageSize: filters.paging.pageSize,
        pageSizeOptions: pageSizeOptions,
        showSizeChanger: true,
        total: data?.total,
        locale: {
          ...AntdTablePagingLocale,
        },
      }}
      onChange={(pagination, paramFilters, sorter) => {
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
      }}
      dataSource={data?.data || data || []}
      scroll={{ x: 400 }}
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
};
export default TableComponent;
