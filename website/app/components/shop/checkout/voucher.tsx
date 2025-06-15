"use client";

import { useState } from "react";
import ModalVoucher from "./modalVoucher/modalVoucher";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/stores";

const VoucherSection = observer(({ storeVoucher }: any) => {
    const store = useStore();
    // const storeVoucher = store.voucherObservable;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = async () => {
        // await storeVoucher.getListVoucher_of_User();
        setIsModalOpen(true);
    };
    return (
        <>
            <div className="flex justify-between items-center py-4 border-b mt-4">
                <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-800">
                        Hồng Sơn Voucher
                    </span>
                </div>
                <button
                    className="text-sm text-blue-600 hover:underline font-medium"
                    onClick={showModal}
                >
                    Chọn Voucher
                </button>
            </div>
            <ModalVoucher
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                showModal={showModal}
                listVoucher_User={storeVoucher?.data}
            />
        </>
    );
});

export default VoucherSection;
