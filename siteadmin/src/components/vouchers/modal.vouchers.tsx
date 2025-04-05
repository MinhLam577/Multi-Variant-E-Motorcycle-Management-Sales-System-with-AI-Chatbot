import React, { useState } from "react";
import { Button, Modal } from "antd";
import PropTypes from "prop-types";
const ModalVouchers = ({
  setOpen,
  open,
  VoucherComponent,
  handleCancel,
  handleOk,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");


  return (
    <>
      <Modal
        title=" Tặng voucher cho khách hàng"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        {VoucherComponent} {/* Nhận component và render */}
      </Modal>
    </>
  );
};
ModalVouchers.propTypes = {
  setOpen: PropTypes.func,
  open: PropTypes.bool,
  VoucherComponent: PropTypes.node,
};

export default ModalVouchers;
