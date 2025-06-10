import React, { useState } from "react";
import { Button, Modal } from "antd";
import { StopOutlined } from "@ant-design/icons";

import {
    QuestionCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/stores";
import { formatCurrency } from "@/utils";
interface Props {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isModalOpen: boolean;
    showModal: () => void;
    listVoucher_User: any;
}
const ModalVoucher = observer((prop: Props) => {
    const store = useStore();
    const storeVoucher = store.voucherObservable;
    const [selectedCode, setSelectedCode] = useState("");
    const [selectedVoucherID, setSelectedVoucherID] = useState("");
    const { setIsModalOpen, isModalOpen, showModal } = prop;

    console.log(prop.listVoucher_User);
    const handleOk = async () => {
        console.log(selectedCode);
        console.log(selectedVoucherID);
        setIsModalOpen(false);
        setSelectedCode("");
        await storeVoucher.getUser_Voucher_Detail(selectedVoucherID);
    };

    const handleCancel = () => {
        setSelectedCode("");
        setIsModalOpen(false);
        setSelectedVoucherID("");
    };

    const handleApply = () => {
        console.log(selectedCode);
        console.log(selectedVoucherID);
        setIsModalOpen(false);
        setSelectedCode("");
    };
    const vouchers = [
        {
            id: 1,
            title: "FREE SHIP",
            value: "Giảm tối đa ₫65k",
            minOrder: "Đơn Tối Thiểu ₫0",
            tag: "Dành riêng cho bạn",
            expired: "HSD: 08.05.2025",
            condition: "Điều Kiện",
            appOnly: true,
        },
        {
            id: 2,
            title: "FREE SHIP",
            value: "Giảm tối đa ₫70k",
            minOrder: "Đơn Tối Thiểu ₫0",
            expired: "Sắp hết hạn: Còn 1 ngày",
            condition: "Điều Kiện",
            appOnly: true,
            quantity: 2,
        },
    ];

    return (
        <>
            <Modal
                title={
                    <div className="flex justify-between items-center w-full">
                        <span className="text-base font-medium">
                            Danh Sách Voucher Của Bạn
                        </span>
                        <div className="flex items-center justify-center text-sm text-gray-500 cursor-pointer hover:text-black gap-1">
                            Hỗ Trợ
                            <QuestionCircleOutlined className="text-base" />
                        </div>
                    </div>
                }
                closable={false} // Ẩn nút "x"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                {/* Tabs + Button */}
                <div className="flex items-center gap-2 my-4">
                    <button className="px-4 py-1 border border-gray-300 rounded bg-white">
                        Mã Voucher
                    </button>
                    <input
                        type="text"
                        placeholder="Mã voucher"
                        className="flex-1 px-3 py-1 border border-gray-300 rounded outline-none"
                        value={selectedCode}
                        onChange={(e) => setSelectedCode(e.target.value)}
                        readOnly
                    />
                    <button
                        className={`ml-auto px-4 py-1 rounded font-semibold flex items-center gap-1 ${
                            selectedCode
                                ? "bg-[#ee4d2d] text-white cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => selectedCode && handleApply()}
                        disabled={!selectedCode}
                    >
                        {selectedCode ? "ÁP DỤNG" : "ÁP DỤNG"}
                    </button>
                </div>

                {/* Section title */}
                {/* <div className="font-semibold mb-2">Mã Miễn Phí Vận Chuyển</div> */}
                <div className="text-sm text-gray-500 mb-3">
                    Có thể chọn 1 Voucher
                </div>

                {/* Voucher list */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {prop.listVoucher_User?.map((v) => (
                        <div
                            key={v.id}
                            className="border rounded flex overflow-hidden shadow-sm relative"
                        >
                            <div className="bg-teal-300 text-white p-4 text-center w-32">
                                <div className="font-bold leading-tight">
                                    {v.voucher.voucher_name}
                                </div>
                                <div className="text-xs mt-1">
                                    {v.voucher.description}
                                </div>
                            </div>
                            <div className="flex-1 p-4 text-sm relative">
                                <div className="font-semibold">
                                    {v.voucher.fixed ? (
                                        <>Giảm {v.voucher.discount_amount}%</>
                                    ) : (
                                        <>
                                            Giảm{" "}
                                            {formatCurrency(
                                                v.voucher.discount_amount
                                            )}
                                        </>
                                    )}
                                </div>
                                <div>{v.minOrder}</div>
                                {v.tag && (
                                    <div className="text-pink-500">{v.tag}</div>
                                )}
                                <div className="text-gray-500">
                                    {v.voucher.end_date}{" "}
                                </div>
                                {!v.is_used && (
                                    <span className=" text-xs bg-red-500 text-white px-1.5 rounded-full">
                                        x 1
                                    </span>
                                )}
                            </div>
                            <div className="p-4 flex items-center">
                                <input
                                    type="radio"
                                    name="voucher"
                                    onChange={() => {
                                        setSelectedCode(v.voucher.voucher_code);
                                        setSelectedVoucherID(v.id);
                                    }}
                                    checked={
                                        selectedCode === v.voucher.voucher_code
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer buttons */}
                <div className="mt-6 flex justify-end gap-4 border-t pt-4">
                    <Button onClick={handleCancel}>TRỞ LẠI</Button>
                    <Button type="primary" danger onClick={handleOk}>
                        OK
                    </Button>
                </div>
            </Modal>
        </>
    );
});

export default ModalVoucher;
