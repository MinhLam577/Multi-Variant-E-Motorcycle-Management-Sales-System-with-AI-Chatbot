import React, { useEffect, useState } from "react";
import { Button, message, Modal } from "antd";
// import UpdateAddress from "../../Account/address/component/updateAddressRecieve/UpdateAddress";
import { Divider } from "antd";
import AddressModalCheckoutCreate from "./AddressModalCheckOut_Create";
// import AddressForm from "../../Account/address/component/createAddress/CreateAddress";
// import ModalAddAddress from "./ModalAddAddress";

const ModalListAddress = ({
  OpenListAddress,
  setOpenListAddress,
  getAddress,
  title,
  storeAddress,
  idCustomer,
  // valueAddress,
  // setValueAddress,
}) => {
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<
    string | undefined
  >();
  const handleOk = async () => {
    // setValueAddress(+value);
    const { id } = getAddress.find((addr) => addr.is_default);
    console.log(id + "" + selectedAddressId);
    if (selectedAddressId !== id) {
      console.log(selectedAddressId);
      // goi api ở đây
      await storeAddress.updateAddressDefaultCustomer(
        idCustomer,
        selectedAddressId
      );
      if (storeAddress.status == 200) {
        message.success(storeAddress.successMsg);
      }
    }
    setOpenListAddress(false);
  };
  const handleCancel = () => {
    const defaultAddress = getAddress.find((addr) => addr.is_default);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }
    setOpenListAddress(false);
  };
  const [value, setValue] = useState();;
  const handleCancel1 = () => {
    setOpenListAddress(false);
  };

  // Gán mặc định khi modal mở
  useEffect(() => {
    const defaultAddress = getAddress.find((addr) => addr.is_default);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [getAddress]);
  return (
    <>
      <Modal
        title={title}
        open={OpenListAddress}
        centered
        footer={null}
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleCancel1}
      >
        <>
          {getAddress.map((element) => {
            return (
              <>
                <div className="flex flex-col md:flex-row mt-3  ">
                  <div className="w-[80%]">
                    <div className="my-2 flex items-center gap-2 ">
                      <input
                        type="radio"
                        className=" w-4 h-4 border border-gray-300 rounded-full"
                        value={element.id}
                        checked={selectedAddressId === element.id}
                        onChange={(e) => {
                          setSelectedAddressId(e.target.value);
                        }}
                      />
                      <span className="font-bold">{element.receiver_name}</span>
                      <span className="mx-2">|</span>
                      <span>{element.receiver_phone}</span>
                    </div>
                    <div className="my-2">
                      {element.street +
                        " , " +
                        element.ward +
                        " , " +
                        element.district +
                        " , " +
                        element.province}
                    </div>
                    <span
                      className={`mt-2 rounded-sm px-1 py-[4px] text-xs font-medium   ${
                        element.is_default ? "text-[#CE4712] bg-[#FFE0C7]" : ""
                      } `}
                    >
                      {element.is_default ? "Mặc định" : ""}
                    </span>
                  </div>
                  <div className="w-[20%]  ">
                    <div className="flex flex-grow justify-end gap-x-5 items-center">
                      {/* <UpdateAddress
                          receiver_address_id={+element.receiver_address_id}
                        /> */}
                    </div>
                  </div>
                </div>
                <Divider />
              </>
            );
          })}
        </>
        <div className=" flex gap-x-10 justify-between ">
          <div className="font-bold flex gap-x-2 justify-center items-center">
            Thêm địa chỉ
            <div
              className="text-white  "
              onClick={() => {
                setIsModalOpen2(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 bg-[#1A51A2] rounded-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 bg-blue rounded-lg"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button className="px-3 py-2 bg-blue rounded-lg" onClick={handleOk}>
              Lưu
            </button>
          </div>
        </div>
      </Modal>

      <AddressModalCheckoutCreate
        openModalCreate={isModalOpen2}
        setOpenModalCreate={setIsModalOpen2}
        fetchUser={storeAddress?.data?.listAddress}
        userID={idCustomer}
      />
    </>
  );
};
export default ModalListAddress;
