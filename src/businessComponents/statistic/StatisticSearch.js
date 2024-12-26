import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect } from "react";

import { Button, DatePicker, Form, Select } from "antd";
import { GET_ORDER_STATUSES, GET_ORDERS_NO } from "../../graphql/orders";
import { EnumOrderStatuses } from "../../constants";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import PropTypes from 'prop-types';
import { GET_USERS } from "../../graphql/users";

const { RangePicker } = DatePicker;

const StatisticSearch = ({ setFilters }) => {
  const [form] = Form.useForm()
  const [getOrderStatuses, { data: orderStatuses }] = useLazyQuery(GET_ORDER_STATUSES);
  const { data: ordersNo } = useQuery(GET_ORDERS_NO, {variables: {filterOrderInput: {
    filters: {
      searchText: null
    }
  }}});
  const { data: sales } = useQuery(GET_USERS, {variables: {filters: {
    filters: {
      role: ['sales']
    }
  }}});
  const onFinish = (values) => {
    var obj = {};

    if (values?.status) {
      obj['status'] = values.status;
    }
    if (values?.orderNos) {
      obj['orderNos'] = values.orderNos;
    }
    if (values?.salesId) {
      obj['salesId'] = values.salesId;
    }

    setFilters(obj);
  }

  useEffect(() => {
    getOrderStatuses()
  }, [getOrderStatuses]);


  return <>
    <Form
      form={form}
      onFinish={onFinish}
      labelWrap
      layout="vertical"
      className="grid lg:grid-cols-4 gap-2 justify-between items-center mb-4"
    >
      <Form.Item
        label={
          <div className="font-bold">
              Trạng thái
          </div>
        }
        name='status'
      >
        <Select
          allowClear
          showSearch
          mode="multiple"
          placeholder='Chọn trạng thái đơn'
          optionFilterProp='label'
          options={orderStatuses?.getOrderStatuses?.map(i => (
            {
              value: i.value,
              label: EnumOrderStatuses[i.text]
            }
          ))}
        />
      </Form.Item>
      <Form.Item
        label={
          <div className="font-bold">
              Mã đơn hàng
          </div>
        }
        name='orderNos'
      >
        <Select
          allowClear
          showSearch
          mode="multiple"
          placeholder='Chọn mã đơm hàng'
          optionFilterProp='label'
          options={ordersNo?.orders?.data?.map(i=>(
            {
              value: i.orderNo,
              label: i.orderNo,
            }
          ))}
        />
      </Form.Item>
      <Form.Item
        label={
          <div className="font-bold">
              Nhân viên sale
          </div>
        }
        name='salesId'
      >
        <Select
          allowClear
          showSearch
          placeholder='Chọn nhân viên sale'
          optionFilterProp='label'
          options={sales?.users?.data?.map(i => (
            {
              value: i.userId,
              label: i.fullname
            }
          ))}
        />
      </Form.Item>

      {/* <Form.Item
        label={
          <div className="font-bold">
            Từ ngày - Đến ngày
          </div>
        }
        name='date'
      >
        <RangePicker />
      </Form.Item> */}
      <div>
        <Button
          type='primary'
          danger
          htmlType='reset'
          className="mt-1 mr-2"
          onClick={()=> setFilters({ searchText: null })}
        >
        Hủy
        </Button>
        <Button
          type='primary'
          htmlType='submit'
          icon={<SearchOutlined />}
        >
        Tìm kiếm
        </Button>
      </div>
    </Form>
  </>
};

StatisticSearch.propTypes = {
  setFilters: PropTypes.func
};

export default StatisticSearch;