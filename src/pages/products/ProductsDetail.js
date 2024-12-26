import { CloseOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, InputNumber, Select, Space, message } from "antd";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { CREATE_PRODUCT, GET_PRODUCT, UPDATE_PRODUCT } from "../../graphql/products";
import RichTextEditor from "../../containers/RichTextEditor";
import { GET_CATEGORIES_LIST } from "../../graphql/categories";
import UploadSinglePictureGetUrl, { UploadSinglePictureGetUrlRemoteMode } from "../../containers/UploadSinglePictureGetUrl";
import PropTypes from 'prop-types';
import { GET_STORES_LIST } from "../../graphql/stores";
import { GET_PRODUCT_UNITS } from "../../graphql/products_unit";

export const ProductsDetailMode = {
  View: 1,
  Add: 2,
  Edit: 3,
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
  },
};

const ProductsDetail = ({ mode }) => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [loadData, { loading }] = useLazyQuery(GET_PRODUCT, {
    fetchPolicy: 'no-cache',
    onCompleted: res => {
      if (res?.getProduct) {
        prepareForm(res?.getProduct);
      }
      message.success('Tải chi tiết sản phẩm thành công!');
    },
  });
  const [getCategories, { data }] = useLazyQuery(GET_CATEGORIES_LIST, { fetchPolicy: 'no-cache' });
  const [getStores, { data: dataStores }] = useLazyQuery(GET_STORES_LIST, { fetchPolicy: 'no-cache' });
  const [getProductUnits, { data: dataUnits }] = useLazyQuery(GET_PRODUCT_UNITS, { fetchPolicy: 'no-cache' });

  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    onCompleted: res => {
      if (res?.createProduct?.status) {
        message.success('Tạo sản phẩm thành công!');
        navigate(`/products`);
      }
    },
  });

  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: res => {
      if (res?.updateProduct?.status) {
        message.success('Cập nhật sản phẩm thành công!');
        navigate(`/products`);
      }
    },
  });


  const getCardTitle = () => {
    if (mode === ProductsDetailMode.View) {
      return 'Chi tiết sản phẩm';
    }
    else if (mode === ProductsDetailMode.Add) {
      return 'Tạo sản phẩm';
    }
    else if (mode === ProductsDetailMode.Edit) {
      return 'Chỉnh sửa sản phẩm';
    }
  };

  const getButtonOkText = () => {
    if (mode === ProductsDetailMode.Add) {
      return <>
        <PlusOutlined />&nbsp;Tạo
      </>;
    }
    else if (mode === ProductsDetailMode.Edit) {
      return <>
        <SaveOutlined />&nbsp;Lưu
      </>;
    }
  };

  const getButtonCancelText = () => {
    if (mode === ProductsDetailMode.Add) {
      return <>
        <CloseOutlined />&nbsp;Hủy
      </>;
    }
    else if (mode === ProductsDetailMode.Edit) {
      return <>
        <CloseOutlined />&nbsp;Hủy
      </>;
    }
    else if (mode === ProductsDetailMode.View) {
      return <>
        <CloseOutlined />&nbsp;Đóng
      </>;
    }
  };

  const getButtonEditText = () => {
    if (mode === ProductsDetailMode.View) {
      return <>
        <EditOutlined />&nbsp;Sửa
      </>;
    }
  };

  const prepareForm = (loadedData) => {
    if (mode === ProductsDetailMode.View) {
      form.setFieldsValue({
        ...loadedData,
        categoryIds: loadedData.categories?.map(i=>i?.categoryId),
        storeIds: loadedData.stores?.map(i=>i?.storeId),
        productPrices: loadedData.prices?.map(i=>({
          name: i.name,
          price: i. price,
          oneUnit: i.oneUnit
        })),
        unit: loadedData.unit
      });
    }
    else if (mode === ProductsDetailMode.Add) {
      form.resetFields();
    }
    else if (mode === ProductsDetailMode.Edit) {
      form.setFieldsValue({
        ...loadedData,
        categoryIds: loadedData.categories?.map(i=>i?.categoryId),
        storeIds: loadedData.stores?.map(i=>i?.storeId),
        productPrices: loadedData.prices?.map(i=>({
          name: i.name,
          price: i. price,
          oneUnit: i.oneUnit
        })),
        unit: loadedData.unit
      });
    }
  };

  const isReadOnly = () => {
    if (mode === ProductsDetailMode.Add) {
      return false;
    }
    else if (mode === ProductsDetailMode.Edit) {
      return false;
    }

    // mode === ProductsDetailMode.View
    return true;
  };

  const handleOk = () => {
    if (mode === ProductsDetailMode.Add) {
      form.submit();
    }
    else if (mode === ProductsDetailMode.Edit) {
      form.submit();
    }
  };

  const handleCancel = () => {
    if (mode === ProductsDetailMode.Edit) {
      processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
        navigate(`/products`);
      });
    }
    else {
      navigate('/products');
    }
  };

  const handleEdit = () => {
    if (mode === ProductsDetailMode.View) {
      navigate(`/products/${id}/edit`, { replace: true });
    }
  };

  const handleFormFinish = (values) => {
    const dto = {
      ...values
    };
    if (mode === ProductsDetailMode.Add) {
      createProduct({
        variables: {
          createProductInput: {
            ...dto,
            listImgUrl: fileList?.map(i=>i?.url)
          }
        }
      });
      return;
    }
    
    if (mode === ProductsDetailMode.Edit) {
      updateProduct({
        variables: {
          updateProductInput: {
            ...dto,
            listImgUrl: fileList?.map(i=>i?.url),
            productId: id
          }
        }
      });
      return;
    }
  };

  useEffect(() => {
    if (id) {
      loadData({
        variables: {
          id
        }
      });
    }
    getCategories()
    getStores({
      variables: {
        filters: {
          filters: {
            searchText: null       
          }
        }
      }
    })
    getProductUnits()
    // eslint-disable-next-line
  }, [id, mode]);

  return (
    <>
      <Card
        loading={loading || creating || updating}
        title={getCardTitle()}
      >
        <Form
          form={form}
          {...formItemLayout}
          layout={'vertical'}
          autoComplete="off"
          onFinish={handleFormFinish}
        >
          <Form.Item
            name="productId"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="flex justify-center"
            name="listImgUrl"
            // rules={[{ required: true, message: 'Hãy chọn ít nhất 1 ảnh!' }]}
          >
            <UploadSinglePictureGetUrl
              remoteMode={UploadSinglePictureGetUrlRemoteMode.Private}
              disabled={isReadOnly()}
              maxCount={5}
              fileList={fileList}
              setFileList={setFileList}
            />
          </Form.Item>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Hãy nhập tên sản phẩm!' }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập tên sản phẩm" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="brief"
            rules={[{ required: true, message: 'Hãy nhập mô tả sản phẩm!' }]}
          >
            <Input maxLength={255} readOnly={isReadOnly()} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>
          <Form.Item
            className="custom-antd-richtext-editor mb-20"
            label="Nội dung"
            name="description"
            rules={[{ required: true, message: 'Hãy nhập nội dung sản phẩm!' }]}
          >
            <RichTextEditor className="h-[400px] mb-10" readOnly={isReadOnly()} />
          </Form.Item>
          <div className="mb-2">Giá sản phẩm</div>
          <Form.List name="productPrices"  initialValue={[{ name: '', price: '', oneUnit: '' }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex flex-wrap gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Hãy nhập tên' }]}
                    >
                      <Input placeholder="Nhập tên" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'oneUnit']}
                      rules={[{ required: true, message: 'Nhập số lượng' }]}
                    >
                      <InputNumber min={0} placeholder="Số lượng" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'price']}
                      rules={[{ required: true, message: 'Hãy nhập giá' }]}
                      className="w-full lg:w-1/6"
                    >
                      <InputNumber min={0} placeholder="Giá 1 số lượng sản phẩm"
                        formatter={(value) => `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        className="w-full"
                      />
                    </Form.Item>
                    <MinusCircleOutlined className="mb-6" onClick={() => remove(name)} />
                  </div>
                ))}
                <Form.Item>
                  <Button className="!w-36" type="primary" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm giá
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            label="Danh mục"
            name="categoryIds"
          >
            <Select
              allowClear
              optionFilterProp="label"
              mode="multiple"
              options={data?.admin_categories?.map(i=>(
                {
                  value: i?.categoryId,
                  label: i?.categoryName
                }
              ))}
              readOnly={isReadOnly()}
              placeholder="Chọn danh mục" 
            />
          </Form.Item>
          <Form.Item
            label="Cửa hàng"
            name="storeIds"
          >
            <Select
              allowClear
              optionFilterProp="label"
              mode="multiple"
              options={dataStores?.storesList?.data?.map(i=>(
                {
                  value: i?.storeId,
                  label: i?.storeName
                }
              ))}
              readOnly={isReadOnly()}
              placeholder="Chọn cửa hàng" 
            />
          </Form.Item>
          <Form.Item
            label="Đơn vị"
            name="unit"
          >
            <Select
              allowClear
              optionFilterProp="label"
              options={dataUnits?.admin_productUnits?.map(i=>(
                {
                  value: i?.name,
                  label: i?.name
                }
              ))}
              readOnly={isReadOnly()}
              placeholder="Chọn đơn vị" 
            />
          </Form.Item>      
          <Form.Item
            label='Số lượng mua tối thiểu sản phẩm'
            name='minQuantity'
            rules={[{ required: true, message: 'Nhập số lượng mua tối thiểu sản phẩm' }]}
          >
            <InputNumber min={1} placeholder="Số lượng" />
          </Form.Item>
          <>
            <Button onClick={handleCancel}>{getButtonCancelText()}</Button>
            {isReadOnly() ? (
              <>
                <Divider type="vertical" />
                <Button onClick={handleEdit}>{getButtonEditText()}</Button>
              </>
            ) : (
              <>
                <Divider type="vertical" />
                <Button onClick={handleOk}>{getButtonOkText()}</Button>
              </>
            )}
          </>
        </Form>
      </Card >
    </>
  );
};

ProductsDetail.propTypes = {
  mode: PropTypes.number
};

export default ProductsDetail;