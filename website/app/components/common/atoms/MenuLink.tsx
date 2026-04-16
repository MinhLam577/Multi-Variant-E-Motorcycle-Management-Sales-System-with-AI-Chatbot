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
                `relative px-3 py-2 font-medium text-white
           after:content-[''] after:absolute
           after:left-1/2 after:-translate-x-1/2
           after:bottom-0 after:h-[2px]
           after:w-[80%] after:bg-yellow-400
           after:scale-x-0 after:origin-center
           after:transition-transform after:duration-300 after:ease-in-out
           hover:after:scale-x-100
          `,
                className
            )}
        >
            {item.name}
        </Link>
    );
};

export default MenuLink;
