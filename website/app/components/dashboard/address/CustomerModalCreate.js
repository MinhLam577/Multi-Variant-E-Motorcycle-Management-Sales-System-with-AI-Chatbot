import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
  Select,
} from "antd";
import { CustomerType, GenderType, UserType } from "../../constants";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";

const CustomerModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate } = props;
  const [isSubmit, setIsSubmit] = useState(false);

  // https://ant.design/components/form#components-form-demo-control-hooks
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log(values);
    setIsSubmit(true);
    const updateInfo = {
      ...values,
      birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null, // Chỉ lấy ngày, tránh lỗi múi giờ
    };

    console.log(updateInfo);
    setIsSubmit(true);

    const res = await apiClient.post(endpoints.customers.create, updateInfo);
    if (res && res.data) {
      message.success("Tạo mới user thành công");
      form.resetFields();
      setOpenModalCreate(false);
      await props.fetchUser();
    } else {
      notification.error({
        message: "lỗi",
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Thêm mới người dùng"
        open={openModalCreate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => setOpenModalCreate(false)}
        okText={"Tạo mới"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
      >
        <Divider />

        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Tên hiển thị"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
            style={{ marginBottom: "10px" }} // Giảm khoảng cách xuống 8px
          >
            <Input placeholder="Nhập tên hiển thị" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            style={{ marginBottom: "10px" }} // Giảm khoảng cách xuống 8px
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            style={{ marginBottom: "10px" }}
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^\d{10}$/,
                message: "Số điện thoại phải có đúng 10 số!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            style={{ marginBottom: "10px" }}
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
          
          <Form.Item
            label="Ngày sinh"
            name="birthday"
            style={{ marginBottom: "10px" }}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày sinh!",
              },
            ]}
          >
            <DatePicker
              placeholder="Chọn ngày sinh"
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            style={{ marginBottom: "10px" }}
          >
            <Select
              allowClear
              optionFilterProp="label"
              options={Object.keys(GenderType).map((item) => ({
                value: item,
                label: GenderType[item], // Fix nhầm UserType thành GenderType
              }))}
              placeholder="Chọn giới tính"
            />
          </Form.Item>

          <Form.Item
            label="Loại người dùng"
            name="role"
            style={{ marginBottom: "10px" }}
          >
            <Select
              allowClear
              optionFilterProp="label"
              options={Object.keys(CustomerType).map((item) => ({
                value: item,
                label: UserType[item],
              }))}
              placeholder="Chọn loại người dùng"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

CustomerModalCreate.propTypes = {
  fetchUser: PropTypes.func,
  openModalCreate: PropTypes.func,
  setOpenModalCreate: PropTypes.func,
};
export default CustomerModalCreate;
