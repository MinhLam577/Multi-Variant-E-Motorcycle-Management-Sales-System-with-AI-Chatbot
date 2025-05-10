"use client";
import { useStore } from "@/src/stores";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ModalListAddress from "./modalAddress/ModalListAddress";
const AddressDefault = observer(() => {
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [OpenListAddress, setOpenListAddress] = useState(false);
  const store = useStore();
  const storeAccount = store.accountObservable;
  const storeAddress = store.addressObservable;
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       await storeAccount.getAccount();

  //       // Delay nhỏ 1 tick để MobX update xong
  //       setTimeout(async () => {
  //         const idCustomer = storeAccount.account?.userId;
  //         if (idCustomer) {
  //           await storeAddress.getAddressDefault(idCustomer);
  //           await storeAddress.getListAddress(idCustomer);
  //           console.log(storeAddress?.data?.addressDefault);
  //           console.log(storeAddress?.data?.listAddress);
  //         }
  //       }, 0);
  //     };

  //     fetchData();
  //   }, []);

  return (
    <>
      <div className="w-full mt-4 border-t-[6px] border-dashed border-[#e5e5e5]">
        <div className="flex items-center gap-2 text-[18px] font-semibold text-[#ee4d2d] py-3">
          <svg
            height={16}
            viewBox="0 0 12 16"
            width={12}
            className="text-[#ee4d2d]"
          >
            <path
              d="M6 3.2c1.506 0 2.727 1.195 2.727 2.667 0 1.473-1.22 2.666-2.727 2.666S3.273 7.34 3.273 5.867C3.273 4.395 4.493 3.2 6 3.2zM0 6c0-3.315 2.686-6 6-6s6 2.685 6 6c0 2.498-1.964 5.742-6 9.933C1.613 11.743 0 8.498 0 6z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
          Địa chỉ nhận hàng{" "}
        </div>
        {storeAddress?.data?.addressDefault && (
          <div className="flex mt-1">
            <div className="w-[40%]">
              <div className="text-sm font-medium text-gray-800 mb-1">
                <span className="text-base text-black">
                  {storeAddress?.data?.addressDefault?.receiver_name}
                </span>
                {" - "}
                <span className="text-sm text-black">
                  {storeAddress?.data?.addressDefault?.receiver_phone}
                </span>
              </div>

              <span className="rounded-sm  bg-blue-100 px-1.5 py-[2px] text-xs font-medium text-blue-600 ">
                Mặc định
              </span>
            </div>
            <div className="w-[60%] flex md:flex-col lg:flex-row  justify-between">
              <div className="">
                {storeAddress?.data?.addressDefault.street +
                  "," +
                  storeAddress?.data?.addressDefault.ward +
                  " " +
                  storeAddress?.data?.addressDefault.district +
                  " " +
                  storeAddress?.data?.addressDefault.province}
              </div>
              <div
                className="text-[#05a] cursor-pointer"
                onClick={() => {
                  console.log(storeAddress?.data?.listAddress);
                  setOpenListAddress(true);
                }}
              >
                Thay đổi
              </div>
            </div>
          </div>
        )}
        {!storeAddress?.data?.addressDefault && (
          <div className="flex mt-4 items-center gap-5 ">
            <div
              className="font-bold"
              onClick={() => {
                setIsModalOpen1(true);
              }}
            >
              Thêm địa chỉ
            </div>
            <div
              className="text-white  "
              onClick={() => {
                setIsModalOpen1(true);
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
        )}
      </div>
      <ModalListAddress
        OpenListAddress={OpenListAddress}
        setOpenListAddress={setOpenListAddress}
        title="Địa chỉ của tôi"
        getAddress={storeAddress?.data?.listAddress}
        storeAddress={storeAddress}
        idCustomer={storeAccount.account?.userId}
        // valueAddress={valueAddress}
        // setValueAddress={setvalueAddress}
      />
    </>
  );
});
export default AddressDefault;
