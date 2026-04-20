import Image from "next/image";

const ServiceBlock = () => {
    return (
        <>
            <div className="row">
                <div className="col-md-6 col-xl-6">
                    <div className="service_thumb mb30-sm">
                        <Image
                            width={526}
                            height={354}
                            priority
                            layout="responsive"
                            src="/images/service/oil-change.jpg"
                            alt="oil-change"
                        />
                    </div>
                </div>
                <div className="col-md-6 col-xl-5 offset-xl-1">
                    <div className="service_include2 mt0-md">
                        <h3 className="title">Thay Dầu Định Kỳ</h3>
                        <p className="para">
                            Dịch vụ thay dầu giúp động cơ vận hành êm ái, bền bỉ
                            và tiết kiệm nhiên liệu hơn. Chúng tôi sử dụng dầu
                            nhớt chất lượng cao, phù hợp với từng loại xe, đảm
                            bảo bảo vệ tối ưu cho động cơ của bạn trong mọi điều
                            kiện vận hành.
                        </p>
                        <p>
                            Đội ngũ kỹ thuật viên kiểm tra tổng thể và tư vấn
                            lịch thay dầu phù hợp, giúp xe luôn trong trạng thái
                            hoạt động tốt nhất và kéo dài tuổi thọ động cơ.
                        </p>
                    </div>
                </div>
            </div>

            {/* End .row */}

            <div className="row mt120 mt50-sm">
                <div className="col-md-6 col-xl-6">
                    <div className="service_include2 mt0-md mb30-sm">
                        <h3 className="title">Kiểm Tra & Bảo Dưỡng Phanh</h3>
                        <p className="para">
                            Hệ thống phanh đóng vai trò quan trọng trong việc
                            đảm bảo an toàn khi lái xe. Chúng tôi cung cấp dịch
                            vụ kiểm tra, vệ sinh và thay thế má phanh, đĩa phanh
                            với quy trình chuyên nghiệp và thiết bị hiện đại.
                        </p>
                        <p>
                            Phát hiện sớm các dấu hiệu hao mòn hoặc hư hỏng giúp
                            bạn tránh những rủi ro không đáng có, mang lại sự an
                            tâm trên mọi hành trình.
                        </p>
                    </div>
                </div>
                <div className="col-md-6 col-xl-5 offset-xl-1">
                    <div className="service_thumb">
                        <Image
                            width={526}
                            height={354}
                            priority
                            layout="responsive"
                            src="/images/service/brake-check.jpg"
                            alt="brake-service"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServiceBlock;
