"use client";
import { useStore } from "@/context/store.context";
import { CategoryResponseType } from "@/src/stores/categories";
import { isParentActive } from "@/utils/isMenuActive";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import { toJS } from "mobx";
import PopoverAvatar from "../popover/avatar";
import { ShoppingCartOutlined } from "@ant-design/icons";
import PopoverCart from "../popover/cart";
import { Badge } from "antd";
import { LoginResponse } from "@/types/auth-validate.type";

export interface IMenuItems {
    label: string;
    path?: string;
    subMenu?: IMenuItems[];
}

const MobileMenu = () => {
    const path = usePathname();
    const socialLinks = [
        {
            name: "Facebook",
            icon: "fab fa-facebook-f",
            link: "#",
        },
        {
            name: "Twitter",
            icon: "fab fa-twitter",
            link: "#",
        },
        {
            name: "Instagram",
            icon: "fab fa-instagram",
            link: "#",
        },
        {
            name: "YouTube",
            icon: "fab fa-youtube",
            link: "#",
        },
        {
            name: "Pinterest",
            icon: "fab fa-pinterest",
            link: "#",
        },
    ];

    const contactInfo = [
        {
            icon: "flaticon-map",
            text: "Đà nẵng",
        },
        {
            icon: "flaticon-phone-call",
            text: "098766332",
        },
        {
            icon: "flaticon-clock",
            text: "Thứ 2 - Thứ 7 8:00 - 18:00",
        },
    ];

    const store = useStore();
    const [user, setUser] = useState<LoginResponse>();

    const AccountStore = store.accountObservable;
    const cartStore = store.cartObservable;
    useEffect(() => {
        const fetchData = async () => {
            await AccountStore?.init();
            const account = AccountStore?.account;
            setUser(account);

            if (account) {
                await cartStore.getListCart(); // chỉ gọi khi đã có user
            }
        };

        fetchData();
    }, []);
    const { categoryObservable, blogCategoryObservable } = store;
    useEffect(() => {
        const fetchCategories = async () => {
            await categoryObservable.getListOrder();
            await blogCategoryObservable.getListBlogCategories();
        };
        fetchCategories();
    }, []);

    const convertCategoriesToMenuItems = (
        categories: CategoryResponseType[],
        level: number = 0
    ): IMenuItems[] => {
        const menuItems: IMenuItems[] = [];
        categories.forEach((category) => {
            const menuItem: IMenuItems = {
                label: category.name,
            };

            // Chỉ thêm path ở cấp 3 (level === 2) và không có children
            if (
                level === 2 ||
                !category.children ||
                category.children.length === 0
            ) {
                menuItem.path = `/listing-v1?type=${category.type}&categoryID=${category.id}`;
            }

            // Nếu có children và chưa vượt quá cấp 3, tiếp tục đệ quy
            if (
                category.children &&
                category.children.length > 0 &&
                level < 2
            ) {
                menuItem.subMenu = convertCategoriesToMenuItems(
                    category.children,
                    level + 1
                );
            }
            menuItems.push(menuItem);
        });
        return menuItems;
    };

    const getMenuItems = () => {
        const defaultMenuItems: IMenuItems[] = [
            { label: "Giới thiệu", path: "/about-us" },
            { label: "Tin tức", path: "/blog-list" },
            { label: "Liên hệ", path: "/lien-he" },
        ];
        if (categoryObservable.data.categories) {
            const categories = categoryObservable.data.categories;
            const categoryMenuItems = convertCategoriesToMenuItems(
                toJS(categories)
            );
            return [...categoryMenuItems, ...defaultMenuItems];
        }
        return defaultMenuItems;
    };

    return (
        <>
            <div className="stylehome1 h-0">
                <div className="mobile-menu xl:hidden lg:hidden md:block sm:block">
                    <div className="header stylehome1">
                        <div className="mobile_menu_bar">
                            <a
                                className="menubar"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#mobileMenu"
                                aria-controls="mobileMenu"
                            >
                                <small>Menu</small>
                                <span />
                            </a>
                        </div>
                        {/* End mobile_menu_bar */}

                        <div className="mobile_menu_main_logo">
                            <Link href="/">
                                <Image
                                    width={140}
                                    height={45}
                                    priority
                                    src="/images/logo.png"
                                    alt="brand"
                                />
                            </Link>
                        </div>
                        {/* End .mobile_menu_main_logo */}
                    </div>
                </div>
                {/* /.mobile-menu */}
            </div>
            {/* End mobile menu header */}

            {/* start mobile sidebar menu */}
            <div
                className="offcanvas offcanvas-end mobile_menu-canvas"
                tabIndex={-1}
                id="mobileMenu"
                aria-labelledby="mobileMenuLabel"
                data-bs-scroll="true"
            >
                <div className="offcanvas-body">
                    <div className="pro-header flex justify-between items-stretch">
                        <Link href="/">
                            <Image
                                width={140}
                                height={45}
                                priority
                                src="/images/logo.png"
                                alt="brand"
                            />
                        </Link>
                        <div
                            className="fix-icon flex gap-4 items-end justify-between flex-col flex-1"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        >
                            <i className="fa-light fa-circle-xmark"></i>
                            <div className="flex items-center justify-center gap-4 ">
                                {user && (
                                    <PopoverCart
                                        dataCart={cartStore?.data}
                                        cart={
                                            <Badge
                                                count={
                                                    cartStore.data?.length || 0
                                                }
                                            >
                                                <ShoppingCartOutlined className="text-2xl text-white" />
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
                                                            ?.user?.avatarUrl ||
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
                                            className="cursor-pointer text-[15px] w-20 !text-white text-center "
                                        >
                                            Đăng nhập
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="cursor-pointer text-[15px] w-14 !text-white text-center "
                                        >
                                            Đăng ký
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* End pro-header */}

                    {/* mobile menu items start */}
                    <Sidebar
                        width="100%"
                        backgroundColor="#0A2357"
                        className="my-custom-class"
                    >
                        <Menu>
                            {getMenuItems()?.length &&
                                getMenuItems().map((item, index) => {
                                    return item.subMenu?.length ? (
                                        <SubMenu
                                            key={index}
                                            className={
                                                isParentActive(
                                                    item?.subMenu,
                                                    path
                                                )
                                                    ? "active"
                                                    : ""
                                            }
                                            label={
                                                item.label
                                                    ?.charAt(0)
                                                    ?.toUpperCase() +
                                                item.label
                                                    ?.toLowerCase()
                                                    ?.slice(1)
                                            }
                                        >
                                            {item?.subMenu?.map(
                                                (subItem, subIndex) =>
                                                    subItem.subMenu ? (
                                                        <SubMenu
                                                            key={subIndex}
                                                            label={
                                                                subItem.label
                                                            }
                                                            className={
                                                                isParentActive(
                                                                    subItem.subMenu,
                                                                    path
                                                                )
                                                                    ? "active"
                                                                    : ""
                                                            }
                                                        >
                                                            {subItem.subMenu.map(
                                                                (
                                                                    nestedItem,
                                                                    nestedIndex
                                                                ) => (
                                                                    <MenuItem
                                                                        key={
                                                                            nestedIndex
                                                                        }
                                                                        component={
                                                                            <Link
                                                                                className={
                                                                                    nestedItem.path ==
                                                                                    path
                                                                                        ? "active"
                                                                                        : ""
                                                                                }
                                                                                href={
                                                                                    nestedItem.path
                                                                                }
                                                                            />
                                                                        }
                                                                    >
                                                                        {
                                                                            nestedItem.label
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                        </SubMenu>
                                                    ) : (
                                                        <MenuItem
                                                            key={subIndex}
                                                            component={
                                                                <Link
                                                                    className={
                                                                        subItem.path ==
                                                                        path
                                                                            ? "active"
                                                                            : ""
                                                                    }
                                                                    href={
                                                                        subItem.path
                                                                    }
                                                                />
                                                            }
                                                        >
                                                            {subItem.label}
                                                        </MenuItem>
                                                    )
                                            )}
                                        </SubMenu>
                                    ) : (
                                        <MenuItem
                                            key={index}
                                            component={
                                                <Link
                                                    className={
                                                        item.path == path
                                                            ? "active"
                                                            : ""
                                                    }
                                                    href={item.path}
                                                />
                                            }
                                        >
                                            {item.label
                                                ?.charAt(0)
                                                ?.toUpperCase() +
                                                item.label
                                                    ?.toLowerCase()
                                                    ?.slice(1)}
                                        </MenuItem>
                                    );
                                })}
                        </Menu>
                    </Sidebar>
                    {/* mobile menu items end */}

                    <div className="pro-footer mm-add-listing">
                        <div className="border-none">
                            <div className="mmenu-contact-info">
                                {contactInfo.map((info, index) => (
                                    <span className="phone-num" key={index}>
                                        <i className={info.icon} />{" "}
                                        <a href="#">{info.text}</a>
                                    </span>
                                ))}
                            </div>

                            <div className="social-links">
                                {socialLinks.map((link, index) => (
                                    <a href={link.link} key={index}>
                                        <span className={link.icon} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* End mm-add-listng */}
                </div>
                {/* End offcanvas-body */}
            </div>
            {/* End mobile sidebar menu */}
        </>
    );
};

export default MobileMenu;
