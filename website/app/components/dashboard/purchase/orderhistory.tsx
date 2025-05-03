"use client";
import React, { useContext, useEffect, useState } from "react";
import { Space, Tabs } from "antd";

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

const OrderHistory = observer(() => {
  const store = useStore();
  const StoreOrder = store.orderObservable;
  // lấy ra account
  const AccountStore = store.accountObservable;

  //   const { isAuthenticated, logout, checkedProducts, setCheckedProducts } =
  //     useContext(AuthContext);
  //   const navigate = useNavigate(); // Hook để điều hướng
  const [IdOrder, setIdOrder] = useState("");
  const [IdProduct, setIdProduct] = useState("");
  const [isActive, setActive] = useState("All");

  const ORDER_STATUS = [
    { name: "Tất cả", status: "All" },
    // đang chờ khách hàng  thanh toán , chuyển khoản  :
    { name: "Đang chờ", status: "PENDING" },
    // admin xác nhận đơn đã gói hàng cb vận chuyển
    { name: "Đã xác nhận", status: "CONFIRMED" },
    // shiper lấy hàng và đang giao đơn hàng  : vận chuyển
    { name: "Xuất kho", status: "EXPORTED" },
    { name: "Đang vận chuyển", status: "DELIVERING" },
    { name: "Đang giao hàng", status: "SHIPPING" },
    // đã giao cho khách hàng , kh nhận thành công
    { name: "Đã giao", status: "DELIVERED" },
    // hủy ở giai đoạn
    { name: "Đã hủy", status: "CANCELED" },
    // hủy ở giai đoạn
    { name: "Trả hàng", status: "RETURNED" },
  ];

  //   const { data } = useQuery({
  //     queryKey: ["getOrderApi"],
  //     queryFn: () => {
  //       return OrderApi.getHistoryOrder();
  //     },
  //   });

  useEffect(() => {
    const fetchData = async () => {
      await AccountStore.getAccount(); // chờ lấy account trước
      const account = AccountStore.account;
      // console.log(account);
      await StoreOrder.getListOrder({ customer_id: account?.id }); // ví dụ dùng account để truyền query
    };

    fetchData();
  }, []);

  // console.log(data)
  const [dataAll, setDataAll] = useState([]);
  // Đảm bảo khi StoreOrder.data.orders thay đổi, dữ liệu được cập nhật
  // useEffect(() => {
  //   if (StoreOrder?.data?.orders) {
  //     setDataAll(StoreOrder.data.orders);
  //   }
  // }, [StoreOrder?.data?.orders]); // Khi orders thay đổi, chạy lại effect

  useEffect(() => {
    if (StoreOrder?.data?.orders) {
      setDataAll(StoreOrder.data.orders);
    }
    if (isActive && isActive !== "All") {
      const filter = StoreOrder.data.orders?.filter((element) => {
        return element?.order_status === isActive;
      });
      if (filter) {
        setDataAll(filter);
      }
    } else if (isActive == "All") {
      setDataAll(StoreOrder.data.orders);
    }
  }, [StoreOrder?.data?.orders, isActive]);

  console.log(dataAll);
  const handleBuyAgain = async (order_detail) => {
    let arrayIdCart = []; // Declare the array before the loop
    // console.log(order_detail)
    // Loop through the order details and trigger the mutation for each product
    for (const element of order_detail) {
      //  console.log(element)
      try {
        // const data = await mutateAddProductCart.mutateAsync({
        //   product_id: element.product_id,
        //   cart_quantity: element.order_quantity,
        // });
        // Handle success for each product added to the cart
        //  arrayIdCart.push(data.data.data.cart_id); // Track which products were added
        // console.log('Products added to cart:', arrayIdCart)
        // Invalidate the queries after each successful mutation
        // queryClient.invalidateQueries({ queryKey: ["getCart"] });
      } catch (error) {
        // Handle error in case the mutation fails
        console.error("Failed to add product to cart:", error);
      }
    }

    // After the loop finishes, navigate to the cart page
    // setCheckedProducts((prev) => {
    //   return [...prev, ...arrayIdCart]; // Use spread operator to merge arrays
    // });

    // await navigate("/cart");
    // Optionally, handle any logic after all products have been processed
    console.log("Products added to cart:", arrayIdCart);
  };
  // Them vao gio hang
  //   const mutateAddProductCart = useMutation({
  //     mutationFn: CartAPI.addproduct_inCart,
  //     onError: (error) => {
  //       console.error(
  //         "Lỗi khi thêm sản phẩm vào giỏ hàng:",
  //         error.response.data.message[0]
  //       );
  //     },
  //   });

  //   const Cancel_CartOrder = useMutation({
  //     mutationFn: OrderApi.Cancel_CartOrder,
  //   });

  const handleCancelOrder = (idOrder) => {
    // console.log(idOrder)
    // Cancel_CartOrder.mutate(idOrder, {
    //   onSuccess: () => {
    //     toast.success("Hủy đơn hàng thành công");
    //     queryClient.invalidateQueries({ queryKey: ["getOrderApi"] });
    //   },
    //   onError: () => {
    //     toast.error("Hủy đơn hàng thất bại ");
    //   },
    // });
  };

  const handleCancelOrder1 = (idOrder) => {
    // console.log(idOrder)
    // Cancel_CartOrder.mutate(idOrder, {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries({ queryKey: ["getOrderApi"] });
    //   },
    //   onError: () => {
    //     toast.error("Hủy đơn hàng thất bại ");
    //   },
    // });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (order_id, product_id) => {
    // console.log(order_id, product_id)
    setIdOrder(order_id);
    setIdProduct(product_id);
    setIsModalOpen(true);
  };
  // useEffect(() => {
  //   if (dataAll?.length) {
  //     dataAll.forEach((element) => {
  //       console.log(element);
  //       if (
  //         (element.payment_method_name === "PAYOS" ||
  //           element.payment_method_name === "VNPAY") &&
  //         element.payment_status === "pending"
  //       ) {
  //         handleCancelOrder1(element.order_id);
  //       }
  //     });
  //   }
  // }, [dataAll]);
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
                  <div className="flex mt-7 p-2" key={detail?.id}>
                    <div className="flex-shrink-0 w-20 h-20">
                      <Link
                        href={`/purchase/order
                        /${element.id}`}
                      >
                        <img
                          src="https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m0r1nxglujkfeb@resize_w48_nl.webp "
                          alt={detail.product_name}
                          className="w-full h-full rounded-lg object-contain"
                        />
                      </Link>
                    </div>
                    <div className="flex flex-grow ml-3">
                      <div className="flex flex-col justify-between">
                        <Link href={`/purchase/order/${element.id}`}>
                          <p className="font-semibold line-clamp-2">
                            {detail.name}
                          </p>
                        </Link>
                        <span className="text-sm">Phân loại hàng 200</span>
                        <span className="text-sm">*{detail.quantity}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 ml-3 items-center gap-x-4">
                      <span className="line-through text-gray-500">
                        ₫{parseInt(detail.skus.price_sold).toLocaleString()}
                      </span>
                      <span className="text-red-500 font-semibold">
                        ₫
                        {(
                          Number(detail.skus.price_sold) * detail.quantity
                        ).toLocaleString()}
                      </span>
                      {element.order_status === "DELIVERED" && (
                        <button
                          className="p-3 border border-blue-600 text-blue-600   rounded-md"
                          onClick={() =>
                            showModal(detail.order_id, detail.product_id)
                          }
                        >
                          Đánh giá
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end font-semibold text-lg mr-3">
                  Tổng tiền: {formatCurrency(element.total_price)}
                </div>
                <div className="flex gap-x-5">
                  <button
                    className="text-white bg-red-500  rounded-lg py-3 px-6  "
                    onClick={() => handleBuyAgain(element.order_details)}
                  >
                    Mua lại{" "}
                  </button>
                  <Link href={`/purchase/order/${element.id}`}>
                    <button className="text-white bg-red-500  rounded-lg py-3 px-6">
                      Xem chi tiết đơn hàng
                    </button>
                  </Link>
                  {element.order_status === "PENDING" && (
                    <button
                      className="text-white bg-red-500   rounded-lg py-3 px-6  "
                      onClick={() => handleCancelOrder(element.id)}
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
        {dataAll?.length === 0 && <Empty style={{ marginTop: "50px" }} />}
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
