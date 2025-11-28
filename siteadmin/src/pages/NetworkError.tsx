import { Button, Result } from "antd";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import apiClient from "@/api/apiClient";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const NetworkError = () => {
    const navigate = useNavigate();
    useDocumentTitle("Lỗi mạng");
    useEffect(() => {
        // Kiểm tra lastUrl khi trang được tải
        const lastUrl = localStorage.getItem("lastUrl");
        if (lastUrl && window.location.pathname === "/network-error") {
            // Nếu trang được tải lại (refresh), điều hướng về lastUrl
            const handleRefresh = () => {
                localStorage.removeItem("lastUrl");
                navigate(lastUrl); // Điều hướng về lastUrl
            };

            // Gắn sự kiện beforeunload để xử lý refresh
            window.addEventListener("beforeunload", handleRefresh);

            // Dọn dẹp sự kiện khi component unmount
            return () => {
                window.removeEventListener("beforeunload", handleRefresh);
            };
        }
    }, []);

    const handleTryAgain = async () => {
        const lastUrl = localStorage.getItem("lastUrl") || "/";
        try {
            // Kiểm tra server trước khi điều hướng
            await apiClient.get("/ping");
            localStorage.removeItem("lastUrl");
            window.location.href = lastUrl;
        } catch {
            alert("Server vẫn không phản hồi. Vui lòng thử lại sau.");
        }
    };

    return (
        <div>
            <Result
                status="500"
                title="500"
                subTitle="Có lỗi xảy ra trong quá trình kết nối đến server. Vui lòng thử lại sau."
                extra={
                    <div className="flex gap-2 items-center justify-center">
                        <Button type="primary" onClick={() => handleTryAgain()}>
                            Thử lại
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default NetworkError;
