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
  message,
  Select,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import { useStore } from "../../stores";
import dayjs from "dayjs";
import { DateTimeFormat } from "../../constants";
import { observer } from "mobx-react-lite";

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

const VoucherDetail = observer(({ mode }) => {
  const { id } = useParams();

  const store = useStore();
  const voucherStore = store.voucherObservable;
  useEffect(() => {
    console.log("user effect ");
    fetchVoucherDetail();
  }, [id]);

  // Khi `voucherStore.dataDetail` thay đổi, cập nhật form
  useEffect(() => {
    if (voucherStore.dataDetail && mode !== VoucherDetailMode.Add) {
      form.setFieldsValue({
        ...voucherStore.dataDetail,
        type_voucher_id: voucherStore.dataDetail?.type_voucher?.id,
        start_date: dayjs(voucherStore.dataDetail.start_date),
        end_date: dayjs(voucherStore.dataDetail.end_date),
      });
    }

    // }
  }, [voucherStore.dataDetail]);

  const fetchVoucherDetail = async () => {
    await voucherStore.getVoucherDetail(id);
    await voucherStore.getListTypeVoucher();
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  const isReadOnly = () => {
    if (mode === VoucherDetailMode.Add) {
      return false;
    } else if (mode === VoucherDetailMode.Edit) {
      return false;
    }
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

  const handleFormFinish = async (values) => {
    try {
      const { discountId, ...data } = values;
      // Chuyển discount_amount từ chuỗi (với dấu phẩy) sang số
      const discountAmount =
        typeof data.discount_amount === "string"
          ? parseFloat(data.discount_amount.replace(/,/g, "")) // Loại bỏ dấu phẩy và chuyển thành số
          : data.discount_amount;
      const object = {
        ...data,
        discount_amount: discountAmount, // Truyền giá trị discount_amount đã chuyển thành số
        start_date: dayjs(values.start_date).format(
          DateTimeFormat.TIME_STAMP_POSTGRES_TZ
        ),
        end_date: dayjs(values.end_date).format(
          DateTimeFormat.TIME_STAMP_POSTGRES_TZ
        ),
      };
      console.log(object);
      if (mode === VoucherDetailMode.Add) {
        await voucherStore.createVoucher(object);
        if (voucherStore.status == 200) {
          message.success(voucherStore.successMsg);
          navigate("/vouchers");
        } else {
          message.error(voucherStore.errorMsg);
        }
      } else {
        // gọi api chỉnh sửa
        console.log(values);
        await voucherStore.editVoucher(id, object);
        if (voucherStore.status == 200) {
          message.success(voucherStore.successMsg);
          navigate("/vouchers");
        } else {
          message.error(voucherStore.errorMsg);
        }
      }
    } catch (error) {}
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
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="discountId" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label="Mã giảm giá"
              name="voucher_code"
              rules={[
                { required: true, message: "Vui lòng nhập mã giảm giá!" },
              ]}
            >
              <Input readOnly={isReadOnly()} placeholder="Nhập mã giảm giá" />
            </Form.Item>
            <Form.Item
              label="Tên giảm giá"
              name="voucher_name"
              rules={[{ required: true, message: "Hãy nhập tên giảm giá!" }]}
            >
              <Input readOnly={isReadOnly()} placeholder="Nhập tên giảm giá" />
            </Form.Item>
          </div>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Hãy mô tả!" }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập mô tả" />
          </Form.Item>

          <div className="grid lg:grid-cols-2 gap-4">
            <Form.Item
              label="Loại giảm giá"
              name="type_voucher_id"
              rules={[
                { required: true, message: "Vui lòng chọn loại giảm giá!" },
              ]}
            >
              <Select
                disabled={isReadOnly()}
                options={
                  voucherStore?.typeVoucher?.map((item) => ({
                    value: item.id,
                    label: item.name_type_voucher,
                  })) || []
                }
                placeholder="Chọn loại giảm giá"
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item
              label="Số lượng voucher"
              name="limit"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <InputNumber
                className="w-full"
                min={0}
                placeholder="Vui lòng nhập số số lượng!"
                readOnly={isReadOnly()}
              />
            </Form.Item>
            <Form.Item
              label="Giảm giá theo % "
              name="fixed"
              rules={[{ required: true, message: "Hãy chọn trạng thái!" }]}
            >
              <Select
                disabled={isReadOnly()}
                options={[
                  { value: true, label: "TRUE" },
                  { value: false, label: "FALSE" },
                ]}
                placeholder="Chọn trạng thái"
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item
              label="Giá trị giảm giá"
              name="discount_amount"
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
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")} // Lấy giá trị số mà không có dấu phẩy
                readOnly={isReadOnly()}
              />
            </Form.Item>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            <Form.Item
              label="Ngày bắt đầu"
              name="start_date"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              ]}
            >
              <DatePicker disabled={isReadOnly()} className="w-full" showTime />
            </Form.Item>
            <Form.Item
              label="Ngày kết thúc"
              name="end_date"
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
                { value: "active", label: "Hoạt động" },
                { value: "inactive", label: "Ngưng hoạt động" },
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
});

VoucherDetail.propTypes = {
  mode: PropTypes.number,
};

export default VoucherDetail;
// <Form.Item
//   label="Ngày bắt đầu"
//   name="start_date"
//   rules={[
//     { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
//   ]}
// >
//   <DatePicker disabled={isReadOnly()} className="w-full" showTime />
// </Form.Item>
// <Form.Item
//   label="Ngày kết thúc"
//   name="end_date"
//   rules={[
//     { required: true, message: "Vui lòng chọn ngày kết thúc!" },
//   ]}
// >
//   <DatePicker disabled={isReadOnly()} className="w-full" showTime />
// </Form.Item>
// formatter={(value) =>
//   `${value} `.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
// }
// <Form.Item
//               label="Khách hàng nhận voucher"
//               name="status"
//               rules={[{ required: true, message: "Hãy chọn trạng thái!" }]}
//             >
//               <Select
//                 disabled={isReadOnly()}
//                 options={[
//                   { value: "ACTIVE", label: "Hoạt động" },
//                   { value: "INACTIVE", label: "Ngưng hoạt động" },
//                 ]}
//                 placeholder="Chọn trạng thái"
//                 optionFilterProp="label"
//               />
//             </Form.Item>
