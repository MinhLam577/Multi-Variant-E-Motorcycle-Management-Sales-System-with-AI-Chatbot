import { Modal } from "antd";
import PropTypes from "prop-types";
const CustomizeModal = ({
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
            onCancel={handleCloseModal}
            onOk={handleSaveModal}
            okText={okText || "Xác nhận"}
            cancelText={cancelText || "Hủy"}
            destroyOnClose={true}
        >
            {children}
        </Modal>
    );
};

CustomizeModal.propTypes = {
    isOpen: PropTypes.bool,
    handleCloseModal: PropTypes.func,
    handleSaveModal: PropTypes.func,
    children: PropTypes.node,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
};

export default CustomizeModal;
