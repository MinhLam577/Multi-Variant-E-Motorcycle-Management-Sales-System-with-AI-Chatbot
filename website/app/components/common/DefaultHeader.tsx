"use client";
import Link from "next/link";
import MainMenu from "./MainMenu";
import Image from "next/image";
import { headerWithActionsStore } from "./HeaderWidthActions";
import { EnumProductStore } from "@/src/stores/productStore";
import PopoverCart from "../popover/cart";
import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useStore } from "@/src/stores";
import PopoverAvatar from "../popover/avatar";

const DefaultHeader = () => {
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
        <header className="header-nav menu_style_home_one home3_style main-menu hidden lg:block">
            {/* Ace Responsive Menu */}
            <nav>
                <div className="container posr flex items-center justify-between">
                    {/* Menu Toggle btn*/}
                    <div className="menu-toggle">
                        <button type="button" id="menu-btn">
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                    </div>
                    <Link
                        href="/"
                        onClick={() => {
                            headerWithActionsStore.setType(
                                EnumProductStore.CAR
                            );
                        }}
                        className="navbar_brand float-start dn-md"
                    >
                        <Image
                            width={140}
                            height={45}
                            className="logo1 img-fluid"
                            src="/images/header-logo2.svg"
                            alt="header-logo.svg"
                        />
                    </Link>
                    {/* Responsive Menu Structure*/}
                    <div className="flex items-center gap-2">
                        <ul
                            // id="respMenu"
                            className="ace-responsive-menu text-end"
                            data-menu-style="horizontal"
                        >
                            <MainMenu />
                        </ul>

                        <div className="flex items-center justify-center gap-4">
                            {!user && (
                                <PopoverCart
                                    cart={
                                        <Badge count={0}>
                                            <ShoppingCartOutlined className="text-2xl text-black" />
                                        </Badge>
                                    }
                                />
                            )}
                            {user && (
                                <PopoverCart
                                    dataCart={cartStore?.data}
                                    cart={
                                        <Badge
                                            count={cartStore.data?.length || 0}
                                        >
                                            <ShoppingCartOutlined className="text-2xl text-black" />
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
                                                    AccountStore?.account
                                                        ?.avatarUrl ||
                                                    "https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png"
                                                }
                                                alt="Avatar"
                                                className="min-w-8 w-8 h-8 rounded-full object-cover filter invert"
                                            />
                                        </div>
                                    }
                                />
                            ) : (
                                <div className="flex gap-2 items-center">
                                    <Link
                                        href="/login"
                                        className="cursor-pointer text-[15px] w-20 !text-black text-center "
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="cursor-pointer text-[15px] w-14 !text-black text-center "
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
};

export default DefaultHeader;
