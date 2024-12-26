import { Form, Input, Modal, message } from "antd";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_PASSWORD } from "../graphql/users";
import { ProcessModalName, processWithModals } from "./processWithModals";
import PropTypes from 'prop-types';

const ChangePasswordModal = ({ open = false, cancelCallback }) => {
  const [form] = Form.useForm();
  const [updatePassword] = useMutation(UPDATE_PASSWORD);

  const handleChangePassword = (values) => {
    const dto = {
      ...values,
      reNewPassword: undefined
    };

    updatePassword({
      variables: {
        changePasswordInput: {
          ...dto
        }
      },
      onCompleted: () => {
        message.success('Đã thay đổi mật khẩu thành công!');
        typeof cancelCallback === 'function' && cancelCallback();
      }
    })
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
        title={'Thay đổi mật khẩu'}
        open={open}
        okText={'Thay đổi'}
        cancelText={'Hủy'}
        onOk={() => form.submit()}
        onCancel={() => {
          typeof cancelCallback === 'function' && cancelCallback();
        }}
      >
        <Form
          layout={'vertical'}
          form={form}
          onFinish={(values) => processWithModals(ProcessModalName.ConfirmChangePassword)(() => handleChangePassword(values))}
        >
          <Form.Item
            name={'currentPassword'}
            label={'Mật khẩu cũ'}
            rules={[{
              required: true,
              message: 'Hãy nhập mật khẩu cũ.'
            }]}
          >
            <Input.Password placeholder="Nhập mật khẩu cũ" />
          </Form.Item>
          <Form.Item
            name={'newPassword'}
            label={'Mật khẩu mới'}
            rules={[{
              required: true,
              message: 'Hãy nhập mật khẩu mới.'
            }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            name={'reNewPassword'}
            label={'Xác nhận mật khẩu mới'}
            dependencies={['newPassword']}
            rules={[
              {
                required: true,
                message: 'Hãy nhập xác nhận mật khẩu mới.'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('Xác nhận mật khẩu mới cần giống mật khẩu mới đã nhập.'));
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

ChangePasswordModal.propTypes ={
  open: PropTypes.bool,
  cancelCallback: PropTypes.func
}
export default ChangePasswordModal;