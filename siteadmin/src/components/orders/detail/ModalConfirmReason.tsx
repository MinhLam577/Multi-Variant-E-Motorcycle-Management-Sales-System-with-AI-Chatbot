import { Form, FormInstance, Input } from "antd";
import PropTypes from "prop-types";
import CustomizeModal from "../../common/CustomizeModal";
import { useEffect } from "react";
import React from 'react'
type ModalConfirmReasonProps = {
    isOpen: boolean;
    handleCloseReasonModal: () => void;
    handleSaveReasonModal: () => void;
    form: FormInstance;
    okText?: string;
    cancelText?: string;
    title?: string;
    label_input?: string;
    placeholder_input?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const ModalConfirmReason: React.FC<ModalConfirmReasonProps> = ({
    isOpen,
    handleCloseReasonModal,
    handleSaveReasonModal,
    form,
    cancelText = "Hủy",
    title,
    okText,
    label_input,
    placeholder_input,
    onChange,
}) => {
    return (
        <CustomizeModal
            isOpen={isOpen}
            handleCloseModal={handleCloseReasonModal}
            handleSaveModal={handleSaveReasonModal}
            okText={okText}
            cancelText={cancelText}
            title={title}
        >
            <Form
                layout="vertical"
                name="reason_form"
                form={form}
                preserve={false}
            >
                <Form.Item label={label_input} name="reason">
                    <Input.TextArea
                        rows={4}
                        style={{
                            resize: "none",
                        }}
                        placeholder={placeholder_input}
                        onChange={onChange}
                    />
                </Form.Item>
            </Form>
        </CustomizeModal>
    );
};

export default ModalConfirmReason;
