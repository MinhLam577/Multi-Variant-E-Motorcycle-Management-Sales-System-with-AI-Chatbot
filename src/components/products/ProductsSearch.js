import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import { NewsStatusLabel } from "../../constants";

const ProductsSearch = ({ setFilters }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    let obj = {};
    obj["searchText"] = values?.searchText;

    if (values?.status) {
      obj["status"] = [values.status];
    }
    if (values?.categoryIds) {
      obj["categoryIds"] = values.categoryIds;
    }

    if (values?.storeId) {
      obj["storeId"] = values.storeId;
    }
    setFilters(obj);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ flex: "30%" }}
      labelWrap
      layout="vertical"
      className="flex justify-between items-center gap-4"
    >
      <div className="grid lg:grid-cols-5 gap-4 items-end">
        <Form.Item
          label={<div className="font-bold">Tên sản phẩm</div>}
          name="searchText"
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>
        <Form.Item
          label={<div className="font-bold">Trạng thái</div>}
          name="status"
        >
          <Select
            allowClear
            optionFilterProp="label"
            options={Object.keys(NewsStatusLabel).map((item) => {
              return {
                value: item,
                label: NewsStatusLabel[item],
              };
            })}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            danger
            htmlType="reset"
            className="mr-4"
            onClick={() => setFilters({ searchText: null })}
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

ProductsSearch.propTypes = {
  setFilters: PropTypes.func,
};

export default ProductsSearch;
