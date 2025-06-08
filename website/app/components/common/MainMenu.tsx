"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/src/stores";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EnumProductStore } from "@/src/stores/product.store";
import { CategoryResponseType } from "@/src/stores/categories";
import { headerWithActionsStore } from "./HeaderWidthActions";
const MainMenu = observer(() => {
    const store = useStore();
    const { categoryObservable } = store;
    const pathname = usePathname();
    // const path = usePathname();

    useEffect(() => {
        const fetchCategories = async () => {
            await categoryObservable.getListOrder();
        };
        fetchCategories();
    }, []);
    const router = useRouter();
    const staticItems = [
        { id: "s1", name: "GIỚI THIỆU", href: "/about-us" },
        { id: "s2", name: "KHUYẾN MÃI", href: "/khuyen-mai" },
        { id: "s3", name: "CỬA HÀNG", href: "/cua-hang" },
        { id: "s4", name: "TIN TỨC", href: "/blog-list" },
        { id: "s6", name: "LIÊN HỆ", href: "/lien-he" },
    ];

    return (
        <div className="">
            {categoryObservable?.data?.categories
                ?.filter((item) => item.type === headerWithActionsStore?.type)
                ?.map((parent: CategoryResponseType) => {
                    const isActive =
                        pathname === "/" || pathname === "/home-motorbike";
                    const redirectedProductType =
                        parent.type === EnumProductStore.MOTORBIKE
                            ? "home-motorbike"
                            : "/";
                    return (
                        <div
                            key={parent.id}
                            className="relative group inline-block"
                        >
                            <button
                                onClick={() => {
                                    router.push(`/${redirectedProductType}`);
                                }}
                                className={`relative px-3 py-2 mb-2 text-black rounded flex items-center space-x-2 
            after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-yellow-400 
            after:w-0 group-hover:after:w-full after:transition-all after:duration-500 after:ease-in-out  ${
                isActive
                    ? "text-white hover:text-yellow-400 hover:after:w-full"
                    : "text-black "
            }`}
                            >
                                {parent?.name && parent.name.toUpperCase()}
                            </button>

                            <div className="absolute left-0 top-full hidden group-hover:block bg-white border rounded shadow-md z-10 min-w-[150px]">
                                {parent.children.map((child) => {
                                    const redirectedProductType =
                                        parent.type ===
                                        EnumProductStore.MOTORBIKE
                                            ? "listing-v1?type=motorbike"
                                            : "listing-v1?type=car";

                                    return (
                                        <div
                                            key={child.id}
                                            className="relative group/submenu"
                                        >
                                            <Link
                                                href={`/${redirectedProductType}&&categoryID=${child.id}`}
                                                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                                            >
                                                {child.name}
                                            </Link>

                                            {child?.children.length > 0 && (
                                                <div className="absolute left-full top-0 hidden group-hover/submenu:block bg-white border rounded shadow-md min-w-[150px]">
                                                    {child.children.map(
                                                        (sub) => (
                                                            <Link
                                                                key={sub.id}
                                                                href={`/${redirectedProductType}&&categoryID=${sub.id}`}
                                                                className="block px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

            {staticItems.map((item) => {
                const isActive =
                    pathname === "/" || pathname === "/home-motorbike";
                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`relative px-3 py-2 mb-2 font-medium 
  after:content-[''] after:absolute after:left-0 after:bottom-0 
  after:h-[2px] after:bg-yellow-400 after:w-0 
  after:transition-all after:duration-300 after:ease-in-out
  hover:after:w-full
  ${isActive ? "text-white" : "text-black"}
`}
                    >
                        {item.name}
                    </Link>
                );
            })}
        </div>
    );
});

export default MainMenu;
