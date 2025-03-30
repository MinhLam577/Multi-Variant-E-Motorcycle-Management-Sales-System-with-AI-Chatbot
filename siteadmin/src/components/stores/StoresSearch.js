import { Button, Form, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { NewsStatusLabel } from "../../constants";

const StoresSearch = ({ setFilters }) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    var obj = {};
    obj["name"] = values?.searchText;

    if (values?.status !== undefined) {
      // nãy là nó sẽ chạy false
      // Kiểm tra cả `true` và `false`
      obj["active"] = values.status;
    }

    console.log(values);
    setFilters(obj);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ flex: "30%" }}
      labelWrap
      layout="vertical"
    >
      <div className="grid lg:grid-cols-4 gap-2 items-end">
        <Form.Item
          label={<div className="font-bold">Tên cửa hàng</div>}
          name="searchText"
        >
          <Input placeholder="Nhập tên cửa hàng" />
        </Form.Item>
        <Form.Item
          label={<div className="font-bold">Trạng thái</div>}
          name="status"
        >
          <Select
            allowClear
            optionFilterProp="label"
            options={Object.entries(NewsStatusLabel).map(([key, label]) => ({
              value: key === "true" ? true : false, // Đảm bảo nhận boolean
              label,
            }))}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            danger
            htmlType="reset"
            className="mr-1"
            onClick={() => setFilters({ searchText: null, status: null })}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            className="mt-1"
          >
            Tìm kiếm
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

StoresSearch.propTypes = {
  setFilters: PropTypes.func,
};

export default StoresSearch;
