"use client";
import { ArrowDown2, HamburgerMenu } from "iconsax-reactjs";

export default function EmptyMenu() {
    return (
        <div className="justify-between items-center flex">
            <button className="bg-white rounded-sm flex items-center min-w-[11.688rem] cursor-pointer p-[0.375rem_1.063rem] justify-between outline-none h-9 font-semibold border border-neutral-200 text-sm text-black">
                <div className="flex gap-[0.5rem] items-center">
                    <HamburgerMenu size="20" />
                    <span>Danh mục</span>
                </div>
                <ArrowDown2 size="14" />
            </button>
        </div>
    );
}
