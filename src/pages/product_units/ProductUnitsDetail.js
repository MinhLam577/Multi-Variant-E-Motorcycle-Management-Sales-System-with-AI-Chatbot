import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Form, Input } from "antd";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";

export const ProductUnitsDetailMode = {
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

const ProductUnitsDetail = ({ mode }) => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const getCardTitle = () => {
    if (mode === ProductUnitsDetailMode.View) {
      return "Chi tiết đơn vị";
    } else if (mode === ProductUnitsDetailMode.Add) {
      return "Tạo đơn vị";
    } else if (mode === ProductUnitsDetailMode.Edit) {
      return "Chỉnh sửa đơn vị";
    }
  };

  const getButtonOkText = () => {
    if (mode === ProductUnitsDetailMode.Add) {
      return (
        <>
          <PlusOutlined />
          &nbsp;Tạo
        </>
      );
    } else if (mode === ProductUnitsDetailMode.Edit) {
      return (
        <>
          <SaveOutlined />
          &nbsp;Lưu
        </>
      );
    }
  };

  const getButtonCancelText = () => {
    if (mode === ProductUnitsDetailMode.Add) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Hủy
        </>
      );
    } else if (mode === ProductUnitsDetailMode.Edit) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Hủy
        </>
      );
    } else if (mode === ProductUnitsDetailMode.View) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Đóng
        </>
      );
    }
  };

  const getButtonEditText = () => {
    if (mode === ProductUnitsDetailMode.View) {
      return (
        <>
          <EditOutlined />
          &nbsp;Sửa
        </>
      );
    }
  };

  const prepareForm = (loadedData) => {
    if (mode === ProductUnitsDetailMode.View) {
      form.setFieldsValue({
        ...loadedData,
        categoryIds: loadedData.categories?.map((i) => i?.categoryId),
        storeIds: loadedData.stores?.map((i) => i?.storeId),
        productPrices: loadedData.prices?.map((i) => ({
          name: i.name,
          price: i.price,
        })),
      });
    } else if (mode === ProductUnitsDetailMode.Add) {
      form.resetFields();
    } else if (mode === ProductUnitsDetailMode.Edit) {
      form.setFieldsValue({
        ...loadedData,
        categoryIds: loadedData.productCategories?.map((i) => i.categoryId),
      });
    }
  };

  const isReadOnly = () => {
    if (mode === ProductUnitsDetailMode.Add) {
      return false;
    } else if (mode === ProductUnitsDetailMode.Edit) {
      return false;
    }

    // mode === ProductUnitsDetailMode.View
    return true;
  };

  const handleOk = () => {
    if (mode === ProductUnitsDetailMode.Add) {
      form.submit();
    } else if (mode === ProductUnitsDetailMode.Edit) {
      form.submit();
    }
  };

  const handleCancel = () => {
    if (mode === ProductUnitsDetailMode.Edit) {
      processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
        navigate(`/product_units`);
      });
    } else {
      navigate("/product_units");
    }
  };

  const handleEdit = () => {
    if (mode === ProductUnitsDetailMode.View) {
      navigate(`/product_units/${id}/edit`, { replace: true });
    }
  };

  const handleFormFinish = (values) => {
    const dto = {
      ...values,
    };
    if (mode === ProductUnitsDetailMode.Add) {
      return;
    }

    if (mode === ProductUnitsDetailMode.Edit) {
      return;
    }
  };

  return (
    <>
      <Card loading={false} title={getCardTitle()}>
        <Form
          form={form}
          {...formItemLayout}
          layout={"vertical"}
          autoComplete="off"
          onFinish={handleFormFinish}
        >
          <Form.Item name="productId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên đơn vị"
            name="name"
            rules={[{ required: true, message: "Hãy nhập tên đơn vị!" }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập tên đơn vị" />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="description"
            rules={[{ required: true, message: "Hãy nhập nội dung đơn vị!" }]}
          >
            <Input
              maxLength={255}
              readOnly={isReadOnly()}
              placeholder="Nhập mô tả đơn vị"
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

ProductUnitsDetail.propTypes = {
  mode: PropTypes.number,
};

export default ProductUnitsDetail;
