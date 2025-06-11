"use client";
import React, { useEffect, useState } from "react";
import { Divider } from "antd";
import { Descriptions } from "antd";
import Link from "next/link";
import { generateNameId } from "@/utils";
import { useParams } from "next/navigation";
import { useStore } from "@/src/stores";
// import { Link, useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import OrderApi from "../../../../Api/user/order";
// import { IdcardFilled } from "@ant-design/icons";
// import { generateNameId } from "../../../../until";
export default function DetailOrderHistory({ slug }) {
    const [data, setData] = useState(null);
    const store = useStore();
    const OrderStore = store.orderObservable;
    // const { data } = useQuery({
    //   queryKey: ["getDetailOrder", slug],
    //   queryFn: () => {
    //     return OrderApi.getDatailCartOrder(slug);
    //   },
    // });

    // Để đảm bảo setData chỉ được gọi khi OrderStore.data.order_detail đã có dữ liệu, bạn nên:
    useEffect(() => {
        const getDetailOrder = async () => {
            await OrderStore.getOrderDetail(slug);
            setData(OrderStore.data.order_detail);
        };

        getDetailOrder();
    }, [slug]);

    const receiverInfo = [
        {
            key: "1",
            label: "Tên người nhận",
            children: data?.customer?.username,
        },
        {
            key: "2",
            label: "Số điện thoại",
            children: data?.customer?.phoneNumber,
        },
        {
            key: "3",
            label: "Địa chỉ",
            // children: `${data?.data?.data?.receiver_address}, ${data?.data?.data?.ward_name}, ${data?.data?.data?.district_name}, ${data?.data?.data?.province_name}`,
            children: data?.receive_address?.address,
        },
    ];

    const orderInfo = [
        {
            key: "1",
            label: "Mã đơn hàng",
            children: data?.id,
        },
        {
            key: "2",
            label: "Phương thức thanh toán",
            children: data?.payment_method.name,
        },
        {
            key: "3",
            label: "Phương thức vận chuyển",
            children: data?.delivery_method.name,
        },
        {
            key: "4",
            label: "Tổng tiền",
            children: `₫${parseFloat(data?.total_price).toLocaleString()}`,
        },
    ];
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và thêm số 0 nếu cần
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (0-based nên cần +1)
        const year = date.getFullYear(); // Lấy năm
        const hours = String(date.getHours()).padStart(2, "0"); // Lấy giờ
        const minutes = String(date.getMinutes()).padStart(2, "0"); // Lấy phút

        return `${day}-${month}-${year} ${hours}:${minutes}`; // Ghép thành chuỗi định dạng
    };
    return (
        <div className="">
            <div className="text-xl py-4 px-2 font-semibold">
                Chi tiết đơn hàng
            </div>

            {/* Trạng thái đơn hàng */}
            <div className="bg-slate-300 rounded-lg px-2 py-4">
                <div className="text-lg semibold">
                    {(() => {
                        const statusMap = {
                            PENDING: "Đang xử lý",
                            CONFIRMED: "Đã xác nhận",
                            EXPORTED: "Xuất kho",
                            CANCELED: "Hủy",
                            DELIVERING: "Đang vận chuyển",
                            SHIPPING: "Đang giao hàng",
                            DELIVERED: "Đã giao",
                        };
                        return (
                            statusMap[data?.order_status] ||
                            "Trạng thái không xác định"
                        );
                    })()}{" "}
                    đơn hàng
                </div>
                <div className="">vào {formatDate(data?.updatedAt)}</div>
            </div>

            {/* Sản phẩm đã mua */}
            <div className="mt-7">
                <div className="text-lg p-2 font-semibold">Sản phẩm đã mua</div>
                {data?.order_details?.map((item) => {
                    const productImages = item?.skus.image;
                    return (
                        <div className="flex p-2 mt-4" key={item.id}>
                            <div className="flex-shrink-0 w-20 h-20">
                                <Link
                                    href={`/${generateNameId(
                                        item.skus.product.title,
                                        item.skus.product.id
                                    )}`}
                                >
                                    <img
                                        src={productImages} // Hiển thị ảnh đầu tiên
                                        alt={item.product_name}
                                        className="w-full h-full rounded-lg object-contain"
                                    />
                                </Link>
                            </div>
                            <div className="ml-3 flex-grow">
                                <div className="flex flex-col justify-between gap-y-1">
                                    <Link
                                        href={`/${generateNameId(
                                            item.skus.product.title,
                                            item.skus.product.id
                                        )}`}
                                    >
                                        <p className="font-semibold">
                                            {item.skus.product.title}
                                        </p>
                                    </Link>
                                    <span className="text-sm">
                                        Phân loại hàng: {item.skus.name}
                                    </span>
                                    <span className="text-sm">
                                        Số lượng: {item.quantity}
                                    </span>
                                </div>
                            </div>
                            <div className="flex ml-3 items-center gap-4">
                                <span className="line-through text-gray-500">
                                    ₫
                                    {parseFloat(
                                        item.skus.price_sold
                                    ).toLocaleString()}
                                </span>
                                <span className="text-red-500 font-semibold">
                                    ₫
                                    {(
                                        item.skus.price_sold * item.quantity
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Divider style={{ borderColor: "#7cb305" }} />

            {/* Thông tin người nhận */}
            <div className="p-2">
                <Descriptions
                    title={<div className="text-lg">Thông tin người nhận</div>}
                    items={receiverInfo}
                />
                <div className="mt-2"></div>
                <Descriptions
                    title={<div className="text-lg">Đơn hàng</div>}
                    items={orderInfo}
                />
            </div>
        </div>
    );
}
