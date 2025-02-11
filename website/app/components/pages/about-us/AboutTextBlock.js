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
            src="/images/about/1.jpg"
            alt="1.jpg"
          />
          <Image
            width={365}
            height={238}
            priority
            style={{ objectFit: "cover" }}
            className="img-fluid thumb2"
            src="/images/about/2.jpg"
            alt="2.jpg"
          />
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-5 offset-lg-1">
        <div className="about_content">
          <h2 className="title">
            Chào mừng khách hàng đến với Hồng Sơn Đà Nẵng
          </h2>
          <p className="mb30">
            Công ty ô tô Hồng Sơn Đà Nẵng là một trong những đại lý ô tô và xe
            máy điện hàng đầu tại Đà Nẵng. Chúng tôi chuyên bán các loại xe ô tô
            và xe máy điện từ các thương hiệu nổi tiếng trên thế giới.
          </p>
          <p className="mb50">
            Với cam kết về chất lượng và dịch vụ, Hồng Sơn Đà Nẵng đã trở thành
            một trong những đại lý ô tô và xe máy điện được tin cậy nhất tại Đà
            Nẵng.
          </p>
          <a className="btn btn-thm about-btn" href="#">
            Tìm hiểu thêm
          </a>
        </div>
      </div>
      {/* End .col */}
    </>
  );
};

export default AboutTextBlock;
