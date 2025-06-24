"use client";
import React from "react";
import Link from "next/link";
import { ConfigProvider, Empty, Flex, Popover } from "antd";
import { formatCurrency } from "@/utils";
import "@/public/css/popover.css";
const text = (
    <div className="text-base font-semibold text-gray-800">
        Sản phẩm mới thêm
    </div>
);

const buttonWidth = 200;
const PopoverCart = ({ cart, dataCart = [] }) => {
    const content = (
        <div className="w-auto max-w-sm overflow-y-auto">
            {dataCart.length === 0 ? (
                <Empty />
            ) : (
                <div className="flex flex-col gap-3">
                    {dataCart.map((item, index) => (
                        <Link
                            href={
                                item.skus.product.type === "car"
                                    ? `/listing-single-v1/${item.skus.product.id}`
                                    : `/listing-single-v2/${item.skus.product.id}`
                            }
                            key={index}
                        >
                            <div
                                key={index}
                                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 transition-all cursor-pointer gap-4"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                        <img
                                            src={item.skus.image}
                                            alt="Sản phẩm"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-700 line-clamp-2 max-w-[140px] sm:max-w-[200px]">
                                        {item.skus.product.title}
                                    </p>
                                </div>
                                <div className="text-sm text-red-500 font-semibold whitespace-nowrap">
                                    {formatCurrency(item.skus.price_sold)}
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div className="flex justify-between items-center mt-4 gap-4 flex-col sm:flex-row">
                        <p className="text-[14px] font-medium text-gray-600">
                            {dataCart.length} Thêm Hàng Vào Giỏ
                        </p>
                        <Link
                            href="/cart"
                            className="text-white bg-red-500 hover:bg-red-600 rounded-md px-3 py-2 text-sm font-semibold transition-all duration-300"
                        >
                            Xem Giỏ Hàng
                        </Link>
                    </div>
                </div>
            )}

            {/* Dòng cuối cùng */}
        </div>
    );

    return (
        <ConfigProvider button={{ style: { width: buttonWidth } }}>
            <Flex vertical justify="center" align="center" className="demo">
                <Flex
                    justify="center"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                >
                    <Popover
                        placement="bottomRight"
                        title={text}
                        content={content}
                    >
                        {cart}
                    </Popover>
                </Flex>
            </Flex>
        </ConfigProvider>
    );
};
export default PopoverCart;
