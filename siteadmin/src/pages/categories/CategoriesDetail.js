import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, InputNumber, Select } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import UploadSinglePictureGetUrl, {
  UploadSinglePictureGetUrlRemoteMode,
} from "../../containers/UploadSinglePictureGetUrl";

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

  const [loading] = useState(false);

  const [form] = Form.useForm();

  const getCardTitle = () => {
    if (mode === CategoriesDetailMode.View) {
      return "Chi tiết danh mục";
    } else if (mode === CategoriesDetailMode.Add) {
      return "Tạo danh mục";
    } else if (mode === CategoriesDetailMode.Edit) {
      return "Chỉnh sửa danh mục";
    }
  };

  const getButtonOkText = () => {
    if (mode === CategoriesDetailMode.Add) {
      return (
        <>
          <PlusOutlined />
          &nbsp;Tạo
        </>
      );
    } else if (mode === CategoriesDetailMode.Edit) {
      return (
        <>
          <SaveOutlined />
          &nbsp;Lưu
        </>
      );
    }
  };

  const getButtonCancelText = () => {
    if (mode === CategoriesDetailMode.Add) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Hủy
        </>
      );
    } else if (mode === CategoriesDetailMode.Edit) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Hủy
        </>
      );
    } else if (mode === CategoriesDetailMode.View) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Đóng
        </>
      );
    }
  };

  const getButtonEditText = () => {
    if (mode === CategoriesDetailMode.View) {
      return (
        <>
          <EditOutlined />
          &nbsp;Sửa
        </>
      );
    }
  };

  const prepareForm = (loadedData) => {
    if (mode === CategoriesDetailMode.View) {
      form.setFieldsValue({
        ...loadedData,
      });
    } else if (mode === CategoriesDetailMode.Add) {
      form.resetFields();
    } else if (mode === CategoriesDetailMode.Edit) {
      form.setFieldsValue({
        ...loadedData,
      });
    }
  };

  const isReadOnly = () => {
    if (mode === CategoriesDetailMode.Add) {
      return false;
    } else if (mode === CategoriesDetailMode.Edit) {
      return false;
    }

    // mode === CategoriesDetailMode.View
    return true;
  };

  const handleOk = () => {
    if (mode === CategoriesDetailMode.Add) {
      form.submit();
    } else if (mode === CategoriesDetailMode.Edit) {
      form.submit();
    }
  };

  const handleCancel = () => {
    if (mode === CategoriesDetailMode.Edit) {
      processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
        navigate(`/categories`);
      });
    } else {
      navigate("/categories");
    }
  };

  const handleEdit = () => {
    if (mode === CategoriesDetailMode.View) {
      navigate(`/categories/${id}/edit`, { replace: true });
    }
  };

  const handleFormFinish = (values) => {
    const dto = {
      ...values,
    };
  };

  return (
    <>
      <Card loading={loading} title={getCardTitle()}>
        <Form
          form={form}
          {...formItemLayout}
          layout={"vertical"}
          autoComplete="off"
          onFinish={handleFormFinish}
        >
          <Form.Item
            className="flex justify-center"
            name="image"
            rules={[{ required: true, message: "Hãy chọn ảnh bìa!" }]}
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
            rules={[{ required: true, message: "Hãy nhập tên danh mục!" }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item label="Trạng thái" name="isActive">
            <Select
              allowClear
              optionFilterProp="label"
              options={[
                {
                  value: true,
                  label: "Hiển thị",
                },
                {
                  value: false,
                  label: "Không hiển thị",
                },
              ]}
              readOnly={isReadOnly()}
              placeholder="Chọn trạng thái"
            />
          </Form.Item>
          <Form.Item label="Màn hình" name="screen">
            <Select
              allowClear
              optionFilterProp="label"
              options={[
                {
                  value: "HOME",
                  label: "Trang chủ",
                },
                {
                  value: "PRODUCT",
                  label: "Sản phẩm",
                },
              ]}
              readOnly={isReadOnly()}
              placeholder="Chọn màn hình hiển thị"
            />
          </Form.Item>
          <Form.Item
            label="Số thứ tự"
            name="sequenceNo"
            rules={[{ required: true, message: "Hãy nhập số thứ tự!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              min={0}
              readOnly={isReadOnly()}
              placeholder="Nhập số thứ tự"
            />
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
      </Card>
    </>
  );
};

CategoriesDetail.propTypes = {
  mode: PropTypes.number,
};

export default CategoriesDetail;
