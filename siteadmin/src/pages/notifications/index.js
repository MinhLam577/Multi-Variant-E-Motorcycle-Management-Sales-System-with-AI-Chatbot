import { Button, Form, Input } from "antd";
import AdminBreadCrumb from "../../components/common/AdminBreadCrumb";
import { getBreadcrumbItems } from "../../containers/layout";

const Notification = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {};

    return (
        <section className="w-full flex flex-col gap-6">
            <div className="flex justify-between items-center animate-slideDown">
                <AdminBreadCrumb
                    description="Thông tin danh sách các thông báo"
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
            </div>
            <div className="animate-slideUp">
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
                    <Button
                        type="primary"
                        danger
                        htmlType="submit"
                        className="mt-1"
                    >
                        Gửi thông báo
                    </Button>
                </Form>
            </div>
        </section>
    );
};

Notification.propTypes = {};

export default Notification;
