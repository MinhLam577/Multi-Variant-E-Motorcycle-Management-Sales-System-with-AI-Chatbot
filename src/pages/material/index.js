import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Form, Select } from "antd";
import { GET_ORDERS_MATERIAL, GET_ORDERS_NO } from "../../graphql/orders";
import MaterialTable from "../../businessComponents/material/MaterialTable";

export default function Material() {
  const [loadData, { data, loading }] = useLazyQuery(GET_ORDERS_MATERIAL, { fetchPolicy: 'no-cache' });
  const { data: ordersNo } = useQuery(GET_ORDERS_NO, {variables: {filterOrderInput: {
    filters: {
      searchText: null, status: ['CONFIRMED'],
    }
  }}});

  const handleSearchOrder = (value) => {
    console.log(value)
    loadData({
      variables: {
        getOrderMaterialInput: {
          orderNos: value.orderNos
        }
      }
    })
  }
  console.log(data)
  return (
    <main>
      <Form onFinish={handleSearchOrder} className="grid lg:grid-cols-2 gap-4 mb-12">
        <Form.Item name='orderNos'>
          <Select 
            allowClear
            showSearch
            optionFilterProp="label"
            options={ordersNo?.orders?.data?.map(i=>(
              {
                value: i.orderNo,
                label: i.orderNo,
              }
            ))}
            placeholder='Chọn đơn hàng'
            mode="multiple"
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" className="mr-1">Tìm kiếm</Button>
          <Button type="primary" htmlType="submit" danger>Hủy</Button>
        </Form.Item>
      </Form>
      <MaterialTable
        data={data?.getOrderMaterial}
        loading={loading}
      />
    </main>
  );
}