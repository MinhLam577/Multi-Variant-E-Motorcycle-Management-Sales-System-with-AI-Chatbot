"use client";
import React from "react";
import { useAuth } from "@/context/auth.context";

export default function LogoutAccount() {
    const { logOut } = useAuth();

    return (
        <button
            onClick={logOut}
            className="text-left text-gray-700 hover:text-red-500 transition-all duration-200 text-sm font-medium"
        >
            Đăng xuất
        </button>
    );
}
