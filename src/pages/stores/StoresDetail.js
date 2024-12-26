import { CloseOutlined, EditOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, Select, message } from "antd";
import { ProcessModalName, processWithModals } from "../../containers/processWithModals";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import PropTypes from 'prop-types';
import { CREATE_STORE, GET_STORE, UPDATE_STORE } from "../../graphql/stores";
import { NewsStatusLabel } from "../../constants";

export const StoresDetailMode = {
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

const StoresDetail = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadData, { loading }] = useLazyQuery(GET_STORE, {
    fetchPolicy: 'no-cache',
    onCompleted: res => {
      if (res?.getStore) {
        prepareForm(res?.getStore);
      }
      message.success('Tải chi tiết cửa hàng thành công!');
    },
  });

  const [createStores, { loading: creating }] = useMutation(CREATE_STORE, {
    onCompleted: res => {
      if (res?.createStore?.status) {
        message.success('Tạo cửa hàng thành công!');
        navigate(`/stores`);
      }
    },
  });

  const [updateStores, { loading: updating }] = useMutation(UPDATE_STORE, {
    onCompleted: res => {
      if (res?.updateStore?.status) {
        message.success('Cập nhật cửa hàng thành công!');
        navigate(`/stores`);
      }
    },
  });

  const [form] = Form.useForm();

  const getCardTitle = () => {
    if (mode === StoresDetailMode.View) {
      return 'Chi tiết cửa hàng';
    }
    else if (mode === StoresDetailMode.Add) {
      return 'Tạo cửa hàng';
    }
    else if (mode === StoresDetailMode.Edit) {
      return 'Chỉnh sửa cửa hàng';
    }
  };

  const getButtonOkText = () => {
    if (mode === StoresDetailMode.Add) {
      return <>
        <PlusOutlined />&nbsp;Tạo
      </>;
    }
    else if (mode === StoresDetailMode.Edit) {
      return <>
        <SaveOutlined />&nbsp;Lưu
      </>;
    }
  };

  const getButtonCancelText = () => {
    if (mode === StoresDetailMode.Add) {
      return <>
        <CloseOutlined />&nbsp;Hủy
      </>;
    }
    else if (mode === StoresDetailMode.Edit) {
      return <>
        <CloseOutlined />&nbsp;Hủy
      </>;
    }
    else if (mode === StoresDetailMode.View) {
      return <>
        <CloseOutlined />&nbsp;Đóng
      </>;
    }
  };

  const getButtonEditText = () => {
    if (mode === StoresDetailMode.View) {
      return <>
        <EditOutlined />&nbsp;Sửa
      </>;
    }
  };

  const prepareForm = (loadedData) => {
    if (mode === StoresDetailMode.View) {
      form.setFieldsValue({
        ...loadedData
      });
    }
    else if (mode === StoresDetailMode.Add) {
      form.resetFields();
    }
    else if (mode === StoresDetailMode.Edit) {
      form.setFieldsValue({
        ...loadedData
      });
    }
  };

  const isReadOnly = () => {
    if (mode === StoresDetailMode.Add) {
      return false;
    }
    else if (mode === StoresDetailMode.Edit) {
      return false;
    }

    // mode === StoresDetailMode.View
    return true;
  };

  const handleOk = () => {
    if (mode === StoresDetailMode.Add) {
      form.submit();
    }
    else if (mode === StoresDetailMode.Edit) {
      form.submit();
    }
  };

  const handleCancel = () => {
    if (mode === StoresDetailMode.Edit) {
      processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
        navigate(`/stores`);
      });
    }
    else {
      navigate('/stores');
    }
  };

  const handleEdit = () => {
    if (mode === StoresDetailMode.View) {
      navigate(`/stores/${id}/edit`, { replace: true });
    }
  };

  const handleFormFinish = (values) => {
    const dto = {
      ...values
    };
    if (mode === StoresDetailMode.Add) {
      createStores({
        variables: {
          createStoreInput: {
            ...dto,
            timeToDeliveryAfterHours: parseInt(dto.timeToDeliveryAfterHours)
          }
        }
      });
    }
    else if (mode === StoresDetailMode.Edit) {
      updateStores({
        variables: {
          updateStoreInput: {
            ...dto,
            timeToDeliveryAfterHours: parseInt(dto.timeToDeliveryAfterHours)
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
            name="storeId"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên cửa hàng"
            name="storeName"
            rules={[{ required: true, message: 'Hãy nhập tên cửa hàng!' }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập Tên cửa hàng" />
          </Form.Item>
          <Form.Item
            label="Mã cửa hàng"
            name="storeCode"
            rules={[{ required: true, message: 'Hãy nhập mã cửa hàng!' }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập Mã cửa hàng" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ cửa hàng"
            name="address"
            rules={[{ required: true, message: 'Hãy nhập địa chỉ cửa hàng!' }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập địa chỉ cửa hàng" />
          </Form.Item>

          <Form.Item
            label="Thời gian giao hàng (kể từ lúc đặt - tính theo giờ)"
            name="timeToDeliveryAfterHours"
            rules={[{ required: true, message: 'Hãy nhập thời gian!' }]}
          >
            <Input type="number" readOnly={isReadOnly()} placeholder="Nhập thời gian" />
          </Form.Item>

          {mode !== StoresDetailMode.Add ?
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Hãy chọn trạng thái!' }]}
            >
              <Select  disabled={isReadOnly()} options={Object.keys(NewsStatusLabel).map(item => {
                return {
                  value: item,
                  label: NewsStatusLabel[item],
                }
              })} placeholder="Nhập địa chỉ cửa hàng" optionFilterProp="label" />
            </Form.Item>
            : <></>
          }
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

StoresDetail.propTypes = {
  mode: PropTypes.number
};

export default StoresDetail;