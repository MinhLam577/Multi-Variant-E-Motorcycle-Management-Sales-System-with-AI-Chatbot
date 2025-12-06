"use client";
import { useAuth } from "@/context/auth.context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DashboardSidebarMenu = () => {
    const path = usePathname();
    const { logOut } = useAuth();
    const menuItems = [
        { icon: "flaticon-dashboard", label: "Thống kê", path: "/dashboard" },
        {
            icon: "flaticon-user-2",
            label: "Tài khoản của tôi",
            path: "/profile",
        },
        { icon: "flaticon-location-pin", label: "Địa chỉ", path: "/address" },

        { icon: "flaticon-coin", label: "Đơn mua", path: "/purchase" },
        { icon: "flaticon-message", label: "Messages", path: "/messages" },
    ];

    const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        await logOut();
    };

    return (
        <>
            {menuItems.map((item) => (
                <li key={item.path}>
                    <Link
                        href={item.path}
                        className={item.path === path ? "active" : ""}
                    >
                        <span className={item.icon} />
                        {item.label}
                    </Link>
                </li>
            ))}
            <li>
                <Link href="#!" onClick={handleLogout}>
                    <span className="flaticon-logout" />
                    Logout
                </Link>
            </li>
        </>
    );
};

export default DashboardSidebarMenu;
