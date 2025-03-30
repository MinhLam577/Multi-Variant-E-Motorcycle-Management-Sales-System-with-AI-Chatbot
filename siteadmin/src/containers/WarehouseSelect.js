import React from "react";
import { Select, Tag } from "antd";
import PropTypes from "prop-types";
// Hàm tùy chỉnh render tag
const tagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const colors = {
    "74f68f7c-a9a9-41ed-a5ec-132a93051abb": "gold",
    "a2b3c4d5-e6f7-48g9-h0i1-j2k3l4m5n6o7": "lime",
    "p8q9r0s1-t2u3-4v5w-x6y7-z8a9b0c1d2e3": "cyan",
  };
  const tagColor = colors[value] || "green";

  return (
    <Tag
      color={tagColor}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

// Component WarehouseSelect
const WarehouseSelect = ({ wareHouses = [], disabled = false, ...props }) => {
  // Chuyển đổi wareHouses thành options
  const options = wareHouses.map((warehouse) => ({
    value: warehouse.id, // Giá trị là id
    label: warehouse.name, // Hiển thị là name
  }));

  return (
    <Select
      mode="multiple"
      tagRender={tagRender}
      placeholder="Chọn kho"
      options={options}
      style={{ width: "100%" }}
      allowClear // Thêm khả năng xóa tất cả lựa chọn
      {...props} // Truyền tất cả props từ parent
      disabled={disabled} // Chặn người dùng chọn khi readOnly
    />
  );
};
WarehouseSelect.propTypes = {
  wareHouses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // id là chuỗi và bắt buộc
      name: PropTypes.string.isRequired, // name là chuỗi và bắt buộc
    })
  ), // wareHouses là mảng các object với id và name
  disabled: PropTypes.bool,
};

WarehouseSelect.defaultProps = {
  wareHouses: [], // Giá trị mặc định là mảng rỗng
};

export default WarehouseSelect;
