import { Button, Form, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';
import { NewsStatusLabel } from "../../constants";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES_LIST } from "../../graphql/categories";
import { GET_STORES_LIST } from "../../graphql/stores";

const ProductsComboSearch = ({ setFilters }) => {
  const { data: dataCategories } = useQuery(GET_CATEGORIES_LIST);
  const { data: dataStories } = useQuery(GET_STORES_LIST, {
    variables: {
      filters: {
        filters: {
          searchText: null
        }
      }
    }
  });
  const onFinish = (values) => {
    var obj = {};
    obj['searchText'] = values?.searchText;
    
    if (values?.categoryIds) {
      obj['categoryIds'] = values.categoryIds;
    }

    if (values?.storeId) {
      obj['storeId'] = values.storeId;
    }

    if (values?.status) {
      obj['status'] = [values.status];
    }
    setFilters(obj);
  }

  return <Form
    onFinish={onFinish}
    labelWrap
    labelCol={{ flex: '30%' }}
    layout="vertical"
  >
    <div className="grid lg:grid-cols-4 gap-2">
      <Form.Item
        label={
          <div className="font-bold">
            Tên sản phẩm
          </div>
        }
        name='searchText'
      >
        <Input placeholder='Nhập tên sản phẩm' />
      </Form.Item>
      <Form.Item
        label={
          <div className="font-bold">
            Danh mục
          </div>
        }
        name='categoryIds'
      >
        <Select 
          allowClear
          showSearch
          mode="multiple"
          optionFilterProp="label"
          options={dataCategories?.admin_categories?.map(item => {
            return {
              value: item?.categoryId,
              label: item?.categoryName,
            }
          })}
          placeholder='Chọn danh mục' />
      </Form.Item>
      <Form.Item
        label={
          <div className="font-bold">
            Cửa hàng
          </div>
        }
        name='storeId'
      >
        <Select 
          allowClear
          showSearch
          optionFilterProp="label"
          options={dataStories?.storesList?.data?.map(item => {
            return {
              value: item?.storeId,
              label: item?.storeName,
            }
          })}
          placeholder='Chọn cửa hàng' />
      </Form.Item>
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
          optionFilterProp="label"
          options={Object.keys(NewsStatusLabel).map(item => {
            return {
              value: item,
              label: NewsStatusLabel[item],
            }
          })}
          placeholder='Chọn trạng thái' />
      </Form.Item>
      <Form.Item>
        <Button
          type='primary'
          danger
          htmlType='reset'
          className="mr-1"
          onClick={()=> setFilters({ searchText: null })}
        >
        Hủy
        </Button>
        <Button
          type='primary'
          htmlType='submit'
          icon={<SearchOutlined />}
          className="mt-1"
        >
        Tìm kiếm
        </Button>
      </Form.Item>
    </div>
  </Form>
};

ProductsComboSearch.propTypes = {
  setFilters: PropTypes.func
};

export default ProductsComboSearch;