import { CloseOutlined, EditOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, InputNumber, Select, message } from "antd";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CREATE_CATEGORY, GET_CATEGORY, UPDATE_CATEGORY } from "../../graphql/categories";
import { useLazyQuery, useMutation } from "@apollo/client";
import UploadSinglePictureGetUrl, { UploadSinglePictureGetUrlRemoteMode } from "../../containers/UploadSinglePictureGetUrl";
import PropTypes from 'prop-types';
import ProductsTable from "../../businessComponents/categories/detail/ProductsTable";

export const CategoriesDetailMode = {
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

const CategoriesDetail = ({ mode }) => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [loadData, { loading }] = useLazyQuery(GET_CATEGORY, {
    fetchPolicy: 'no-cache',
    onCompleted: res => {
      if (res?.admin_category) {
        prepareForm(res?.admin_category);
      }
      message.success('Tải chi tiết danh mục thành công!');
    },
  });
  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    onCompleted: res => {
      if (res?.createCategory?.status) {
        message.success('Tạo danh mục thành công!');
        navigate(`/categories`);
      }
    },
  });

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    onCompleted: res => {
      if (res?.updateCategory?.status) {
        message.success('Cập nhật danh mục thành công!');
        navigate(`/categories`);
      }
    },
  });

  const [form] = Form.useForm();

  const getCardTitle = () => {
    if (mode === CategoriesDetailMode.View) {
      return 'Chi tiết danh mục';
    }
    else if (mode === CategoriesDetailMode.Add) {
      return 'Tạo danh mục';
    }
    else if (mode === CategoriesDetailMode.Edit) {
      return 'Chỉnh sửa danh mục';
    }
  };

  const getButtonOkText = () => {
    if (mode === CategoriesDetailMode.Add) {
      return <>
        <PlusOutlined />&nbsp;Tạo
      </>;
    }
    else if (mode === CategoriesDetailMode.Edit) {
      return <>
        <SaveOutlined />&nbsp;Lưu
      </>;
    }
  };

  const getButtonCancelText = () => {
    if (mode === CategoriesDetailMode.Add) {
      return <>
        <CloseOutlined />&nbsp;Hủy
      </>;
    }
    else if (mode === CategoriesDetailMode.Edit) {
      return <>
        <CloseOutlined />&nbsp;Hủy
      </>;
    }
    else if (mode === CategoriesDetailMode.View) {
      return <>
        <CloseOutlined />&nbsp;Đóng
      </>;
    }
  };

  const getButtonEditText = () => {
    if (mode === CategoriesDetailMode.View) {
      return <>
        <EditOutlined />&nbsp;Sửa
      </>;
    }
  };

  const prepareForm = (loadedData) => {
    if (mode === CategoriesDetailMode.View) {
      form.setFieldsValue({
        ...loadedData
      });
    }
    else if (mode === CategoriesDetailMode.Add) {
      form.resetFields();
    }
    else if (mode === CategoriesDetailMode.Edit) {
      form.setFieldsValue({
        ...loadedData
      });
    }
  };

  const isReadOnly = () => {
    if (mode === CategoriesDetailMode.Add) {
      return false;
    }
    else if (mode === CategoriesDetailMode.Edit) {
      return false;
    }

    // mode === CategoriesDetailMode.View
    return true;
  };

  const handleOk = () => {
    if (mode === CategoriesDetailMode.Add) {
      form.submit();
    }
    else if (mode === CategoriesDetailMode.Edit) {
      form.submit();
    }
  };

  const handleCancel = () => {
    if (mode === CategoriesDetailMode.Edit) {
      processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
        navigate(`/categories`);
      });
    }
    else {
      navigate('/categories');
    }
  };

  const handleEdit = () => {
    if (mode === CategoriesDetailMode.View) {
      navigate(`/categories/${id}/edit`, { replace: true });
    }
  };

  const handleFormFinish = (values) => {
    const dto = {
      ...values
    };

    if (mode === CategoriesDetailMode.Add) {
      createCategory({
        variables: {
          createCategoryInput: {
            ...dto
          }
        }
      });
    }
    else if (mode === CategoriesDetailMode.Edit) {
      updateCategory({
        variables: {
          updateCategoryInput: {
            ...dto,
            categoryId: id
          }
        }
      });
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
            className="flex justify-center"
            name="image"
            rules={[{ required: true, message: 'Hãy chọn ảnh bìa!' }]}
          >
            <UploadSinglePictureGetUrl
              remoteMode={UploadSinglePictureGetUrlRemoteMode.Private}
              disabled={isReadOnly()}
              maxCount={1}
              fileList={fileList}
              setFileList={setFileList}
            />
          </Form.Item>
          <Form.Item
            label="Tên danh mục"
            name="categoryName"
            rules={[{ required: true, message: 'Hãy nhập tên danh mục!' }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="isActive"
          >
            <Select
              allowClear
              optionFilterProp="label"
              options={[
                {
                  value: true,
                  label: 'Hiển thị'
                },
                {
                  value: false,
                  label: 'Không hiển thị'
                }
              ]}
              readOnly={isReadOnly()}
              placeholder="Chọn trạng thái" />
          </Form.Item>
          <Form.Item
            label="Màn hình"
            name="screen"
          >
            <Select
              allowClear
              optionFilterProp="label"
              options={[
                {
                  value: 'HOME',
                  label: 'Trang chủ'
                },
                {
                  value: 'PRODUCT',
                  label: 'Sản phẩm'
                },
                {
                  value: 'PRODUCT_COMBO',
                  label: 'Món ăn'
                },
                {
                  value: 'SPICE',
                  label: 'Gia vị'
                },
              ]}
              readOnly={isReadOnly()}
              placeholder="Chọn màn hình hiển thị" />
          </Form.Item>
          <Form.Item
            label="Số thứ tự"
            name="sequenceNo"
            rules={[{ required: true, message: 'Hãy nhập số thứ tự!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              min={0} readOnly={isReadOnly()} placeholder="Nhập số thứ tự" />
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

CategoriesDetail.propTypes = {
  mode: PropTypes.number
};

export default CategoriesDetail;