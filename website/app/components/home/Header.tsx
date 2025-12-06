"use client";
import { useEffect, useState } from "react";
import MainMenu from "../common/MainMenu";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "antd";
import PopoverCart from "../popover/cart";
import PopoverAvatar from "../popover/avatar";
import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/theme.context";
import { useAuth } from "@/context/auth.context";
const Header = observer(() => {
    const router = useRouter();
    const pathname = usePathname();
    const value = useTheme();
    const [keyword, setKeyword] = useState("");
    const handleSearch = () => {
        const isMotorbikePage = pathname === "/home-motorbike";
        if (isMotorbikePage) {
            if (keyword.trim()) {
                const encodedValue = encodeURIComponent(`${keyword}`);
                router.push(
                    `/listing-v1?search=${encodedValue}&type=motorbike`
                );
            }
        } else {
            if (keyword.trim()) {
                const encodedValue = encodeURIComponent(`${keyword}`);
                router.push(`/listing-v1?search=${encodedValue}&type=car`);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };
    const { user, isLoading } = useAuth();

    const store = useStore();
    const cartStore = store.cartObservable;
    useEffect(() => {
        if (user && cartStore) {
            cartStore.getListCart?.();
        }
    }, [user, cartStore]);
    return (
        <header className="transparent w-full xl:block lg:block md:hidden sm:hidden xs:hidden hidden">
            {/* Ace Responsive Menu */}
            <nav
                style={{ backgroundColor: `var(--${value.theme})` }}
                className="w-full"
            >
                <div className="w-full">
                    {/* Menu Toggle btn*/}
                    <div className="menu-toggle">
                        <button type="button" id="menu-btn">
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                    </div>

                    <div className="flex items-center w-full px-4 pt-2 pb-1">
                        {/* Menu bên trái */}
                        <ul
                            id="respMenu"
                            className="w-auto flex"
                            data-menu-style="horizontal"
                        >
                            <MainMenu />
                        </ul>
                        {/* Phần bên phải: Search, Cart, Avatar/User */}
                        <div className="flex gap-4 text-xl text-white justify-end ml-auto max-w-full w-1/3 xl:w-1/4">
                            <div className="flex items-center border-b text-white flex-grow max-w-sm w-full">
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
                                        <ShoppingCartOutlined className="text-2xl text-white" />
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
                                            className="min-w-8 w-8 h-8 rounded-[50%] object-cover"
                                        />
                                    }
                                />
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Link
                                        href="/login"
                                        className="relative text-nowrap text-sm px-2 py-2 rounded transition after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-yellow-400 after:w-0 
                                        after:transition-all after:duration-300 after:ease-in-out
                                        hover:after:w-full text-white"
                                    >
                                        Đăng Nhập
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="relative text-nowrap text-sm px-2 py-2 rounded transition after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-yellow-400 after:w-0 
                                        after:transition-all after:duration-300 after:ease-in-out
                                        hover:after:w-full text-white"
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
        // <header className="w-full bg-[#1b51a3]">
        //     <div className="wrap_content flex items-center justify-between">
        //         <div className="hidden flex-shrink-0 md:flex md:items-center md:justify-center md:w-[187px]">
        //             <Link href="/" onClick={() => {}}>
        //                 <img
        //                     src="/images/logo.webp"
        //                     alt="Logo"
        //                     className="object-cover h-[63px] cursor-pointer w-full"
        //                 />
        //             </Link>
        //         </div>
        //         <div className="">
        //             <SearchBox />
        //         </div>
        //     </div>
        // </header>
    );
});

export default Header;
