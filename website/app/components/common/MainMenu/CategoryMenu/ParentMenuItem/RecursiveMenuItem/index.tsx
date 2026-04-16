"use client";
import { CategoryResponseType } from "@/src/stores/categories";
import { ArrowRight2 } from "iconsax-reactjs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type OpenMap = Record<number, string | null>;
/**
 * RecursiveMenuItem supports infinite nesting.
 *
 * Props:
 *  - item: the category item
 *  - baseType: the url base (redirectedProductType)
 *  - level: integer level (1,2,3,..) used to control which item is open on that level
 *  - openAtLevel, setOpenForLevel: control object and setter from parent
 *  - closeAll: optional to close all menus on link click
 */
export default function RecursiveMenuItem({
    item,
    baseType,
    level,
    openAtLevel,
    setOpenForLevel,
    closeAll,
}: {
    item: CategoryResponseType;
    baseType: string;
    level: number;
    openAtLevel: OpenMap;
    setOpenForLevel: (level: number, id: string | null) => void;
    closeAll?: () => void;
}) {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openAtLevel[level] === item.id;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(200);

    // đo width để submenu con có width phù hợp nếu cần
    useEffect(() => {
        if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    }, []);

    // khi bấm tên (Link) -> đóng toàn bộ menu (nếu bạn muốn)
    const onLinkClick = () => {
        if (closeAll) closeAll();
    };

    // khi bấm arrow toggle: stop propagation để không trigger Link
    const onToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen) {
            // đóng chính level này (đồng thời xóa deeper)
            setOpenForLevel(level, null);
        } else {
            // mở chính level này và đóng tất cả khác cùng level
            setOpenForLevel(level, item.id);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="flex items-center justify-between">
                {/* Link name - click sẽ điều hướng */}
                <Link
                    href={`/${baseType}&categoryID=${item.id}`}
                    onClick={onLinkClick}
                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer flex-1"
                >
                    {item.name}
                </Link>

                {/* Toggle arrow (button riêng) */}
                {hasChildren && (
                    <button
                        onClick={onToggle}
                        aria-expanded={isOpen}
                        className="px-3 py-2 hover:bg-gray-100 focus:outline-none"
                    >
                        <ArrowRight2
                            size="16"
                            className={`transition-transform ${
                                isOpen ? "rotate-90" : ""
                            }`}
                        />
                    </button>
                )}
            </div>

            {/* nếu mở -> render submenu con */}
            {hasChildren && isOpen && (
                <div
                    className="absolute left-full top-0 bg-white border shadow-md z-20"
                    style={{ minWidth: width }}
                >
                    {item.children.map((child) => (
                        <RecursiveMenuItem
                            key={child.id}
                            item={child}
                            baseType={baseType}
                            level={level + 1}
                            openAtLevel={openAtLevel}
                            setOpenForLevel={setOpenForLevel}
                            closeAll={closeAll}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
