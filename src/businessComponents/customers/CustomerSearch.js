import { Button, Form, Input, Select } from "antd";
import { UserRoleConstant } from "../../constants";
import { SearchOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../contexts/global";
import { useLazyQuery } from "@apollo/client";
import { GET_USERS } from "../../graphql/users";

const CustomerSearch = ({ setFilters }) => {
  const { user } = useContext(GlobalContext);
  const [sales, setSales] = useState([]);
  const [loadData, { data }] = useLazyQuery(GET_USERS, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (user?.role == UserRoleConstant.ADMIN) {
      loadData({
        variables: { filters: { filters: { role: UserRoleConstant.SALES } } },
      });
    }
  }, []);
  useEffect(() => {
    if (data?.users?.data) {
      setSales(data?.users?.data);
    }
  }, [data]);

  const onFinish = (values) => {
    var obj = {};
    obj["searchText"] = values?.searchText;

    if (values?.role) {
      obj["role"] = [values.role];
    }
    if (values?.saleId) {
      obj["saleId"] = values?.saleId;
    }

    setFilters(obj);
  };

  return (
    <>
      <Form
        onFinish={onFinish}
        labelWrap
        labelCol={{ flex: "30%" }}
        layout="vertical"
      >
        <div className="grid lg:grid-cols-4 gap-2 items-end">
          <Form.Item
            label={<div className="font-bold">Tên người dùng</div>}
            name="searchText"
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>

          {user?.role === UserRoleConstant.ADMIN && (
            <Form.Item
              label={<div className="font-bold">Sales</div>}
              name="saleId"
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                options={sales.map((item) => {
                  return {
                    label: item.fullname,
                    value: item.userId,
                  };
                })}
                placeholder="Chọn sales"
              />
            </Form.Item>
          )}

          <Form.Item>
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
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

CustomerSearch.propTypes = {
  setFilters: PropTypes.func,
};

export default CustomerSearch;
