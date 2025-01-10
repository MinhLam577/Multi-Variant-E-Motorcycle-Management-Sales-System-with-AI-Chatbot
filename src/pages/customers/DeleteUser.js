import { useMutation } from "@apollo/client";
import { Button, Checkbox, Form, Input, message, Spin } from "antd";
import Logo from "../../components/Logo";
import { REMOVE_USER } from "../../graphql/users";

const DeleteUser = () => {
  const [removeUser] = useMutation(REMOVE_USER, {
    onCompleted: () => {
      message.success("Yêu cầu xoá tài khoản thành công!");
    },
  });

  const [form] = Form.useForm();

  const onFinish = (val) => {
    message.success("Yêu cầu xoá tài khoản thành công!");
    form.resetFields();
    // removeUser(val.phoneNumber);
  };

  return (
    <div className="flex justify-center">
      <Spin tip="Loading... " spinning={false}>
        <Logo bgColor={"white"} />
        <div className="my-4">
          <text className="font-semibold text-xl">
            Yêu cầu xoá tài khoản ứng dụng Ô tô hồng sơn
          </text>
        </div>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            className="max-w-80"
            rules={[{ required: true, message: "Hãy nhập số điện thoại!" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item>
            <div className="grid gap-y-2">
              <div>
                <text className="font-semibold">Lưu ý:</text>
              </div>
              <div>
                <text>
                  - Tài khoản của bạn sau khi bị xoá sẽ{" "}
                  <text className="font-semibold">không thể phục hồi</text>.
                </text>
              </div>
              <div>
                <text>
                  -{" "}
                  <text className="font-semibold">Mất Dữ Liệu Vĩnh Viễn:</text>{" "}
                  Tất cả dữ liệu cá nhân, đơn hàng và thông tin liên quan sẽ bị
                  xóa và không thể khôi phục.
                </text>
              </div>

              <div>
                <text>
                  - <text className="font-semibold">Mất Quyền Truy Cập:</text>{" "}
                  Bạn sẽ không thể truy cập vào tài khoản của mình hoặc sử dụng
                  bất kỳ dịch vụ nào của Ô tô hồng sơn.
                </text>
              </div>
            </div>
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: "Vui lòng đồng ý với các điều khoản" },
            ]}
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>Tôi đồng ý với các điều khoản</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default DeleteUser;
