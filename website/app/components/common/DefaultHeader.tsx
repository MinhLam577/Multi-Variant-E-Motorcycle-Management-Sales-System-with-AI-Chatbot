"use client";
import Link from "next/link";
import MainMenu from "./MainMenu";
import Image from "next/image";
import { headerWithActionsStore } from "./HeaderWidthActions";
import { EnumProductStore } from "@/src/stores/productStore";
import PopoverCart from "../popover/cart";
import { Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useStore } from "@/context/store.context";
import PopoverAvatar from "../popover/avatar";
import { useAuth } from "@/context/auth.context";
import { observer } from "mobx-react-lite";

const DefaultHeader = () => {
    const { user, isLoading } = useAuth();

    const store = useStore();
    const cartStore = store.cartObservable;
    useEffect(() => {
        if (user && cartStore) {
            cartStore.getListCart?.();
        }
    }, [user, cartStore]);

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
                            className="ace-responsive-menu text-end"
                            data-menu-style="horizontal"
                        >
                            <MainMenu />
                        </ul>

                        <div className="flex items-center justify-center gap-2">
                            {/* Cart */}
                            <PopoverCart
                                dataCart={user ? cartStore?.data : undefined}
                                cart={
                                    <Badge
                                        count={
                                            user
                                                ? cartStore?.data?.length || 0
                                                : 0
                                        }
                                    >
                                        <ShoppingCartOutlined className="text-2xl text-black" />
                                    </Badge>
                                }
                            />

                            {/* User */}
                            {user ? (
                                <PopoverAvatar
                                    avatar={
                                        <img
                                            src={
                                                user.user?.avatarUrl ||
                                                "https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png"
                                            }
                                            alt="Avatar"
                                            className="min-w-8 w-8 h-8 rounded-full object-cover"
                                        />
                                    }
                                />
                            ) : (
                                <div className="flex items-center">
                                    <Link
                                        href="/login"
                                        className="text-nowrap text-sm px-2 py-2 rounded transition relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-yellow-400 after:w-0 
                                        after:transition-all after:duration-300 after:ease-in-out
                                        hover:after:w-full text-black"
                                    >
                                        Đăng Nhập
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="text-nowrap text-sm px-2 py-2 rounded transition  relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-yellow-400 after:w-0 
                                        after:transition-all after:duration-300 after:ease-in-out
                                        hover:after:w-full text-black"
                                    >
                                        Đăng Ký
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

export default observer(DefaultHeader);
