import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Select } from "antd";
import PropTypes from "prop-types";
import { EnumOrderStatuses } from "../../constants";

const { RangePicker } = DatePicker;

const StatisticSearch = ({ setFilters }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    var obj = {};

    if (values?.status) {
      obj["status"] = values.status;
    }
    if (values?.orderNos) {
      obj["orderNos"] = values.orderNos;
    }
    if (values?.salesId) {
      obj["salesId"] = values.salesId;
    }

    setFilters(obj);
  };

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        labelWrap
        layout="vertical"
        className="grid lg:grid-cols-4 gap-2 justify-between items-center mb-4"
      >
        <Form.Item
          label={<div className="font-bold">Trạng thái</div>}
          name="status"
        >
          <Select
            allowClear
            showSearch
            mode="multiple"
            placeholder="Chọn trạng thái đơn"
            optionFilterProp="label"
            options={[]?.map((i) => ({
              value: i.value,
              label: EnumOrderStatuses[i.text],
            }))}
          />
        </Form.Item>
        <Form.Item
          label={<div className="font-bold">Mã đơn hàng</div>}
          name="orderNos"
        >
          <Select
            allowClear
            showSearch
            mode="multiple"
            placeholder="Chọn mã đơm hàng"
            optionFilterProp="label"
            options={[]?.map((i) => ({
              value: i.orderNo,
              label: i.orderNo,
            }))}
          />
        </Form.Item>
        <Form.Item
          label={<div className="font-bold">Nhân viên sale</div>}
          name="salesId"
        >
          <Select
            allowClear
            showSearch
            placeholder="Chọn nhân viên sale"
            optionFilterProp="label"
            options={[]?.map((i) => ({
              value: i.userId,
              label: i.fullname,
            }))}
          />
        </Form.Item>

        <div>
          <Button
            type="primary"
            danger
            htmlType="reset"
            className="mt-1 mr-2"
            onClick={() => setFilters({ searchText: null })}
          >
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Tìm kiếm
          </Button>
        </div>
      </Form>
    </>
  );
};

StatisticSearch.propTypes = {
  setFilters: PropTypes.func,
};

export default StatisticSearch;
