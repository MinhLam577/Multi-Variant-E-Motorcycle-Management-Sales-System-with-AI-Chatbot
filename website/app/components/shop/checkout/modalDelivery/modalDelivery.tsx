import { Modal } from "antd";
import React from "react";
interface ModalDeliveryProps {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  setIsModalOpen?: (value: boolean) => void; // Nếu bạn định dùng sau này
  title: string;
}
export default function ModalDelivery({
  isModalOpen,
  handleOk,
  handleCancel,
  setIsModalOpen,
  title,
}: ModalDeliveryProps) {
  return (
    <div>
      <Modal
        title={title}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="py-2">
          <h3 className="text-gray-500 uppercase text-sm font-medium mb-3">
            PHƯƠNG THỨC VẬN CHUYỂN LIÊN KẾT VỚI Ô Tô Hồng Sơn
          </h3>

          <div className="border border-orange-200 rounded-md p-4 flex justify-between items-start ">
            <div className="flex flex-col space-y-1">
              <span className="text-base font-medium text-gray-800">Nhanh</span>
              <span className="text-sm text-gray-800">₫22.200</span>
              <div className="text-green-600 text-sm flex items-center">
                🚚 Đảm bảo nhận hàng từ{" "}
                <strong className="mx-1">9 Tháng 6</strong> -{" "}
                <strong className="ml-1">12 Tháng 6</strong>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Nhận Voucher trị giá <strong>₫15.000</strong> nếu đơn hàng được
                giao đến bạn sau ngày <strong>12 Tháng 6 2025</strong>.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
