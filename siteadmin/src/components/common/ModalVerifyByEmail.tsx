import { Form, Input, Modal, ModalProps } from "antd";
import { FormInstance } from "antd/lib";
import { Dispatch, SetStateAction } from "react";
import { validateEmail } from "src/utils/validate-format";
export interface ModalVerifyByEmailProps extends ModalProps {
    showModal: boolean;
    isLoading: boolean;
    formInstance: FormInstance;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    onFinishForm: (values) => Promise<void>;
}

const ModalVerifyByEmail = ({
    showModal,
    isLoading,
    formInstance,
    setShowModal,
    onFinishForm,
    ...props
}: ModalVerifyByEmailProps) => {
    return (
        <Modal
            title={props?.title}
            open={showModal}
            confirmLoading={isLoading}
            destroyOnClose={true}
            afterClose={() => {
                formInstance.resetFields();
            }}
            onOk={(e) => {
                if (props.onOk) {
                    props.onOk(e);
                    return;
                }
                formInstance.submit();
            }}
            onCancel={(e) => {
                if (props.onCancel) {
                    props.onCancel(e);
                    return;
                }
                setShowModal(false);
            }}
        >
            <Form
                form={formInstance}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
                layout={"vertical"}
                onFinish={onFinishForm}
                autoComplete="off"
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ validator: validateEmail }]}
                >
                    <Input placeholder="Nhập Email" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalVerifyByEmail;
