"use client";
import { CategoryResponseType } from "@/src/stores/categories";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import RecursiveMenuItem, { OpenMap } from "./RecursiveMenuItem";
import { EnumProductStore } from "@/src/stores/productStore";
import { ArrowDown2, HamburgerMenu } from "iconsax-reactjs";
import useOpenLevel from "@/hooks/useOpenLevelTreeSelect";

const MenuParentItem = observer(
    ({ parent }: { parent: CategoryResponseType }) => {
        const btnRef = useRef<HTMLButtonElement | null>(null);
        const [menuWidth, setMenuWidth] = useState<number>(240);

        const { openAtLevel, setOpenForLevel, closeAll } = useOpenLevel();
        const isLevel0 = (openLevel: OpenMap, id: string) =>
            openLevel[0] === id;
        const toggleLevel0 = () => {
            const isOpen = isLevel0(openAtLevel, parent.id);
            if (isOpen) {
                closeAll();
            } else {
                setOpenForLevel(0, parent.id);
            }
        };
        useEffect(() => {
            if (btnRef.current) setMenuWidth(btnRef.current.offsetWidth);
        }, []);

        const redirectedProductType = `listing-v1?type=${EnumProductStore.MOTORBIKE}`;
        const timeoutRef = useRef(null);
        const handleMouseEnter = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
        const handleMouseLeave = () => {
            timeoutRef.current = setTimeout(() => {
                closeAll();
            }, 500);
        };

        return (
            <div
                className="relative inline-block"
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                ref={timeoutRef}
            >
                <button
                    ref={btnRef}
                    // click parent button để toggle cấp 1 mở/đóng toàn bộ menu con cấp 1
                    onClick={toggleLevel0}
                    className="bg-white rounded-sm flex items-center min-w-[11.688rem] cursor-pointer p-[0.375rem_1.063rem] justify-between outline-none h-9 font-semibold border border-neutral-200 text-sm text-black"
                >
                    <div className="flex gap-[0.5rem] items-center">
                        <HamburgerMenu size="20" />
                        <span>Danh mục</span>
                    </div>
                    <ArrowDown2
                        size="14"
                        className={`transition-transform ${
                            isLevel0(openAtLevel, parent.id) ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {/* Submenu cấp 1 (children of parent) */}
                {isLevel0(openAtLevel, parent.id) && (
                    <div
                        className="absolute left-0 top-full bg-white border rounded shadow-md z-10"
                        style={{ minWidth: menuWidth }}
                    >
                        {parent.children.map((child) => (
                            <RecursiveMenuItem
                                key={child.id}
                                item={child}
                                baseType={redirectedProductType}
                                level={1}
                                openAtLevel={openAtLevel}
                                setOpenForLevel={setOpenForLevel}
                                // khi click vào level 1 thì đóng tất cả con của nó
                                closeAll={() => closeAll()}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

export default MenuParentItem;
