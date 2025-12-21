"use client";
import { cn } from "@/src/lib/utils";
import Link from "next/link";

export type MenuLinkProps = {
    className?: string;
    item: {
        id: string;
        name: string;
        href: string;
    };
};

const MenuLink = ({ item, className }: MenuLinkProps) => {
    return (
        <Link
            key={item.id}
            href={item.href}
            className={cn(
                `relative px-3 py-2 font-medium
                      after:content-[''] after:absolute after:left-0 after:bottom-0
                      after:h-[2px] after:bg-yellow-400 after:w-0
                      after:transition-all after:duration-300 after:ease-in-out
                      hover:after:w-full text-white
              `,
                className
            )}
        >
            {item.name}
        </Link>
    );
};

export default MenuLink;
