import { Form, Input, Modal } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { ProcessModalName, processWithModals } from "./processWithModals";
import { useStore } from "@/stores";
import { toJS } from "mobx";

const ChangePasswordModal = ({ open = false, cancelCallback, setOpen }) => {
    const [form] = Form.useForm();
    const { accountObservable, loginObservable } = useStore();
    const user = toJS(accountObservable?.account);
    const handleChangePassword = async (values) => {
        try {
            const dto = {
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
                id: user.userId,
            };

            await loginObservable.basicResetPassword(dto);
            form.resetFields();
            setOpen?.(false);
        } catch (e) {}
    };

    useEffect(() => {
        if (open) {
            form.resetFields();
        }
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
                        processWithModals({
                            modalName: ProcessModalName.ConfirmChangePassword,
                            onOk: () => handleChangePassword(values),
                        })
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
                                    if (
                                        !value ||
                                        getFieldValue("newPassword") === value
                                    ) {
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
export default ChangePasswordModal;
