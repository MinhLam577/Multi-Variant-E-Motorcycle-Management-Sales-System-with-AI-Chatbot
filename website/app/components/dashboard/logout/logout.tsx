"use client";
import React from "react";
import { useRouter } from "next/navigation"; // ✅ đúng với App Router// hoặc "next/navigation" nếu bạn đang dùng App Router
import { keyStorageAccount } from "@/app/constants";
import secureLocalStorage from "react-secure-storage";

export default function LogoutAccount() {
  const router = useRouter(); // ✅ Gọi hook trực tiếp trong component

  const handleLogout = () => {
    // Xóa localStorage
    secureLocalStorage.removeItem(keyStorageAccount);
    // secureLocalStorage.removeItem("keyStorageAccount");

    // Chuyển trang sau khi xóa
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
