"use client";
import Link from "next/link";
import MenuLink from "../../atoms/MenuLink";

const StaticMenu = ({ pathname }: { pathname: string }) => {
    const staticItems = [
        { id: "s1", name: "GIỚI THIỆU", href: "/about-us" },
        { id: "s4", name: "TIN TỨC", href: "/blog-list" },
    ];

    return (
        <div className="pl-[0.5rem]">
            {staticItems.map((item) => (
                <MenuLink item={item} />
            ))}
        </div>
    );
};
export default StaticMenu;
