"use client";
import Link from "next/link";
import MenuLink from "../../atoms/MenuLink";

export type StaticMenuProps = {
    className?: string;
};

const StaticMenu = (props: StaticMenuProps) => {
    const staticItems = [
        { id: "s1", name: "GIỚI THIỆU", href: "/about-us" },
        { id: "s2", name: "DỊCH VỤ", href: "/service" },
        { id: "s4", name: "TIN TỨC", href: "/blog-list" },
        { id: "s5", name: "LIÊN HỆ", href: "/contact" },
    ];

    return (
        <div>
            {staticItems.map((item) => (
                <MenuLink
                    item={item}
                    key={item.id}
                    className={props?.className}
                />
            ))}
        </div>
    );
};
export default StaticMenu;
