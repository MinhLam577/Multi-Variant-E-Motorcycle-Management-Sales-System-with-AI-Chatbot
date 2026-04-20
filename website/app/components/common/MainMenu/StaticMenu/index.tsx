"use client";
import Link from "next/link";
import MenuLink from "../../atoms/MenuLink";

export type StaticMenuProps = {
  className?: string
}

const StaticMenu = (props: StaticMenuProps) => {
    const staticItems = [
        { id: "s1", name: "GIỚI THIỆU", href: "/about-us" },
        { id: "s4", name: "TIN TỨC", href: "/blog-list" },
    ];

    return (
        <div>
            {staticItems.map((item) => (
                <MenuLink item={item} key={item.id} className={props?.className}/>
            ))}
        </div>
    );
};
export default StaticMenu;
