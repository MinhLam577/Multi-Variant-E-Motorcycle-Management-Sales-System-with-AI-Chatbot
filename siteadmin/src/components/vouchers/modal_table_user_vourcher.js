import React, { useState } from "react";
import { Table } from "antd";

const VoucherforCustomer = ({ columns, dataSource, rowSelection }) => {
  const [pageSize, setPageSize] = useState(5); // State để lưu số dòng hiển thị mỗi trang

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
      pagination={{
        pageSize: pageSize, // Số dòng hiển thị
        showSizeChanger: true, // Hiển thị tùy chọn chọn số dòng
        pageSizeOptions: ["5", "10", "20"], // Các tùy chọn số dòng
        onShowSizeChange: (_, size) => setPageSize(size), // Cập nhật số dòng khi chọn
      }}
    />
  );
};
export default VoucherforCustomer;
