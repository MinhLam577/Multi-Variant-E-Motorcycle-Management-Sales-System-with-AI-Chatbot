"use client";
import React, { useEffect, useState } from "react";

import { message, Modal, notification, Popconfirm } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Pagination, Spin, Flex } from "antd";
import { AddressApi } from "@/src/api/address";
import { useStore } from "@/src/stores";
import { observer } from "mobx-react-lite";
import AddressModalCreate from "./AddressModalCreate";
import AddressModalUpdate from "./AddressModalUpdate";
import apiClient from "@/src/api/apiClient";
import endpoints from "@/src/api/endpoints";
const Address = observer(() => {
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const pageSize = 3; // Số mục trên mỗi trang
    const [dataAddress, setAddress] = useState<any>([]);
    // const queryClient = useQueryClient();

    // const { data, isLoading } = useQuery({
    //   queryKey: ["getAddress"],
    //   queryFn: AddressApi.getAddress_receive,
    // });
    // Chia dữ liệu theo trang
    const store = useStore();
    const storeAccount = store.accountObservable;
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        await storeAccount.getAccount();
        const idCustomer = storeAccount?.account?.userId;
        if (idCustomer) {
            const data = await AddressApi.getListAddressByCustomer(idCustomer);
            setAddress(data);
        }
    };
    const currentData = dataAddress?.data?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const [openAddressModalUpdate, setOpenAddressModalUpdate] = useState(false);
    const [dataAddressUpdate, setAddressDataUpdate] = useState(null);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const hanleDeleteAddress = async (id) => {
        const data = await apiClient.delete(
            endpoints.receive_address.delete(id)
        );

        if (data && data.data) {
            message.success("Xóa địa chỉ thành công");
            setOpenModalCreate(false);
            await fetchData();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
            });
        }
    };
    const svgElement = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
        </svg>
    );

    const handleSetDefaultAddress = async (idAddress) => {
        const data = await apiClient.patch(
            endpoints.receive_address.setAddressDefault(idAddress)
        );
        if (data.status == 200) {
            message.success("Thiết lập địa chỉ mặc định thành công");
            await fetchData();
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
            });
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Số địa chỉ nhận hàng
                </h2>
                <button
                    onClick={() => setOpenModalCreate(true)}
                    className="text-[#1A51A2] rounded-lg px-3 py-2 border border-[#1A51A2]  flex items-center hover:opacity-75 hover:bg-gray-100"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                    Thêm địa chỉ
                </button>
            </div>

            <Flex gap="middle" vertical>
                <Spin spinning={false} tip="Loading...">
                    {currentData?.map((element, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row justify-between border rounded-md p-4 mb-4 shadow-sm bg-white"
                        >
                            <div className="w-full md:w-[80%]">
                                <div className="mb-2">
                                    <span className="font-semibold">
                                        {element.receiver_name}
                                    </span>
                                    <span className="mx-2">|</span>
                                    <span>0865446276</span>
                                </div>
                                <div className="text-gray-700 text-sm leading-relaxed">
                                    {element.street +
                                        " , " +
                                        element.ward +
                                        " , " +
                                        element.district +
                                        " , " +
                                        element.province}
                                </div>

                                {element.is_default == true && (
                                    <span className="inline-block mt-2 rounded px-2 py-[2px] text-xs font-semibold text-orange-600 ">
                                        Mặc định
                                    </span>
                                )}
                            </div>
                            <div className="w-full md:w-[20%] flex justify-end items-center gap-x-4 mt-2 md:mt-0">
                                {/* Nút sửa/xóa nếu có */}
                                <Popconfirm
                                    placement="leftTop"
                                    title={"Xác nhận xóa user"}
                                    description={
                                        "Bạn có chắc chắn muốn xóa user này ?"
                                    }
                                    onConfirm={() =>
                                        hanleDeleteAddress(element.id)
                                    }
                                    okText="Xác nhận"
                                    cancelText="Hủy"
                                >
                                    <span
                                        style={{
                                            cursor: "pointer",
                                            margin: "0 20px",
                                        }}
                                    >
                                        <DeleteTwoTone twoToneColor="#ff4d4f" />
                                    </span>
                                </Popconfirm>

                                <EditTwoTone
                                    twoToneColor="#f57800"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        setOpenAddressModalUpdate(true);
                                        setAddressDataUpdate(element);
                                    }}
                                />
                                <button
                                    className={`rounded-sm border px-4 py-1 transition duration-200
                    ${
                        element.is_default
                            ? "text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed"
                            : "text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer"
                    }
                  `}
                                    onClick={() => {
                                        if (!element.is_default)
                                            handleSetDefaultAddress(element.id);
                                    }}
                                    disabled={element.is_default}
                                >
                                    Thiết lập mặc định
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="w-full flex justify-center mt-6">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={dataAddress?.data?.length}
                            onChange={onPageChange}
                        />
                    </div>
                </Spin>
            </Flex>

            <AddressModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchUser={fetchData}
                userID={storeAccount?.account?.userId}
            />

            <AddressModalUpdate
                openAddressModalUpdate={openAddressModalUpdate}
                setOpenModalUpdate={setOpenAddressModalUpdate}
                dataAddressUpdate={dataAddressUpdate}
                setAddressDataUpdate={setAddressDataUpdate}
                fetchUser={fetchData}
                userID={storeAccount?.account?.userId}
            />
        </div>
    );
});
export default Address;
