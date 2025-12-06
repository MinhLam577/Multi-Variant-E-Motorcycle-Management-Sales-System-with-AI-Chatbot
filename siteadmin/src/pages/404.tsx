import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Result } from "antd";

const Page404 = () => {
    useDocumentTitle("Không tìm thấy trang web yêu cầu");
    return (
        <Result
            status="404"
            title="404"
            subTitle="Xin lỗi, tôi không tìm thấy trang bạn yêu cầu."
        />
    );
};

export default Page404;
