import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import { useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";
import PropTypes from "prop-types";
import {
  CREATE_VOUCHER,
  GET_VOUCHER,
  UPDATE_VOUCHER,
} from "../../graphql/vouchers";
import dayjs from "dayjs";

export const VoucherDetailMode = {
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

const VoucherDetail = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadData, { loading }] = useLazyQuery(GET_VOUCHER, {
    fetchPolicy: "no-cache",
    onCompleted: (res) => {
      if (res?.admin_discount) {
        prepareForm(res?.admin_discount);
      }
      message.success("Tải chi tiết voucher thành công!");
    },
  });

  const [createDiscount, { loading: creating }] = useMutation(CREATE_VOUCHER, {
    onCompleted: (res) => {
      if (res?.createDiscount?.status) {
        message.success("Tạo voucher thành công!");
        navigate(`/vouchers`);
      }
    },
  });

  const [updateDiscount, { loading: updating }] = useMutation(UPDATE_VOUCHER, {
    onCompleted: (res) => {
      if (res?.updateDiscount?.status) {
        message.success("Cập nhật voucher thành công!");
        navigate(`/vouchers`);
      }
    },
  });

  const [form] = Form.useForm();

  const getCardTitle = () => {
    if (mode === VoucherDetailMode.View) {
      return "Chi tiết voucher";
    } else if (mode === VoucherDetailMode.Add) {
      return "Tạo voucher";
    } else if (mode === VoucherDetailMode.Edit) {
      return "Chỉnh sửa voucher";
    }
  };

  const getButtonOkText = () => {
    if (mode === VoucherDetailMode.Add) {
      return (
        <>
          <PlusOutlined />
          &nbsp;Tạo
        </>
      );
    } else if (mode === VoucherDetailMode.Edit) {
      return (
        <>
          <SaveOutlined />
          &nbsp;Lưu
        </>
      );
    }
  };

  const getButtonCancelText = () => {
    if (mode === VoucherDetailMode.Add) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Hủy
        </>
      );
    } else if (mode === VoucherDetailMode.Edit) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Hủy
        </>
      );
    } else if (mode === VoucherDetailMode.View) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Đóng
        </>
      );
    }
  };

  const getButtonEditText = () => {
    if (mode === VoucherDetailMode.View) {
      return (
        <>
          <EditOutlined />
          &nbsp;Sửa
        </>
      );
    }
  };

  const prepareForm = (loadedData) => {
    if (mode === VoucherDetailMode.View) {
      form.setFieldsValue({
        ...loadedData,
        fromDate: dayjs(loadedData.fromDate),
        toDate: dayjs(loadedData.toDate)
      });
    } else if (mode === VoucherDetailMode.Add) {
      form.resetFields();
    } else if (mode === VoucherDetailMode.Edit) {
      form.setFieldsValue({
        ...loadedData,
        fromDate: dayjs(loadedData.fromDate),
        toDate: dayjs(loadedData.toDate)
      });
    }
  };

  const isReadOnly = () => {
    if (mode === VoucherDetailMode.Add) {
      return false;
    } else if (mode === VoucherDetailMode.Edit) {
      return false;
    }

    // mode === VoucherDetailMode.View
    return true;
  };

  const handleOk = () => {
    if (mode === VoucherDetailMode.Add) {
      form.submit();
    } else if (mode === VoucherDetailMode.Edit) {
      form.submit();
    }
  };

  const handleCancel = () => {
    if (mode === VoucherDetailMode.Edit) {
      processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
        navigate(`/vouchers`);
      });
    } else {
      navigate("/vouchers");
    }
  };

  const handleEdit = () => {
    if (mode === VoucherDetailMode.View) {
      navigate(`/vouchers/${id}/edit`, { replace: true });
    }
  };

  const handleFormFinish = (values) => {
    const dto = {
      ...values,
    };
    if (mode === VoucherDetailMode.Add) {
      createDiscount({
        variables: {
          createDiscountInput: {
            ...dto,
          },
        },
      });
    } else if (mode === VoucherDetailMode.Edit) {
      updateDiscount({
        variables: {
          updateDiscountInput: {
            ...dto,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (id) {
      loadData({
        variables: {
          id,
        },
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
          layout={"vertical"}
          autoComplete="off"
          onFinish={handleFormFinish}
        >
          <Form.Item name="discountId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã giảm giá"
            name="discountCode"
            rules={[{ required: true, message: "Vui lòng nhập mã giảm giá!" }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập mã giảm giá" />
          </Form.Item>
          <Form.Item
            label="Tên giảm giá"
            name="discountName"
            rules={[{ required: true, message: "Hãy nhập tên giảm giá!" }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập tên giảm giá" />
          </Form.Item>
          <Form.Item
            label="Loại giảm giá"
            name="discountType"
            rules={[
              { required: true, message: "Vui lòng chọn loại giảm giá!" },
            ]}
          >
            <Select
              disabled={isReadOnly()}
              options={[
                {
                  value: 'ORDER',
                  label: 'ORDER',
                },
                {
                  value: 'SHIPPING',
                  label: 'SHIPPING',
                },
              ]}
              placeholder="Chọn loại giảm giá"
              optionFilterProp="label"
            />
          </Form.Item>
          <div className="grid lg:grid-cols-3 gap-4">
            <Form.Item
              label="Giá trị giảm giá"
              name="discountValue"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị giảm giá!" },
              ]}
            >
              <InputNumber
                className="w-full"
                min={0}
                placeholder="Vui lòng nhập giá trị giảm giá"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                readOnly={isReadOnly()}
              />
            </Form.Item>
            <Form.Item
              label="Tổng giá trị đơn hàng tối thiểu"
              name="minOrderTotalPrice"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tổng giá trị đơn hàng tối thiểu!",
                },
              ]}
            >
              <InputNumber
                className="w-full"
                min={0}
                placeholder="Vui lòng nhập tổng giá trị đơn hàng tối thiểu"
                formatter={(value) =>
                  `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                readOnly={isReadOnly()}
              />
            </Form.Item>
            <Form.Item
              label="Số lần trong ngày"
              name="timesInDate"
              rules={[
                { required: true, message: "Vui lòng nhập số lần trong ngày!" },
              ]}
            >
              <InputNumber
                className="w-full"
                min={0}
                placeholder="Vui lòng nhập số lần trong ngày!"
                readOnly={isReadOnly()}
              />
            </Form.Item>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <Form.Item
              label="Ngày bắt đầu"
              name="fromDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              ]}
            >
              <DatePicker disabled={isReadOnly()} className="w-full" showTime />
            </Form.Item>
            <Form.Item
              label="Ngày kết thúc"
              name="toDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ]}
            >
              <DatePicker disabled={isReadOnly()} className="w-full" showTime />
            </Form.Item>
          </div>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Hãy chọn trạng thái!" }]}
          >
            <Select
              disabled={isReadOnly()}
              options={[
                {value: 'ACTIVE', label: 'Hoạt động'},
                {value: 'INACTIVE', label: 'Ngưng hoạt động'}
              ]}
              placeholder="Chọn trạng thái"
              optionFilterProp="label"
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

VoucherDetail.propTypes = {
  mode: PropTypes.number,
};

export default VoucherDetail;
