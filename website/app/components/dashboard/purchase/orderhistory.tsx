"use client";
import React, { useEffect, useState } from "react";
import { notification, Skeleton } from "antd";
import { Divider } from "antd";
import Link from "next/link";
import { formatCurrency } from "@/utils";
import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";
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
    All = undefined,
}
const OrderHistory = observer(() => {
    const router = useRouter();
    const store = useStore();
    const StoreOrder = store.orderObservable;
    const StoreCart = store.cartObservable;
    const AccountStore = store.accountObservable;
    const [IdOrder, setIdOrder] = useState("");
    const [IdProduct, setIdProduct] = useState("");
    const [isActive, setActive] = useState("All");
    const [dataAll, setDataAll] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const ORDER_STATUS = [
        { name: "Tất cả", status: "All" },
        // đang chờ khách hàng  thanh toán , chuyển khoản  :
        { name: "Đang chờ", status: "PENDING" },
        // admin xác nhận đơn đã gói hàng cb vận chuyển
        { name: "Đã xác nhận", status: "CONFIRMED" },
        // shiper lấy hàng và đang giao đơn hàng  : vận chuyển
        { name: "Đang vận chuyển", status: "DELIVERING" },
        { name: "Đang giao hàng", status: "SHIPPING" },
        // đã giao cho khách hàng , kh nhận thành công
        { name: "Đã giao", status: "DELIVERED" },
        // hủy ở giai đoạn
        { name: "Đã hủy", status: "CANCELLED" },
    ];

    const fetchData = async (query?: {
        search?: string;
        order_status?: order_status;
    }) => {
        try {
            setIsLoading(true);
            await StoreOrder.getListOrder(query);
            setDataAll(StoreOrder.data.orders);
        } catch (e) {
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProfile = async () => {
        await AccountStore.init();
    };

    // 2. useEffect thứ hai: Xử lý kết quả thanh toán từ URL (chỉ chạy 1 lần duy nhất)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get("status");
        const orderCode = urlParams.get("orderCode");

        // Nếu không có status → không làm gì
        if (!status) return;

        // Kiểm tra đã xử lý chưa (dùng sessionStorage để chống refresh liên tục)
        const processedKey = `payment_processed_${orderCode || status}`;
        if (sessionStorage.getItem(processedKey) === "true") {
            return;
        }

        const processPaymentResult = async () => {
            let shouldNotify = false;

            if (status === "PAID") {
                notification.success({
                    message: "Thanh toán thành công",
                    description: "Đơn hàng của bạn đã thanh toán thành công.",
                });
                shouldNotify = true;
            } else if (status === "CANCELLED" && orderCode) {
                await StoreCart.cancel_order_payos(orderCode);
                const successStatus = [200, 201, 204];
                if (successStatus.includes(StoreCart.status)) {
                    notification.success({
                        message: "Hủy thanh toán thành công",
                        description: "Đơn hàng của bạn đã bị huỷ.",
                    });
                }
                shouldNotify = true;
            }

            // Chỉ đánh dấu đã xử lý nếu thực sự có thông báo
            if (shouldNotify) {
                sessionStorage.setItem(processedKey, "true");

                // Xóa params khỏi URL mà không reload trang
                urlParams.delete("status");
                urlParams.delete("orderCode");
                const cleanUrl = `${window.location.pathname}${
                    urlParams.toString() ? "?" + urlParams.toString() : ""
                }`;
                window.history.replaceState({}, "", cleanUrl);
            }
        };

        processPaymentResult();
    }, []);

    useEffect(() => {
        fetchProfile();
        const account = AccountStore.account;
        if (isActive && isActive !== "All") {
            fetchData({
                search: account?.user?.email,
                order_status: order_status[isActive],
            });
        } else if (isActive == "All") {
            fetchData({ search: account?.user?.email });
        }
    }, [isActive]);
    const handleBuyAgain = async (order_detail) => {
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

                setTimeout(() => {
                    router.push("/cart");
                }, 500);
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
            const account = AccountStore.account;
            fetchData({ search: account?.user?.email });
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
        <>
            <div className="flex justify-between">
                {ORDER_STATUS?.map((element) => {
                    return (
                        <div
                            key={element.name}
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
            <div className="mt-4">
                <Skeleton
                    active={true}
                    loading={isLoading}
                    paragraph={{
                        rows: 11,
                        width: "100%",
                    }}
                >
                    {isLoading
                        ? null
                        : dataAll &&
                          dataAll?.length > 0 &&
                          dataAll?.map((element) => {
                              return (
                                  <div key={element?.id}>
                                      {element?.order_details?.map((detail) => (
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
                                                          src={
                                                              detail?.skus
                                                                  ?.image
                                                          }
                                                          alt={
                                                              detail.product_name
                                                          }
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
                                                                      ?.product
                                                                      ?.title
                                                              }
                                                          </p>
                                                      </Link>
                                                      <span className="text-sm">
                                                          Phân loại hàng:{" "}
                                                          {detail?.skus?.name}
                                                      </span>
                                                      <span className="text-sm">
                                                          Số lượng:{" "}
                                                          {detail?.quantity}
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
                                                              detail.skus
                                                                  .price_sold
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
                                          {element.order_status ===
                                              "PENDING" && (
                                              <button
                                                  className="text-white bg-red-500   rounded-lg py-3 px-6  "
                                                  onClick={() =>
                                                      handleCancelOrder(
                                                          element.id
                                                      )
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
                          })}
                </Skeleton>
            </div>
        </>
    );
});
export default OrderHistory;
