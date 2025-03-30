import { Form, Input, Modal } from "antd";
import PropTypes from "prop-types";
import CustomizeModal from "../../common/CustomizeModal";
const ModalConfirmReason = ({
    isOpen,
    handleCloseReasonModal,
    handleSaveReasonModal,
    form,
}) => {
    return (
        <CustomizeModal
            isOpen={isOpen}
            handleCloseModal={handleCloseReasonModal}
            handleSaveModal={handleSaveReasonModal}
            okText="Xác nhận"
            cancelText="Hủy"
        >
            <Form
                layout="vertical"
                name="reason_form"
                form={form}
                preserve={false}
            >
                <Form.Item label="Lý do xác nhận đơn hàng" name="reason">
                    <Input.TextArea
                        rows={4}
                        style={{
                            resize: "none",
                        }}
                        placeholder="Nhập lý do xác nhận đơn hàng"
                    />
                </Form.Item>
            </Form>
        </CustomizeModal>
    );
};

ModalConfirmReason.propTypes = {
    isOpen: PropTypes.bool,
    handleCloseReasonModal: PropTypes.func,
    handleSaveReasonModal: PropTypes.func,
    form: PropTypes.object,
};

export default ModalConfirmReason;
