"use client";
import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import { EnumProductStore } from "@/src/stores/productStore";
import MenuParentItem from "./CategoryMenu/ParentMenuItem";
import StaticMenu from "./StaticMenu";
import EmptyMenu from "./EmptyMenu";
import MenuLink from "../atoms/MenuLink";

const MainMenu = observer(() => {
    const store = useStore();
    const pathname = usePathname();
    const { categoryObservable } = store;
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State kiểm soát visibility arrows
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    useEffect(() => {
        categoryObservable.getListOrder();
    }, []);

    // Check scroll position để show/hide arrows
    const checkScroll = () => {
        if (!scrollRef.current || !containerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        // Kiểm tra xem có overflow không
        const hasOverflow = scrollWidth > clientWidth;

        if (hasOverflow) {
            // Có overflow - hiển thị mũi tên dựa trên vị trí scroll
            const atStart = scrollLeft <= 10;
            const atEnd = scrollLeft >= scrollWidth - clientWidth - 10;

            setShowLeftArrow(!atStart); // Hiển thị mũi tên trái khi không ở đầu
            setShowRightArrow(!atEnd); // Hiển thị mũi tên phải khi không ở cuối
        } else {
            // Không có overflow - chỉ hiển thị mũi tên phải
            setShowLeftArrow(false);
            setShowRightArrow(false);
        }
    };

    const scrollLeft = () => {
        if (scrollRef.current && showLeftArrow) {
            const containerWidth = containerRef.current?.clientWidth || 300;
            scrollRef.current.scrollBy({
                left: -containerWidth,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current && showRightArrow) {
            const containerWidth = containerRef.current?.clientWidth || 300;
            scrollRef.current.scrollBy({
                left: +containerWidth,
                behavior: "smooth",
            });
        }
    };

    // Tự động check scroll khi resize hoặc data thay đổi
    useEffect(() => {
        checkScroll();
        const scrollEl = scrollRef.current;
        scrollEl?.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);

        return () => {
            scrollEl?.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, [categoryObservable?.data]);

    useEffect(() => {
        checkScroll();
    }, []);

    const categories = categoryObservable?.data?.categories ?? [];
    const level1Items = categories.flatMap((parent) => parent.children || []);
    const redirectedProductType = `listing-v1?type=${EnumProductStore.MOTORBIKE}`;

    // CHỈ MAP 1 LẦN - Tối ưu performance
    const menuItems = level1Items.map((item) => ({
        id: item.id,
        name: item.name,
        href: `/${redirectedProductType}&categoryID=${item.id}`,
    }));

    const hasManyParentCategories = categories.length > 3;

    return (
        <div
            className={`hidden items-center w-full md:grid md:grid-cols-[11.6875rem_1fr] md:justify-between`}
        >
            {/* Fixed part: Danh mục cha */}
            <div
                className={`flex items-center flex-shrink-0 gap-2 ${
                    hasManyParentCategories
                        ? "max-w-xs overflow-x-auto scrollbar-hide"
                        : ""
                }`}
            >
                {categories.length === 0 ? (
                    <EmptyMenu />
                ) : (
                    categories.map((parent) => (
                        <MenuParentItem key={parent.id} parent={parent} />
                    ))
                )}
            </div>

            {/* Scrollable container với absolute arrows */}
            <div
                ref={containerRef}
                className="flex-1 relative h-16 min-w-0 overflow-hidden pl-[0.5rem]"
            >
                {/* Left Arrow - Absolute */}
                {showLeftArrow && (
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-16 flex items-center justify-center
                               transition-all duration-300 hover:scale-105 active:scale-95"
                        aria-label="Scroll left"
                    >
                        {/* Gradient overlay để fade text bên dưới */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1b51a3] via-[#1b51a3]/90 to-transparent pointer-events-none" />
                        {/* Icon mũi tên */}
                        <ArrowLeft2
                            size={20}
                            className="relative z-10 text-white drop-shadow-md"
                        />
                    </button>
                )}

                {/* Scrollable content */}
                <div
                    ref={scrollRef}
                    className="flex items-center h-full overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    onScroll={checkScroll}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide {
                            scrollbar-width: none;
                            -ms-overflow-style: none;
                        }
                    `}</style>

                    <div className="flex items-center h-full flex-shrink-0 py-2 pr-12">
                        {/* Static menu */}
                        <StaticMenu pathname={pathname} />

                        {menuItems.map((item) => (
                            <MenuLink
                                key={item.id}
                                item={item}
                                className="flex-shrink-0 whitespace-nowrap"
                            />
                        ))}

                        {/* Spacer để arrows có chỗ click */}
                        <div className="w-12 flex-shrink-0" />
                    </div>
                </div>

                {/* Right Arrow - Absolute */}
                {showRightArrow && (
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-16 flex items-center justify-center
                               transition-all duration-300 hover:scale-105 active:scale-95"
                        aria-label="Scroll right"
                    >
                        {/* Gradient overlay cho right arrow */}
                        <div className="absolute inset-0 bg-gradient-to-l from-[#1b51a3] via-[#1b51a3]/90 to-transparent pointer-events-none" />
                        <ArrowRight2
                            size={20}
                            className="relative z-10 text-white drop-shadow-md"
                        />
                    </button>
                )}
            </div>
        </div>
    );
});

export default MainMenu;
