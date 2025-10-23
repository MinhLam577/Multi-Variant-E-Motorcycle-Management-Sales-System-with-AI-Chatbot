import { Result } from "antd";

const Page404 = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Xin lỗi, tôi không tìm thấy trang bạn yêu cầu."
        />
    );
};

export default Page404;
