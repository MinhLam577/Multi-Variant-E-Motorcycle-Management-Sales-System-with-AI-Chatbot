import React from "react";
import Link from "next/link";
import { Button, ConfigProvider, Empty, Flex, Popover } from "antd";
import { formatCurrency } from "@/utils";
const text = (
  <div className="text-base font-semibold text-gray-800">Sản phẩm mới thêm</div>
);

const buttonWidth = 200;
const PopoverCart = ({ cart, dataCart = [] }) => {
  console.log(dataCart);
  const content = (
    <div className="w-full overflow-y-auto ">
      {dataCart.length === 0 ? (
        <Empty />
      ) : (
        <div className="flex flex-col gap-3">
          {dataCart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                  {/* Ảnh sản phẩm */}
                  <img
                    src={item.skus.image}
                    alt="Sản phẩm"
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="text-sm text-gray-700 truncate w-[250px]">
                  {item.skus.product.title}
                </p>
              </div>
              <div className="text-sm text-red-500 font-semibold whitespace-nowrap">
                {formatCurrency(item.skus.price_sold)}
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
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
        <Flex justify="center" align="center" style={{ whiteSpace: "nowrap" }}>
          <Popover placement="bottomRight" title={text} content={content}>
            {cart}
          </Popover>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};
export default PopoverCart;
