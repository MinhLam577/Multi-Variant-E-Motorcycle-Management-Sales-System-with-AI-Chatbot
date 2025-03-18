import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { UserRoleConstant } from "../../constants";
import { GlobalContext } from "../../contexts/global";

const UserSearch = ({ setFilters }) => {
  const { user } = useContext(GlobalContext);
  const [sales, setSales] = useState([]);

  const onFinish = (values) => {
    var obj = {};
    obj["username"] = values?.searchText;

    if (values?.role) {
      obj["role"] = [values.role];
    }
    if (values?.saleId) {
      obj["saleId"] = values?.saleId;
    }
    setFilters(obj);
    console.log(obj);
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
          <Form.Item
            label={<div className="font-bold">Loại người dùng</div>}
            name="role"
          >
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              options={Object.keys(UserRoleConstant).map((item) => {
                return {
                  label: item,
                  value: UserRoleConstant[item],
                };
              })}
              placeholder="Chọn loại người dùng"
            />
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

UserSearch.propTypes = {
  setFilters: PropTypes.func,
};

export default UserSearch;
