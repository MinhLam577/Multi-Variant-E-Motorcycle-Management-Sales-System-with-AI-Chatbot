"use client";
import { useEffect, useRef, useState } from "react";
import MainMenu from "../common/MainMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, Divider } from "antd";
import PopoverCart from "../popover/cart";
import PopoverAvatar from "../popover/avatar";
import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/theme.context";
import { useAuth } from "@/context/auth.context";
import SearchBox from "../common/SearchBox";
import { Notification, ShoppingCart } from "iconsax-reactjs";
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
    const { user, isLoading } = useAuth();

    const store = useStore();
    const cartStore = store.cartObservable;
    useEffect(() => {
        if (user && cartStore) {
            cartStore.getListCart?.();
        }
    }, [user, cartStore]);

    const searchBoxRef = useRef<HTMLInputElement>(null);

    // Auto focus khi vào trang
    useEffect(() => {
        searchBoxRef.current?.focus();
    }, []);
    // Select hết text khi focus
    const handleFocus = () => {
        searchBoxRef.current?.select();
    };
    const keywords = [
        "PEGA ESP",
        "50cc Osakar Rova P",
        "Espero Enigma2025",
        "Xmen Osakar Pro",
    ];
    return (
        <>
            <header
                className="w-full px-[1rem] pt-[1rem] pb-[0.75rem] bg-[url(/images/background/header-background-image.jpg)] bg-no-repeat bg-center h-full"
                style={{
                    backgroundSize: "100% 100%",
                }}
            >
                <div className="flex items-start w-full md:container">
                    <div className="flex-shrink-0 flex items-center justify-center w-[11.688rem]">
                        <Link href="/" onClick={() => {}}>
                            <img
                                src="/images/logo-test.svg"
                                alt="Logo"
                                className="object-cover w-full h-auto cursor-pointer"
                            />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 w-full">
                        <div className="w-full flex flex-col gap-2 pl-[1.5rem]">
                            <SearchBox
                                ref={searchBoxRef}
                                onSearch={handleSearch}
                                onFocus={handleFocus}
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onClear={() => setKeyword("")}
                            />
                            <div className="overflow-hidden max-h-5">
                                <div className="flex gap-3 items-center text-[0.875rem] text-white flex-wrap">
                                    {keywords.map((kw, i) => (
                                        <span
                                            key={i}
                                            className="flex-shrink-0 whitespace-nowrap"
                                        >
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center min-w-[17.875rem] ml-[1.375rem]">
                        <div className="inline-flex items-start">
                            <div className="p-2 cursor-pointer">
                                <Notification size="28" color="white" />
                            </div>
                            <div className="p-2 cursor-pointer">
                                <PopoverCart
                                    dataCart={
                                        user ? cartStore?.data : undefined
                                    }
                                    cart={
                                        <Badge
                                            count={
                                                user
                                                    ? cartStore?.data?.length ||
                                                      0
                                                    : 0
                                            }
                                        >
                                            <ShoppingCart
                                                size="28"
                                                color="white"
                                            />
                                        </Badge>
                                    }
                                />
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <Divider
                                type="vertical"
                                variant="solid"
                                size="large"
                                style={{
                                    backgroundColor: "white",
                                    height: "1.9rem",
                                }}
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
                                        className="relative text-nowrap text-sm px-2 py-2 transition after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-yellow-400 after:w-0
                                              after:transition-all after:duration-300 after:ease-in-out
                                              hover:after:w-full text-white"
                                    >
                                        Đăng Nhập
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="relative text-nowrap text-sm px-2 py-2 transition after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-yellow-400 after:w-0
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
                <div
                    id="respMenu"
                    className="w-full flex md:container"
                    data-menu-style="horizontal"
                >
                    <MainMenu />
                </div>
            </header>
        </>
    );
});

export default Header;
