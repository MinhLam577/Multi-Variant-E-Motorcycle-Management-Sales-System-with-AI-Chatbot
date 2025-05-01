import { Modal } from "antd";
import React from "react";
import { n } from "react-router/dist/development/fog-of-war-BaM-ohjc";
interface CustomizeModalProps {
    isOpen: boolean;
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
    ...res
}) => {
    return (
        <Modal
            {...res}
            open={isOpen}
            onCancel={handleCloseModal || null}
            onOk={handleSaveModal || null}
            okText={okText || "Xác nhận"}
            cancelText={cancelText || "Hủy"}
            destroyOnClose={true}
        >
            {children}
        </Modal>
    );
};

export default CustomizeModal;
