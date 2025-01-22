import { Button, Form, Input, Select } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { RegExps, UserType } from "../../../constants";
import UploadAvatarGetUrlWithImgCrop, {
  UploadAvatarGetUrlWithImgCropRemoteMode,
} from "../../../containers/UploadAvatarGetUrlWithImgCrop";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
  },
};

const UserForm = ({ userBasicInfo, refetch }) => {
  const [form] = Form.useForm();

  const handleFormFinish = (values) => {
    let updateInfo = {
      ...userBasicInfo,
      ...values,
    };

    delete updateInfo.__typename;
    delete updateInfo.parent;
    delete updateInfo.created_at;
    delete updateInfo.userCode;
  };

  useEffect(() => {
    form.setFieldsValue({
      ...userBasicInfo,
    });
  }, [userBasicInfo, form]);

  return (
    <Form
      form={form}
      {...formItemLayout}
      layout={"vertical"}
      autoComplete="off"
      onFinish={handleFormFinish}
    >
      <Form.Item name="userId" hidden>
        <Input />
      </Form.Item>
      <Form.Item className="flex justify-center" name="avatar">
        <UploadAvatarGetUrlWithImgCrop
          remoteMode={UploadAvatarGetUrlWithImgCropRemoteMode.Private}
          disabled={true}
        />
      </Form.Item>
      <Form.Item
        label="Họ và tên"
        name="fullname"
        rules={[{ required: true, message: "Hãy nhập họ và tên!" }]}
      >
        <Input placeholder="Nhập Họ và tên" />
      </Form.Item>
      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[
          { required: true, message: "Hãy nhập số điện thoại!" },
          () => ({
            validator(_, value) {
              if (!value || RegExps.PhoneNumber.test(value)) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("Số điện thoại không đúng định dạng.")
              );
            },
          }),
        ]}
      >
        <Input placeholder="Nhập Số điện thoại" />
      </Form.Item>
      <Form.Item label="Ngày sinh" name="birthDate">
        <Input placeholder="Ngày sinh" />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item label="Số điện thoại người giới thiệu" name="refPhone">
        <Input placeholder="refPhone" />
      </Form.Item>
      <Form.Item label="Loại người dùng" name="role">
        <Select
          allowClear
          optionFilterProp="label"
          options={Object.keys(UserType).map((item) => {
            return {
              value: item,
              label: UserType[item],
            };
          })}
          placeholder="Chọn loại người dùng"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

UserForm.propTypes = {
  userBasicInfo: PropTypes.object,
  refetch: PropTypes.func,
};

UserForm.defaultProps = {
  userBasicInfo: {},
};

export default UserForm;
