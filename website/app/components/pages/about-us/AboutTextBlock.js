import Image from "next/image";

const AboutTextBlock = () => {
    return (
        <>
            <div className="col-lg-6">
                <div className="about_thumb mb30-md">
                    <Image
                        width={636}
                        height={667}
                        priority
                        style={{ objectFit: "cover" }}
                        className="thumb1"
                        src="/images/about/introduction.jpg"
                        alt="1.jpg"
                    />
                    <Image
                        width={365}
                        height={238}
                        priority
                        style={{ objectFit: "cover" }}
                        className="img-fluid thumb2 rounded-md hidden lg:block"
                        src="/images/about/image.jpg"
                        alt="2.jpg"
                    />
                </div>
            </div>
            {/* End .col */}
            <div className="col-lg-5 offset-lg-1">
                <div className="about_content">
                    <h2 className="title">
                        Chào mừng bạn đến với minhdeptrai.site Đà Nẵng
                    </h2>
                    <p className="mb30">
                        Công ty minhdeptrai.site Đà Nẵng là một trong những đại
                        lý ô tô và xe máy điện hàng đầu tại Đà Nẵng. Chúng tôi
                        chuyên bán các loại xe ô tô và xe máy điện từ các thương
                        hiệu nổi tiếng trên thế giới.
                    </p>
                    <p className="mb50">
                        Với cam kết về chất lượng và dịch vụ, minhdeptrai.site
                        Đà Nẵng đã trở thành một trong những đại lý ô tô và xe
                        máy điện được tin cậy nhất tại Đà Nẵng.
                    </p>
                </div>
            </div>
            {/* End .col */}
        </>
    );
};

export default AboutTextBlock;
