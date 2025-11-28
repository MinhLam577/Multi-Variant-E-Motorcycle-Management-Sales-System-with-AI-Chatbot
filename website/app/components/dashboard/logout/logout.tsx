"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { keyStorageAccount } from "@/app/constants";
import secureLocalStorage from "react-secure-storage";

export default function LogoutAccount() {
    const router = useRouter();

    const handleLogout = () => {
        secureLocalStorage.removeItem(keyStorageAccount);
        sessionStorage.removeItem(keyStorageAccount);
        router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="text-left text-gray-700 hover:text-red-500 transition-all duration-200 text-sm font-medium"
        >
            Đăng xuất
        </button>
    );
}
