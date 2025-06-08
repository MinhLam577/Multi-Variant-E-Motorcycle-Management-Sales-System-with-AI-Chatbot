import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/stores";
import { formatCurrency } from "@/utils";
const Delivery = observer(() => {
    const store = useStore();
    const storeDelivery = store.deliveryObservable;
    return (
        <div className=" mt-8">
            <div className="font-bold text-[18px] text-gray-800 mb-2  pb-1">
                Phương thức vận chuyển
            </div>

            <div className="flex mt-4 lg:flex-row flex-col">
                <div className="w-[70%] flex-col">
                    <div className="font-medium">
                        Vận Chuyển {storeDelivery?.data?.detailDelivery?.name}
                    </div>
                    <div className="text-sm mt-1">
                        Dự kiến giao hàng:{" "}
                        {storeDelivery?.data?.detailDelivery?.description} ngày
                        không bao gồm thứ 7, chủ nhật
                    </div>
                </div>

                <div className="flex w-[30%] ">
                    <div
                        className="text-[#05a] cursor-pointer flex-grow flex items-center"
                        onClick={() => {
                            //   setModalDelivery(true);
                        }}
                    >
                        Thay đổi
                    </div>
                    <div className="flex items-center  ">
                        {storeDelivery.data.detailDelivery?.fee == "0.00"
                            ? "free"
                            : formatCurrency(
                                  storeDelivery?.data?.detailDelivery?.fee
                              )}
                    </div>
                </div>
            </div>
        </div>
    );
});
export default Delivery;
