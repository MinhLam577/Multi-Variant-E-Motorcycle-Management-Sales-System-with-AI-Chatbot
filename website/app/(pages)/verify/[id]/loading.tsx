"use client";
import { Spin } from "antd";

export default function Loading() {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <Spin tip="Đang tải trang xác thực..." size="large" />
        </div>
    );
}
