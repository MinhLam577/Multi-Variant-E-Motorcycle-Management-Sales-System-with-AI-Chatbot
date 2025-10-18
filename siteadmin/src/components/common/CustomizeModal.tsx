import { Modal, ModalProps } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
interface CustomizeModalProps extends ModalProps {
    isOpen: boolean;
    title?: string;
    handleCloseModal?: () => void;
    handleSaveModal?: () => void;
    okText?: string;
    cancelText?: string;
    children: React.ReactNode;
    [key: string]: any;
}

const CustomizeModal: React.FC<CustomizeModalProps> = ({
    children,
    isOpen,
    handleCloseModal,
    handleSaveModal,
    okText,
    cancelText,
    title,
    ...res
}) => {
    return (
        <Modal
            open={isOpen}
            onCancel={handleCloseModal || undefined}
            onOk={handleSaveModal || undefined}
            okText={okText || "Xác nhận"}
            cancelText={cancelText || "Hủy"}
            destroyOnClose={true}
            title={title}
            forceRender={true}
            {...res}
        >
            {children}
        </Modal>
    );
};

export default observer(CustomizeModal);
