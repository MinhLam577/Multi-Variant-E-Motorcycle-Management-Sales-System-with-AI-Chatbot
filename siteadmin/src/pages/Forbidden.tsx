import { Button, Result } from "antd";
import { useAuth } from "../contexts/AuthProvider";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Forbidden = () => {
    const auth = useAuth();
    useDocumentTitle("Bạn không có quyền truy cập vào trang web này");
    const handleLogout = () => {
        auth.logOut();
    };

    return (
        <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không được phép truy cập trang này."
            extra={
                <Button type="primary" onClick={() => handleLogout()}>
                    Về trang chủ
                </Button>
            }
        />
    );
};

export default Forbidden;
