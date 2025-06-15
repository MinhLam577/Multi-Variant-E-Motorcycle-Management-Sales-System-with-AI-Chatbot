import React, { useState } from "react";
import { Button, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function QuantityExceedModal({
  showModal,
  handleOk,
  setIsModalOpen,
  isModalOpen,
  type,
  quantity_Limit,
}) {
  return (
    <div className="flex justify-center mt-8">
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleOk}
        footer={null}
        centered
        closable={false}
        maskClosable={false}
      >
        <div className="text-center px-4 py-2">
          <ExclamationCircleOutlined className="text-[#f53d2d] text-5xl mb-4" />

          <h3 className="text-lg font-semibold mb-2">
            Giới hạn số lượng sản phẩm
          </h3>
          {type != "cart" && (
            <p className="text-sm leading-6">
              Bạn đã có{" "}
              <span className="text-[#f53d2d] font-semibold">
                {quantity_Limit}
              </span>{" "}
              sản phẩm trong giỏ hàng. <br />
              Không thể thêm nữa vì vượt quá giới hạn mua hàng cho phép.
            </p>
          )}

          {type == "cart" && (
            <p className="text-sm leading-6">
              Rất tiếc! bạn chỉ có thể mua tối đa{" "}
              <span className="text-[#f53d2d] font-semibold">
                {quantity_Limit}
              </span>{" "}
              sản phẩm trong giỏ hàng. <br />
              Không thể thêm nữa vì vượt quá giới hạn mua hàng cho phép.
            </p>
          )}

          <button
            className="mt-6 w-full bg-[#f53d2d] text-white border border-[#f53d2d] hover:bg-[#ff4d3f] hover:border-[#ff4d3f] hover:text-white transition duration-200 ease-in-out p-1 rounded-md"
            onClick={handleOk}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
}
