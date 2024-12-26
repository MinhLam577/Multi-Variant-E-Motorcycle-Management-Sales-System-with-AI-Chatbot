import { useLazyQuery, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";

import { Button, DatePicker, Form, Input, Select } from "antd";
import { GET_ORDER_STATUSES, GET_ORDERS_NO } from "../../graphql/orders";
import { EnumOrderStatuses, UserRoleConstant } from "../../constants";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import PropTypes from 'prop-types';
import { debounce } from "lodash";
import { GET_USERS, SEARCH_USER } from "../../graphql/users";
import { GlobalContext } from "../../contexts/global";

const { RangePicker } = DatePicker;

const OrderSearch = ({ showStatus, setFilters }) => {
  const [form] = Form.useForm()
  const [getOrderStatuses, { data: orderStatuses }] = useLazyQuery(GET_ORDER_STATUSES);
  const [searchUser, { data }] = useLazyQuery(SEARCH_USER, { fetchPolicy: 'no-cache' });

  const { user } = useContext(GlobalContext);
  const [sales, setSales] = useState([]);
  const [loadData, {data: userRes}] = useLazyQuery(GET_USERS, { fetchPolicy: 'no-cache' });


  const { data: ordersNo } = useQuery(GET_ORDERS_NO, {variables: {filterOrderInput: {
    filters: {
      searchText: null, status: ['NEW'],
    }
  }}});

  const onFinish = (values) => {
    var obj = {};
    obj['searchText'] = values?.searchText;

    if (values?.status) {
      obj['status'] = [values.status];
    }
    if (values?.date) {
      obj['fromDate'] = moment(values?.date[0].toDate()).hours(0).minutes(0).seconds(1).toDate();
      obj['toDate'] = moment(values?.date[1].toDate()).hours(23).minutes(59).seconds(59).toDate();
    }
    if (values?.orderNos) {
      obj['orderNos'] = values.orderNos;
    }
    if (values?.saleId) {
      obj['salesId'] = values?.saleId;
    }

    setFilters(obj);
  }

  useEffect(() => {
    getOrderStatuses()
  }, [getOrderStatuses]);



  useEffect(() => {
    if (user?.role == UserRoleConstant.ADMIN) {
      loadData({variables: { filters: { filters: { role: UserRoleConstant.SALES }} }});
    }
  }, []);
  useEffect(() => {
    if (userRes?.users?.data) {
      setSales(userRes?.users?.data)
    }
  }, [userRes]);

  return <>
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ flex: '30%' }}
      labelWrap
      layout="vertical"
      className="flex flex-wrap gap-2 justify-between items-center"
    >
      <div className="flex justify-between w-full">
        <Form.Item
          label={
            <div className="font-bold">
            Mã đơn hàng
            </div>
          }
          name='orderNos'
          className="w-48"
        >
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
            placeholder='Chọn mã đơn hàng'
            mode="multiple"
            className="w-96"
          />
        </Form.Item>
        {
          showStatus
        &&
        <Form.Item
          label={
            <div className="font-bold">
              Trạng thái
            </div>
          }
          name='status'
          className="w-48"
        >
          <Select
            allowClear
            showSearch
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
        }
        <Form.Item
          label={
            <div className="font-bold">
            Từ ngày - Đến ngày
            </div>
          }
          name='date'
        >
          <RangePicker />
        </Form.Item>
        {
          user?.role === UserRoleConstant.ADMIN 
          &&
          <Form.Item
            label={
              <div className="font-bold">
                Sales
              </div>
            }
            name='saleId'
            className="w-48"
          >
            <Select 
              allowClear
              showSearch
              optionFilterProp="label"
              options={sales.map(item => {
                return {
                  label: item.fullname,
                  value: item.userId,
                }
              })}
              placeholder='Chọn sales'
            />
          </Form.Item>
        }
      </div>
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

OrderSearch.propTypes = {
  showStatus: PropTypes.bool,
  setFilters: PropTypes.func
};

export default OrderSearch;