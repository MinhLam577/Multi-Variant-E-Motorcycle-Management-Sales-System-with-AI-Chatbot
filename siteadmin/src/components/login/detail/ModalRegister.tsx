import { EyeInvisibleFilled, EyeTwoTone } from "@ant-design/icons";
import { Form, Input, message, Modal } from "antd";
import { RuleObject } from "antd/es/form";
import { Dispatch, SetStateAction, useState } from "react";
import { useStore } from "src/stores";
import { RegisterDto } from "src/types/userLogin.type";
import { getErrorMessage } from "src/utils";
import { validateEmail } from "src/utils/validate-format";

export interface ModalRegister {
    showRegisterForm: boolean;
    setShowRegisterForm: Dispatch<SetStateAction<boolean>>;
}
type RegisterData = Partial<RegisterDto> & {
    first_name: string;
    last_name: string;
};
const ModalRegister = ({
    showRegisterForm,
    setShowRegisterForm,
}: ModalRegister) => {
    const store = useStore();
    const loginStore = store.loginObservable;
    const [form] = Form.useForm<RegisterData>();
    const [isLoading, setIsLoading] = useState(false);
    const onFinish = async (values: RegisterData) => {
        try {
            setIsLoading(true);
            const { first_name, last_name, email, password } = values;
            const user_name = `${last_name} ${first_name}`;
            const registerDto: RegisterDto = {
                email: email,
                password: password,
                username: user_name,
            };
            await loginStore.register(registerDto);
            if (loginStore.errorMsg) {
                message.error(loginStore.errorMsg);
                return;
            }
            message.success(loginStore.successMsg);
            form.resetFields();
            setShowRegisterForm(false);
        } catch (error) {
            const errorMsg = getErrorMessage(
                error,
                "Có lỗi xảy ra khi đăng kí, vui lòng thử lại sau"
            );
            message.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };
    const validateConfirmPassword = async (_: RuleObject, value: string) => {
        if (value !== form.getFieldValue("password"))
            return Promise.reject("Mật khẩu xác nhận không khớp");

        return Promise.resolve();
    };

    return (
        <Modal
            open={showRegisterForm}
            onCancel={() => {
                form.resetFields();
                setShowRegisterForm(false);
            }}
            onOk={() => {
                form.submit();
            }}
            confirmLoading={isLoading}
            destroyOnClose={true}
            title={"Đăng kí tài khoản"}
        >
            <Form
                layout="vertical"
                form={form}
                autoComplete="off"
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
            >
                <Form.Item
                    label="Họ"
                    name={"last_name"}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập họ",
                        },
                    ]}
                >
                    <Input placeholder="Nhập họ" />
                </Form.Item>
                <Form.Item
                    label="Tên"
                    name={"first_name"}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên",
                        },
                    ]}
                >
                    <Input placeholder="Nhập tên" />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name={"email"}
                    required={true}
                    rules={[
                        {
                            validator: validateEmail,
                        },
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu"
                    name={"password"}
                    required={true}
                    rules={[
                        {
                            validator: async (_: RuleObject, value: string) => {
                                if (!value)
                                    return Promise.reject(
                                        "Vui lòng nhập mật khẩu"
                                    );
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleFilled />
                        }
                    />
                </Form.Item>
                <Form.Item
                    label="Xác nhận mật khẩu"
                    name={"confirm_password"}
                    rules={[
                        {
                            validator: validateConfirmPassword,
                        },
                    ]}
                >
                    <Input.Password
                        placeholder="Nhập xác nhận mật khẩu"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleFilled />
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default ModalRegister;
