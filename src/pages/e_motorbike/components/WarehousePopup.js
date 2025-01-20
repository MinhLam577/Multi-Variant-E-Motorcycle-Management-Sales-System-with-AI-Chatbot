import { AutoComplete, Button, Checkbox, Input, Modal, Space } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

const { Search } = Input;

export const WarehousePopup = ({ isOpen, onOk, onCancel }) => {
  const [dataSource, setDataSource] = useState([]);
  const [isDefault, setIsDefault] = useState(false);
  const handleSearch = (value) => {
    if (!value) {
      setDataSource([]);
      return;
    }
    const newData = [
      { id: 1, name: "Kho Đà Nẵng", isDefault: false },
      { id: 2, name: "Kho Quảng Nam", isDefault: true },
    ]
      .filter((item) => item?.name.toLowerCase().includes(value.toLowerCase()))
      .map((item) => ({ value: item?.name }));
    setDataSource(newData);
  };

  return (
    <Modal
      title="Kho lưu trữ"
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      okText="Chọn"
      cancelText="Hủy"
      footer={[
        <Button key="submit" type="default" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="link" target="_blank" type="primary" onClick={onOk}>
          Chọn
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" className="w-full">
        <AutoComplete
          onSearch={handleSearch}
          placeholder="Tìm kho"
          optionLabelProp="value"
          options={dataSource}
          className="w-full"
        >
          <Search allowClear />
        </AutoComplete>

        {dataSource?.length > 0 && (
          <Checkbox onChange={() => setIsDefault(!isDefault)}>
            Đặt làm kho mặc định
          </Checkbox>
        )}
      </Space>
    </Modal>
  );
};

WarehousePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
