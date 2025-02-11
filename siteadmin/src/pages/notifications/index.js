import { Button, Form, Input } from "antd";

const Notification = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {};

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{}}
      >
        <Form.Item
          label={<div className="font-bold">Mã người dùng</div>}
          name="userCode"
        >
          <Input placeholder="Nhập mã người dùng" />
        </Form.Item>
        <Form.Item
          label={<div className="font-bold">Tiêu đề</div>}
          name="title"
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>
        <Form.Item
          label={<div className="font-bold">Nội dung</div>}
          name="subject"
        >
          <Input placeholder="Nhập nội dung" />
        </Form.Item>
        <Button type="primary" danger htmlType="submit" className="mt-1">
          Gửi thông báo
        </Button>
      </Form>
    </>
  );
};

Notification.propTypes = {};

export default Notification;
