"use client";
import { useContext, useState } from "react";
import MainMenu from "../common/MainMenu";
import { ThemeContext } from "@/app/layout/ThemeContext";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Input } from "antd";

import { ClockCircleOutlined } from "@ant-design/icons";
import { Avatar, Badge, Space } from "antd";
const { Search } = Input;
const Header = () => {
  const value = useContext(ThemeContext);
  const onSearch = (value, _e, info) =>
    console.log(info === null || info === void 0 ? void 0 : info.source, value);
  const [user, setUser] = useState(true);
  return (
    <header
      className="header-nav menu_style_home_one transparent main-menu"
      style={{ borderTop: "1px solid white" }}
    >
      {/* Ace Responsive Menu */}
      <nav style={{ backgroundColor: `var(--${value.theme})` }}>
        <div className="container">
          {/* Menu Toggle btn*/}
          <div className="menu-toggle">
            <button type="button" id="menu-btn">
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
          </div>

          {/* Responsive Menu Structure*/}
          <ul
            id="respMenu"
            className="ace-responsive-menu "
            data-menu-style="horizontal"
          >
            <MainMenu />
          </ul>

          <div className="flex text-xl text-white">
            <Search
              placeholder="input search text"
              onSearch={onSearch}
              style={{ width: 150 }}
            />
            <Badge count={5}>
              <ShoppingCartOutlined />
            </Badge>
            {user ? (
              // Nếu chưa đăng nhập
              <>
                <span className="mr-5 cursor-pointer hover:underline">
                  Đăng nhập
                </span>
                <span className="cursor-pointer hover:underline">Đăng ký</span>
              </>
            ) : (
              // Nếu đã đăng nhập
              <div className="flex items-center gap-4">
                <img
                  src={"/default-avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <button className="text-sm text-red-500 hover:underline">
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
