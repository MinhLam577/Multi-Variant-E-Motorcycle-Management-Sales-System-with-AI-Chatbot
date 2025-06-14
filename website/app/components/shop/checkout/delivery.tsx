import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/stores";
import { formatCurrency } from "@/utils";
import ModalDelivery from "./modalDelivery/modalDelivery";
const Delivery = observer(() => {
  const store = useStore();
  const storeDelivery = store.deliveryObservable;

  console.log(storeDelivery?.data?.detailDelivery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(
    // storeDelivery?.data?.detailDelivery?.id
    ""
  );
  useEffect(() => {
    // ban đầu sẽ ko có -> khúc sau có data -> re-render lại
    setSelectedDelivery(storeDelivery?.data?.detailDelivery?.id);
  }, [storeDelivery?.data?.detailDelivery?.id]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    await storeDelivery.getDetailDelivery(selectedDelivery);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setSelectedDelivery(storeDelivery?.data?.detailDelivery?.id);
    setIsModalOpen(false);
  };
  return (
    <>
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
              {storeDelivery?.data?.detailDelivery?.description} , ngày không
              bao gồm thứ 7, chủ nhật
            </div>
          </div>

          <div className="flex w-[30%] ">
            <div
              className="text-[#05a] cursor-pointer flex-grow flex items-center"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Thay đổi
            </div>
            <div className="flex items-center  ">
              {storeDelivery.data.detailDelivery?.fee == "0.00"
                ? "free"
                : formatCurrency(storeDelivery?.data?.detailDelivery?.fee)}
            </div>
          </div>
        </div>
      </div>
      <ModalDelivery
        handleOk={handleOk}
        handleCancel={handleCancel}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        title="Chọn phương thức vận chuyển"
        listDelivery={storeDelivery?.data?.listMethodDelivery}
        selectedDelivery={selectedDelivery}
        setSelectedDelivery={setSelectedDelivery}
      />
    </>
  );
});
export default Delivery;
