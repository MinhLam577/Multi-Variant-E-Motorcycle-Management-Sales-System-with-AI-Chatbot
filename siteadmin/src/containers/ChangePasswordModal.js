import { Form, Input, Modal } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { ProcessModalName, processWithModals } from "./processWithModals";

const ChangePasswordModal = ({ open = false, cancelCallback }) => {
  const [form] = Form.useForm();

  const handleChangePassword = (values) => {
    const dto = {
      ...values,
      reNewPassword: undefined,
    };
  };

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [open]);

  return (
    <>
      <Modal
        title={"Thay đổi mật khẩu"}
        open={open}
        okText={"Thay đổi"}
        cancelText={"Hủy"}
        onOk={() => form.submit()}
        onCancel={() => {
          typeof cancelCallback === "function" && cancelCallback();
        }}
      >
        <Form
          layout={"vertical"}
          form={form}
          onFinish={(values) =>
            processWithModals(ProcessModalName.ConfirmChangePassword)(() =>
              handleChangePassword(values)
            )
          }
        >
          <Form.Item
            name={"currentPassword"}
            label={"Mật khẩu cũ"}
            rules={[
              {
                required: true,
                message: "Hãy nhập mật khẩu cũ.",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu cũ" />
          </Form.Item>
          <Form.Item
            name={"newPassword"}
            label={"Mật khẩu mới"}
            rules={[
              {
                required: true,
                message: "Hãy nhập mật khẩu mới.",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            name={"reNewPassword"}
            label={"Xác nhận mật khẩu mới"}
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Hãy nhập xác nhận mật khẩu mới.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "Xác nhận mật khẩu mới cần giống mật khẩu mới đã nhập."
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

ChangePasswordModal.propTypes = {
  open: PropTypes.bool,
  cancelCallback: PropTypes.func,
};
export default ChangePasswordModal;
