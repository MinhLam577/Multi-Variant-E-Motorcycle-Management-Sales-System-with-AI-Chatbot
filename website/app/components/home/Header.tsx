"use client";
import { useEffect, useRef, useState } from "react";
import MainMenu from "../common/MainMenu";
import Link from "next/link";
import { Badge, Divider } from "antd";
import PopoverCart from "../popover/cart";
import PopoverAvatar from "../popover/avatar";
import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import SearchBox from "../common/SearchBox";
import { Notification, ShoppingCart } from "iconsax-reactjs";
import { EnumProductStore } from "@/src/stores/productStore";
const Header = observer(() => {
    const router = useRouter();
    const [keyword, setKeyword] = useState("");
    const searchParams = useSearchParams();
    useEffect(() => {
      const searchFromUrl = searchParams.get('search');
      if (searchFromUrl) {
          setKeyword(decodeURIComponent(searchFromUrl));
      }
  }, [searchParams]);
    const performSearch = (searchValue: string) => {
      if (!searchValue.trim()) return;
      
      const encodedValue = encodeURIComponent(searchValue.trim());
      router.push(`/listing-v1?search=${encodedValue}&type=motorbike`);
    };
    const handleSearch = () => {
      performSearch(keyword);
    };
    const { user, isLoading } = useAuth();
    const store = useStore();
    const cartStore = store.cartObservable;
    const productStore = store.productObservable;
    useEffect(() => {
        if (user && cartStore) {
            cartStore.getListCart?.();
        }
    }, [user, cartStore]);

    const searchBoxRef = useRef<HTMLInputElement>(null);
    const [keywords, setKeywords] = useState<string[]>([])

    // Auto focus khi vào trang
    useEffect(() => {
        searchBoxRef.current?.focus();
        productStore.getBestSellingProducts(EnumProductStore.MOTORBIKE)
    }, []);

    useEffect(() => {
      const bestSelling = productStore.data.motobikes.bestSelling || [];
      setKeywords(bestSelling.map(p => p.title || ''));
    }, [productStore.data.motobikes.bestSelling]);
    // Select hết text khi focus
    const handleFocus = () => {
        searchBoxRef.current?.select();
    };
    const handleKeyWordClick = (value: string) => {
      setKeyword(value);
      performSearch(value);
  };

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
                                            className="flex-shrink-0 whitespace-nowrap cursor-pointer hover:text-yellow-300 transition-colors"
                                            onClick={()=> {
                                              handleKeyWordClick(kw)
                                            }}
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
                    <MainMenu classNameMenuColor="!text-[#fff]"/>
                </div>
            </header>
        </>
    );
});

export default Header;
