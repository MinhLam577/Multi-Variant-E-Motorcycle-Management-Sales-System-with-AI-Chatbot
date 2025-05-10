"use client";
import { useContext, useEffect, useState } from "react";
import MainMenu from "../common/MainMenu";
import { ThemeContext } from "@/app/layout/ThemeContext";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Input } from "antd";
import Link from "next/link";

import { Avatar, Badge, Space } from "antd";
import PopoverCart from "../popover/cart";
import PopoverAvatar from "../popover/avatar";
import { useStore } from "@/src/stores";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
const { Search } = Input;
const Header = observer(() => {
  const router = useRouter();
  const value = useContext(ThemeContext);

  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (router.pathname === "/home-motorbike") {
      if (keyword.trim()) {
        const encodedValue = encodeURIComponent(`${keyword}`);
        router.push(`/listing-v1?search=${encodedValue}&&type=motorbike`);
        // Gọi API tìm kiếm hoặc xử lý dữ liệu tại đây
      }
    } else {
      if (keyword.trim()) {
        const encodedValue = encodeURIComponent(`${keyword}`);
        router.push(`/listing-v1?search=${encodedValue}&&type=car`);
        // Gọi API tìm kiếm hoặc xử lý dữ liệu tại đây
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  // const onSearch = (value) => {
  //   // Nếu bạn muốn bao cả dấu ngoặc kép như yêu cầu: "Xe ô tô"
  //   const encodedValue = encodeURIComponent(`${value}`);
  //   router.push(`/listing-v1?search=${encodedValue}`);
  // };
  const [user, setUser] = useState("");

  const store = useStore();
  const AccountStore = store.accountObservable;
  const cartStore = store.cartObservable;
  useEffect(() => {
    const fetchData = async () => {
      await AccountStore?.getAccount(); // lấy thông tin người dùng
      const account = AccountStore?.account;
      setUser(account);

      if (account) {
        await cartStore.getListCart(); // chỉ gọi khi đã có user
      }
    };

    fetchData();
  }, []);
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

          <div className="flex justify-between items-center w-full px-4 ">
            {/* Menu bên trái */}
            <ul
              id="respMenu"
              className="ace-responsive-menu flex "
              data-menu-style="horizontal"
            >
              <MainMenu />
            </ul>

            {/* Phần bên phải: Search, Cart, Avatar/User */}

            <div className="flex items-center gap-4 text-xl text-white">
              <div className="flex items-center border-b text-white py-1 w-full max-w-sm">
                <span className="text-lg text-white mr-2">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full outline-none border-none bg-transparent text-white text-sm placeholder:text-sm"
                />
              </div>

              {!user && (
                <PopoverCart
                  cart={
                    <Badge count={0}>
                      <ShoppingCartOutlined className="text-3xl text-white" />
                    </Badge>
                  }
                />
              )}
              {user && (
                <PopoverCart
                  dataCart={cartStore?.data}
                  cart={
                    <Badge count={cartStore.data?.length || 0}>
                      <ShoppingCartOutlined className="text-3xl text-white" />
                    </Badge>
                  }
                />
              )}

              {user ? (
                // Nếu đã đăng nhập
                <PopoverAvatar
                  avatar={
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          AccountStore?.account?.avatarUrl ||
                          "https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png"
                        }
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover filter invert"
                      />
                    </div>
                  }
                />
              ) : (
                <div className="flex gap-1 items-center">
                  <Link
                    href="/login"
                    className="cursor-pointer text-[15px] w-20 text-white text-center "
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/signup"
                    className="cursor-pointer text-[15px] w-14 text-white text-center "
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
});

export default Header;
// <button className="text-sm text-red-500 ">Đăng xuất</button>
// <Search
// placeholder="input search text"
// onSearch={onSearch}
// style={{ width: 200 }}
// />
