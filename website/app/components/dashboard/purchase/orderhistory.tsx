"use client";
import React, { useContext, useEffect, useState } from "react";
import { notification, Space, Tabs } from "antd";

// import { Link, Navigate } from "react-router-dom";
import { Empty } from "antd";
import { Divider } from "antd";
import Link from "next/link";
import { formatCurrency } from "@/utils";
import { useStore } from "@/src/stores";
import { observer } from "mobx-react-lite";
import { AccountObservable } from "@/src/stores/account";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import OrderApi from "../../../../Api/user/order";
// import { formatCurrency } from "../../../../until";
// import CartAPI from "../../../../Api/user/cart";
// import { toast } from "react-toastify";
// import { queryClient } from "../../../..";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../../../context/app.context";
// import ModalReviewProduct from "./ModalReviewProduct";
// import { Helmet } from "react-helmet-async";
// import useQueryParams from "../../../../hook/useSearchParam";
// import paymentAPI from "../../../../Api/user/payment.js";
import { useRouter } from "next/navigation";

export enum order_status {
  CANCELLED = -1, // Đã hủy đơn hàng
  PENDING = 0, // Đang chờ xử lí
  CONFIRMED = 1, // Đã xác nhận đơn hàng và chờ hàng xuất kho
  EXPORTED = 2, // Đã xuất kho thành công và chuẩn bị bàn giao cho đơn vị vận chuyển
  HAND_OVERED = 3, // Đã bàn giao hàng cho đơn vị vận chuyển
  DELIVERING = 4, // Đang vận chuyển hàng từ nơi xa về gần nơi của khách hàng
  SHIPPING = 5, // Hàng đã đến gần khách và đang trong quá trình giao trực tiếp
  DELIVERED = 6, // Đã giao hàng thành công
  FAILED_DELIVERY = 7, // Giao hàng thất bại
  All = undefined
}
const OrderHistory = observer(() => {
    const router = useRouter();
    const store = useStore();
    const StoreOrder = store.orderObservable;
    const StoreCart = store.cartObservable;
    // lấy ra account
    const AccountStore = store.accountObservable;
    const [IdOrder, setIdOrder] = useState("");
    const [IdProduct, setIdProduct] = useState("");
    const [isActive, setActive] = useState("All");

    const ORDER_STATUS = [
        { name: "Tất cả", status: "All" },
        // đang chờ khách hàng  thanh toán , chuyển khoản  :
        { name: "Đang chờ", status: "PENDING" },
        // admin xác nhận đơn đã gói hàng cb vận chuyển
        { name: "Đã xác nhận", status: "CONFIRMED"  },
        // shiper lấy hàng và đang giao đơn hàng  : vận chuyển
        // { name: "Xuất kho", status: "EXPORTED" },
        // {name : "Đã bàn giao cho vận chuyển",status :"HAND_OVERED"},
        { name: "Đang vận chuyển", status: "DELIVERING" },
        { name: "Đang giao hàng", status: "SHIPPING" },
        // đã giao cho khách hàng , kh nhận thành công
        { name: "Đã giao", status: "DELIVERED" },
        // hủy ở giai đoạn
        { name: "Đã hủy", status: "CANCELLED" },
        
    ];




    useEffect(() => {
        const fetchData = async () => {
            await AccountStore.getAccount(); // chờ lấy account trước
            const account = AccountStore.account;
          //  await StoreOrder.getListOrderCustomer( account?.userId ,""); // ví dụ dùng account để truyền query
            await StoreOrder.getListOrder( {search:account?.email }); // ví dụ dùng account để truyền query
            setDataAll(StoreOrder.data.orders);
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get("status");
            const orderCode= urlParams.get("orderCode");
            if (status === "PAID") {
                notification.success({
                    message: "Thanh toán thành công",
                    description: "Đơn hàng của bạn đã thanh toán thành công.",
                });
            } else if (status == "CANCELLED") {
                await StoreCart.cancel_order_payos(orderCode)
                const success_status = [200, 201, 204];
                if(success_status.includes(StoreCart.status)){
                    notification.error({
                        message: "Thanh toán thất bại",
                        description: "Đơn hàng của bạn đã bị huỷ.",
                    });
                }
            }
        };

        fetchData();
    }, []);

    const [dataAll, setDataAll] = useState([]);
    useEffect(() => {
        const account = AccountStore.account;
        if (isActive && isActive !== "All") {
        fetchData({search :account?.email ,order_status: order_status[isActive]})
        } else if (isActive == "All") {
             
            fetchData({search :account?.email })
            
        }
    }, [ isActive]);


    const fetchData = async (query ?: {
        search ?: string ,
        order_status ?: order_status
    } ) => { 
            await StoreOrder.getListOrder(query); 
            setDataAll(StoreOrder.data.orders);
    }


    const handleBuyAgain = async (order_detail) => {
        let arrayIdCart = []; // Declare the array before the loop
        await StoreCart.clearSelectedCart();
        try {
            for (const element of order_detail) {
                const cart_item = {
                    quantity: element.quantity,
                    sku_id: element.skus.id,
                };
                await StoreCart.BuyAgain_InOrder({ cart_item });
            }
            if (StoreCart.status == 201) {
                notification.success({
                    message: "Thêm lại sản phẩm thành công",
                    description: "Đang chuyển đến giỏ hàng...",
                    duration: 2,
                });

                // Đợi 2 giây trước khi điều hướng (tùy chọn)
                setTimeout(() => {
                    router.push("/cart");
                }, 200);
            }
        } catch (error) {
            // Handle error in case the mutation fails
            console.error("Failed to add product to cart:", error);
        }
    };

    const handleCancelOrder = async (idOrder) => {
        await StoreOrder.cancelOrder(idOrder, "I don't want it anymore");
        if (StoreOrder.status === 200) {
            notification.success({
                message: "Hủy Đơn thành công",
            });
        } else {
            notification.success({
                message: "Hủy Đơn thất bại",
            });
        }
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = (order_id, product_id) => {
        setIdOrder(order_id);
        setIdProduct(product_id);
        setIsModalOpen(true);
    };
    return (
        <div className="">
            <div className="flex justify-between  ">
                {ORDER_STATUS?.map((element) => {
                    return (
                        <div
                            className={`flex flex-1 items-center justify-center border-b-2 cursor-pointer ${
                                isActive === element.status
                                    ? "text-red-600  border-red-600"
                                    : "border-white"
                            }`}
                            onClick={() => {
                                setActive(element.status);
                            }}
                        >
                            <p className="p-4">{element.name}</p>
                        </div>
                    );
                })}
            </div>
            <div className="">
                {dataAll ? (
                    dataAll?.map((element) => {
                        return (
                            <div key={element?.order_id}>
                                {element?.order_details?.map((detail) => (
                                    // detail_id
                                    <div
                                        className="flex mt-7 p-2"
                                        key={detail?.id}
                                    >
                                        <div className="flex-shrink-0 w-20 h-20">
                                            <Link
                                                href={`/purchase/order
                        /${element.id}`}
                                            >
                                                <img
                                                    src={detail?.skus?.image}
                                                    alt={detail.product_name}
                                                    className="w-full h-full rounded-lg object-contain"
                                                />
                                            </Link>
                                        </div>
                                        <div className="flex flex-grow ml-3">
                                            <div className="flex flex-col justify-between">
                                                <Link
                                                    href={`/purchase/order/${element.id}`}
                                                >
                                                    <p className="font-semibold line-clamp-2">
                                                        {
                                                            detail?.skus
                                                                ?.product?.title
                                                        }
                                                    </p>
                                                </Link>
                                                <span className="text-sm">
                                                    Phân loại hàng:{" "}
                                                    {detail?.skus?.name}
                                                </span>
                                                <span className="text-sm">
                                                    Số lượng: {detail?.quantity}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 ml-3 items-center gap-x-4">
                                            <span className="line-through text-gray-500">
                                                ₫
                                                {parseInt(
                                                    detail.skus.price_sold
                                                ).toLocaleString()}
                                            </span>
                                            <span className="text-red-500 font-semibold">
                                                ₫
                                                {(
                                                    Number(
                                                        detail.skus.price_sold
                                                    ) * detail.quantity
                                                ).toLocaleString()}
                                            </span>
                                            {element.order_status ===
                                                "DELIVERED" && (
                                                <button
                                                    className="p-3 border border-blue-600 text-blue-600   rounded-md"
                                                    onClick={() =>
                                                        showModal(
                                                            detail.order_id,
                                                            detail.product_id
                                                        )
                                                    }
                                                >
                                                    Đánh giá
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-end font-semibold text-lg mr-3">
                                    Tổng tiền:{" "}
                                    {formatCurrency(element.total_price)}
                                </div>
                                <div className="flex gap-x-5">
                                    <button
                                        className="text-white bg-red-500  rounded-lg py-3 px-6  "
                                        onClick={() =>
                                            handleBuyAgain(
                                                element.order_details
                                            )
                                        }
                                    >
                                        Mua lại{" "}
                                    </button>
                                    <Link
                                        href={`/purchase/order/${element.id}`}
                                    >
                                        <button className="text-white bg-red-500  rounded-lg py-3 px-6">
                                            Xem chi tiết đơn hàng
                                        </button>
                                    </Link>
                                    {element.order_status === "PENDING" && (
                                        <button
                                            className="text-white bg-red-500   rounded-lg py-3 px-6  "
                                            onClick={() =>
                                                handleCancelOrder(element.id)
                                            }
                                        >
                                            Hủy đơn hàng{" "}
                                        </button>
                                    )}
                                </div>
                                <Divider
                                    style={{
                                        borderColor: "#7cb305",
                                    }}
                                ></Divider>
                            </div>
                        );
                    })
                ) : (
                    <>
                        <Empty />;
                    </>
                )}
                {dataAll?.length === 0 && (
                    <Empty style={{ marginTop: "50px" }} />
                )}
                {/* <ModalReviewProduct
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setIdOrder={setIdOrder}
          setIdProduct={setIdProduct}
          IdOrder={IdOrder}
          IdProduct={IdProduct}
        /> */}
            </div>
        </div>
    );
});
export default OrderHistory;
