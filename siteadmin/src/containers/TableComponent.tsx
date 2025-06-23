import { Table } from "antd";
import { AntdTableLocale, AntdTablePagingLocale } from "../constants";
import { convertSortFromAntToServer } from "../utils";
import React, { useEffect, useState } from "react";
import { useStore } from "../stores";
import { observer } from "mobx-react-lite";
const pageSizeOptions = [5, 10, 20, 30, 40, 50, 100];

interface ITableComponentProps {
    loading: boolean;
    getColumnsConfig: any;
    filterValue?: any;
    data: any;
    loadData?: any;
    pagination?: any;
    observableName?: string;
    [key: string]: any;
}

const TableComponent: React.FC<ITableComponentProps> = ({
    loading,
    getColumnsConfig,
    filterValue,
    data,
    loadData,
    pagination,
    observableName,
    ...res
}) => {
    const store = useStore();
    const storeKeys = Object.entries(store);
    const pageSize = store[observableName]?.pagination?.pageSize || 10;
    const [filters, setFilters] = useState({
        filters: {
            ...filterValue,
        },
        paging: {
            page: 1,
            pageSize: pageSize,
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
        storeKeys.forEach(([key, value]) => {
            if (
                store[key]?.setPagination &&
                value?.constructor?.name === observableName
            ) {
                value?.setPagination(
                    Number(pagination.current) || 1,
                    Number(pagination.pageSize) || 10
                );
            }
        });
    };

    return (
        <Table
            {...res}
            rowKey={(record) => record.id}
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

export default observer(TableComponent);
