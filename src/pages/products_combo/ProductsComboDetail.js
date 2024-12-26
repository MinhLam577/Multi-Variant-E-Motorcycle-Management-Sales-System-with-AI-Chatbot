import { CloseOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, InputNumber, Select, Space, message } from "antd";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_PRODUCTS_LIST } from "../../graphql/products";
import RichTextEditor from "../../containers/RichTextEditor";
import UploadSinglePictureGetUrl, { UploadSinglePictureGetUrlRemoteMode } from "../../containers/UploadSinglePictureGetUrl";
import PropTypes from 'prop-types';
import { GET_STORES_LIST } from "../../graphql/stores";
import { CREATE_PRODUCTCOMBO, GET_PRODUCTCOMBO, UPDATE_PRODUCTCOMBO } from "../../graphql/products_combo";
import { GET_CATEGORIES_LIST } from "../../graphql/categories";

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

const ProductsComboDetail = ({ mode }) => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [loadData, { loading }] = useLazyQuery(GET_PRODUCTCOMBO, {
    fetchPolicy: 'no-cache',
    onCompleted: res => {
      if (res?.getProductCombo) {
        prepareForm(res?.getProductCombo);
      }
      message.success('Tải chi tiết món ăn thành công!');
    },
  });
  const [getProducts, { data }] = useLazyQuery(GET_PRODUCTS_LIST, { fetchPolicy: 'no-cache' });
  const [getStores, { data: dataStores }] = useLazyQuery(GET_STORES_LIST, { fetchPolicy: 'no-cache' });
  const { data: dataCategories } = useQuery(GET_CATEGORIES_LIST);

  const [createProductCombo, { loading: creating }] = useMutation(CREATE_PRODUCTCOMBO, {
    onCompleted: res => {
      if (res?.createProductCombo?.status) {
        message.success('Tạo món ăn thành công!');
        navigate(`/combo_product`);
      }
    },
  });

  const [updateProductCombo, { loading: updating }] = useMutation(UPDATE_PRODUCTCOMBO, {
    onCompleted: res => {
      if (res?.updateProductCombo?.status) {
        message.success('Cập nhật món ăn thành công!');
        navigate(`/combo_product`);
      }
    },
  });


  const getCardTitle = () => {
    if (mode === ProductsDetailMode.View) {
      return 'Chi tiết món ăn';
    }
    else if (mode === ProductsDetailMode.Add) {
      return 'Tạo món ăn';
    }
    else if (mode === ProductsDetailMode.Edit) {
      return 'Chỉnh sửa món ăn';
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
        storeIds: loadedData.stores?.map(i => i?.storeId),
        categoryIds: loadedData.categories?.map(i => i?.categoryId),
        productComboItems: loadedData.productComboItems.map(o => ({ productId: o.productId, quantity: o.defaultQuantity }))
      });
    }
    else if (mode === ProductsDetailMode.Add) {
      form.resetFields();
    }
    else if (mode === ProductsDetailMode.Edit) {
      form.setFieldsValue({
        ...loadedData,
        storeIds: loadedData.stores?.map(i => i?.storeId),
        categoryIds: dataCategories.admin_categories?.map(i => i?.categoryId),
        productComboItems: loadedData.productComboItems.map(o => ({ productId: o.productId, quantity: o.defaultQuantity }))
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
        navigate(`/combo_product`);
      });
    }
    else {
      navigate('/combo_product');
    }
  };

  const handleEdit = () => {
    if (mode === ProductsDetailMode.View) {
      navigate(`/combo_product/${id}/edit`, { replace: true });
    }
  };

  const handleFormFinish = (values) => {
    const dto = {
      ...values
    };
    if (mode === ProductsDetailMode.Add) {
      createProductCombo({
        variables: {
          createProductComboInput: {
            ...dto,
            listImgUrl: fileList?.map(i => i?.url)
          }
        }
      });
      return;
    }

    if (mode === ProductsDetailMode.Edit) {
      updateProductCombo({
        variables: {
          updateProductInput: {
            ...dto,
            listImgUrl: fileList?.map(i => i?.url),
            productComboId: id
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
    getProducts({
      variables: {
        filters: {
          filters: {
            searchText: null
          }
        }
      }
    })
    getStores({
      variables: {
        filters: {
          filters: {
            searchText: null
          }
        }
      }
    })
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
            name="productComboId"
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
            label="Tên món ăn"
            name="name"
            rules={[{ required: true, message: 'Hãy nhập tên món ăn!' }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập tên món ăn" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="brief"
            rules={[{ required: true, message: 'Hãy nhập mô tả món ăn!' }]}
          >
            <Input maxLength={255} readOnly={isReadOnly()} placeholder="Nhập mô tả món ăn" />
          </Form.Item>
          <Form.Item
            className="custom-antd-richtext-editor mb-20"
            label="Nội dung"
            name="description"
            rules={[{ required: true, message: 'Hãy nhập nội dung món ăn!' }]}
          >
            <RichTextEditor className="h-[400px] mb-10" readOnly={isReadOnly()} />
          </Form.Item>
          <Form.List name="productComboItems" initialValue={[{ productId: '', quantity: 1 }]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex flex-wrap lg:w-3/4 gap-4 mb-2">
                    <Form.Item
                      {...restField}
                      name={[name, 'productId']}
                      rules={[{ required: true, message: 'Chọn sản phẩm' }]}
                      label='Sản phẩm'
                      className="w-full lg:w-6/12"
                    >
                      <Select
                        showSearch
                        allowClear
                        optionFilterProp="label"
                        options={data?.admin_getProductList?.data?.map(i => (
                          {
                            value: i?.productId,
                            label: i?.name
                          }
                        ))}
                        readOnly={isReadOnly()}
                        className="w-[200px]"
                        placeholder="Chọn sản phẩm"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'Nhập số lượng' }]}
                      label='Số lượng'
                      className="w-9/12 lg:w-4/12"
                    >
                      <InputNumber className="w-full" min={0} placeholder="Nhập số lượng" />
                    </Form.Item>
                    <MinusCircleOutlined className="w-1/12" onClick={() => remove(name)} />
                  </div>
                ))}
                <Form.Item>
                  <Button className="!w-36" type="primary" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            label="Cửa hàng"
            name="storeIds"
          >
            <Select
              allowClear
              optionFilterProp="label"
              mode="multiple"
              options={dataStores?.storesList?.data?.map(i => (
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
            label="Danh mục"
            name="categoryIds"
          >
            <Select
              allowClear
              optionFilterProp="label"
              mode="multiple"
              options={dataCategories?.admin_categories?.map(i => (
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
            label='Số lượng mua tối thiểu món ăn'
            name='minQuantity'
            rules={[{ required: true, message: 'Nhập số lượng mua tối thiểu món ăn' }]}
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

ProductsComboDetail.propTypes = {
  mode: PropTypes.number
};

export default ProductsComboDetail;