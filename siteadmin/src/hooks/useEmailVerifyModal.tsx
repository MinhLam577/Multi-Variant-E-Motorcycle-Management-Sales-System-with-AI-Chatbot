import { useState, useCallback, useMemo } from "react";
import { Form, ModalProps } from "antd";
import ModalVerifyByEmail from "src/components/common/ModalVerifyByEmail";

export interface UseEmailVerifyModalProps extends ModalProps {
    title?: string;
    onSubmit: (values) => Promise<void>;
    onClose?: () => void;
    onSuccess?: (values) => void;
    onError?: (error: any) => void;
}

export const useEmailVerifyModal = ({
    title,
    onSubmit,
    onClose,
    onSuccess,
    onError,
    ...restProps
}: UseEmailVerifyModalProps) => {
    const [form] = Form.useForm();
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFinishForm = async (values: any) => {
        try {
            setIsLoading(true);
            await onSubmit(values);
            onSuccess?.(values);
        } catch (err) {
            console.error(err);
            onError?.(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        form.resetFields();
    };

    const ModalEmailVerify = useMemo(
        () => (
            <ModalVerifyByEmail
                showModal={showModal}
                setShowModal={setShowModal}
                formInstance={form}
                isLoading={isLoading}
                onFinishForm={handleFinishForm}
                onCancel={handleClose}
                title={title}
                {...restProps}
            />
        ),
        [showModal, isLoading, handleFinishForm, title]
    );
    return {
        ModalEmailVerify,
        showModal,
        setShowModal,
    };
};
