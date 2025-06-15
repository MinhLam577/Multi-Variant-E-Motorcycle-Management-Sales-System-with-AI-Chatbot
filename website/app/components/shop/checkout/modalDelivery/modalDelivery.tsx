import { formatCurrency } from "@/utils";
import { Modal } from "antd";
import React, { useState } from "react";
interface ModalDeliveryProps {
    isModalOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    setIsModalOpen?: (value: boolean) => void; // Nếu bạn định dùng sau này
    title: string;
    listDelivery: any[];
    selectedDelivery;
    setSelectedDelivery;
}
export default function ModalDelivery({
    isModalOpen,
    handleOk,
    handleCancel,
    setIsModalOpen,
    title,
    listDelivery,
    selectedDelivery,
    setSelectedDelivery,
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
                    {listDelivery.map((element) => {
                        const isSelected = element.id === selectedDelivery;
                        return (
                            <div
                                key={element.id}
                                className={`border rounded-md p-3 flex justify-between items-start mb-2 cursor-pointer ${
                                    isSelected
                                        ? "border-orange-400 bg-orange-50"
                                        : "border-gray-200"
                                }`}
                                onClick={() => setSelectedDelivery(element.id)}
                            >
                                <div className="flex flex-col space-y-1">
                                    <span className="text-base font-medium text-gray-800">
                                        {element.name}
                                    </span>
                                    <span className="text-sm text-gray-800">
                                        {formatCurrency(element.fee)}
                                    </span>
                                    <div className="text-green-600 text-sm flex items-center">
                                        🚚 {" " + element.description}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="text-orange-500 text-xl font-bold">
                                        ✔
                                    </div>
                                )}
                                {!isSelected && (
                                    <div className="text-white text-xl font-bold"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Modal>
        </div>
    );
}
