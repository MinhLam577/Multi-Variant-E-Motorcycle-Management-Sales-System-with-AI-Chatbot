import React from "react";
import Link from "next/link";
import { ConfigProvider, Flex, Popover } from "antd";
import Logout from "../dashboard/logout/logout";
import LogoutAccount from "../dashboard/logout/logout";

const text = (
  <div className="text-base font-semibold text-gray-800">Sản phẩm mới thêm</div>
);

const content = (
  <div className="flex flex-col gap-y-4">
    <Link
      href="/profile"
      className="text-left text-gray-700 hover:text-red-500 transition-all duration-200 text-sm font-medium"
    >
      Tài khoản của tôi
    </Link>
    <Link
      href="/purchase"
      className="text-left text-gray-700 hover:text-red-500 transition-all duration-200 text-sm font-medium"
    >
      Đơn mua
    </Link>
    <LogoutAccount />
  </div>
);

const buttonWidth = 200;

const PopoverAvatar = ({ avatar }) => {
  return (
    <ConfigProvider button={{ style: { width: buttonWidth, margin: 4 } }}>
      <Flex vertical justify="center" align="center" className="demo">
        <Flex justify="center" align="center" style={{ whiteSpace: "nowrap" }}>
          <Popover placement="bottomRight" title={null} content={content}>
            {avatar}
          </Popover>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default PopoverAvatar;
