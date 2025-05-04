import { Modal } from "antd";
import { observer } from "mobx-react-lite";
import React from "react";
interface CustomizeModalProps {
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
            {...res}
            open={isOpen}
            onCancel={handleCloseModal || null}
            onOk={handleSaveModal || null}
            okText={okText || "Xác nhận"}
            cancelText={cancelText || "Hủy"}
            destroyOnClose={true}
            title={title}
        >
            {children}
        </Modal>
    );
};

export default observer(CustomizeModal);
