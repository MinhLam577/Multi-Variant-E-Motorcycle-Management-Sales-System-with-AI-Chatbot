import { Button, Form, Select } from "antd";
import { useState } from "react";
import MaterialTable from "../../components/material/MaterialTable";

export default function Material() {
  const [loading, setLoading] = useState(false);

  const handleSearchOrder = (value) => {};
  return (
    <main>
      <Form
        onFinish={handleSearchOrder}
        className="grid lg:grid-cols-2 gap-4 mb-12"
      >
        <Form.Item name="orderNos">
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            options={[]}
            placeholder="Chọn đơn hàng"
            mode="multiple"
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" className="mr-1">
            Tìm kiếm
          </Button>
          <Button type="primary" htmlType="submit" danger>
            Hủy
          </Button>
        </Form.Item>
      </Form>
      <MaterialTable data={[]} loading={loading} />
    </main>
  );
}
