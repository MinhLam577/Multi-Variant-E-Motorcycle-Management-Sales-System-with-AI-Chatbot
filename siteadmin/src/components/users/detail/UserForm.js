import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Select,
  Row,
  message,
  InputNumber,
} from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { GenderType, RegExps, UserType } from "../../../constants";
import UploadAvatarGetUrlWithImgCrop, {
  UploadAvatarGetUrlWithImgCropRemoteMode,
} from "../../../containers/UploadAvatarGetUrlWithImgCrop";
import dayjs from "dayjs";
import apiClient from "../../../api/apiClient";
import endpoints from "../../../api/endpoints.ts";
import { useNavigate } from "react-router";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
  },
};

const UserForm = ({ userBasicInfo, refetch }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleFormFinish = async (values) => {
    console.log(values);
    const updateInfo = {
      username: values.username || userBasicInfo.username,
      age: values.age || userBasicInfo.age,
      address: values.address || userBasicInfo.address,
      phoneNumber: values.phoneNumber || userBasicInfo.phoneNumber,
      gender: values.gender || userBasicInfo.gender,
      Roles: values.roles, // Đổi key 'roles' thành 'Roles'
      birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null, // Chỉ lấy ngày, tránh lỗi múi giờ
    };

    // delete updateInfo.__typename;
    // delete updateInfo.parent;
    // delete updateInfo.created_at;
    // delete updateInfo.userCode;
    // Xóa các thuộc tính không cần thiết
    const ignoredKeys = ["__typename", "parent", "created_at", "userCode"];
    ignoredKeys.forEach((key) => delete updateInfo[key]);
    // gọi api
    console.log(values);
    try {
      const data = await apiClient.patch(
        endpoints.user.update(values.id),
        updateInfo
      );
      console.log(data);
      if (data.status == 200) {
        console.log(data);
        message.success(data.message);
        navigate("/users");
      } else {
        message.error("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.log(error);
      message.error(error);
      throw new Error("Lỗi cập nhật");
    }
  };

  useEffect(() => {
    // Xử lý danh sách vai trò dưới dạng chuỗi (nếu cần)
    const formattedRoles =
      userBasicInfo?.roles?.map((role) => role?.name) || [];
    console.log(formattedRoles);
    // Cập nhật dữ liệu form
    form.setFieldsValue({
      ...userBasicInfo, // Giữ nguyên dữ liệu gốc
      birthday: userBasicInfo?.birthday ? dayjs(userBasicInfo.birthday) : null, // Chuyển đổi ngày
      roles: formattedRoles.length > 0 ? formattedRoles[0] : "", // Chỉ lấy role đầu tiên
    });
  }, [userBasicInfo, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      onFinish={handleFormFinish}
    >
      {/* Avatar */}
      <Form.Item className="flex justify-center" name="avatarUrl">
        <UploadAvatarGetUrlWithImgCrop
          remoteMode={UploadAvatarGetUrlWithImgCropRemoteMode.Private}
          disabled={true}
        />
      </Form.Item>

      {/* Chia thành 2 cột */}
      <Col span={12}>
        <Form.Item
          label="id"
          name="id"
          hidden
          rules={[{ required: true, message: "id!" }]}
        >
          <Input placeholder="id" />
        </Form.Item>
      </Col>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Họ và tên"
            name="username"
            rules={[{ required: true, message: "Hãy nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập Họ và tên" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Hãy nhập số điện thoại!",
              },
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
        </Col>

        <Col span={12}>
          <Form.Item label="Ngày sinh" name="birthday">
            <DatePicker
              placeholder="Chọn ngày sinh"
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Địa chỉ" name="address">
            <Input placeholder="Địa chỉ" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" disabled="true" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Tuổi"
            name="age"
            rules={[{ required: true, message: "Hãy nhập tuổi" }]}
          >
            <InputNumber
              placeholder="Nhập số tuổi"
              style={{ width: "100%" }}
              min={1} // Giới hạn số tuổi không âm
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Giới tính" name="gender">
            <Select
              allowClear
              optionFilterProp="label"
              options={Object.keys(GenderType).map((item) => ({
                value: item,
                label: UserType[item],
              }))}
              placeholder="Chọn giới tính"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Loại người dùng" name="roles">
            <Select
              allowClear
              optionFilterProp="label"
              options={Object.keys(UserType).map((item) => ({
                value: item,
                label: UserType[item],
              }))}
              placeholder="Chọn loại người dùng"
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Nút cập nhật */}
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
