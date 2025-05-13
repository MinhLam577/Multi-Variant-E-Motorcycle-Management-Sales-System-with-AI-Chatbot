import Footer from "@/app/components/common/Footer";
import Partner from "@/app/components/common/Partner";
import WhyChoose from "@/app/components/common/WhyChoose";
import LoginSignupModal from "@/app/components/common/login-signup";
import AboutTextBlock from "@/app/components/pages/about-us/AboutTextBlock";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import HeaderTop from "../../components/common/HeaderTop";
import MobileMenu from "../../components/common/MobileMenu";

export const metadata = {
  title:
    "Công ty ô tô Hồng Sơn Đà Nẵng là một trong những đại lý ô tô và xe máy điện hàng đầu tại Đà Nẵng",
};

const timelineData = [
  {
    date: "2007",
    title: "Công Ty TNHH Ô Tô Hồng Sơn Star Đà Nẵng",
    image: "/images/anh1.png",
    content:
      "Công Ty TNHH Ô Tô Hồng Sơn Star Đà Nẵng hoạt động từ năm 2007 chuyên cung cấp xe tải các loại và sơ mi rơ moóc phục vụ thị trường miền Trung. Bên cạnh đó, Hồng Sơn Star còn cung cấp dịch vụ sửa chữa, bảo dưỡng, bảo trì, thay thế phụ tùng chính hãng.",
  },
  {
    date: "03.2024",
    title: "ĐẠI LÝ 3S ỦY QUYỀN CHÍNH THỨC TẠI ĐÀ NẴNG",
    image: "/images/anh2.png",
    content:
      'Ngày 12.03.2024 Ô TÔ HỒNG SƠN STAR chính thức đón nhận "ĐẠI LÝ 3S ỦY QUYỀN chính thức tại thị trường VIỆT NAM" từ nhà máy DAEHAN MOTORS.',
  },
  {
    date: "13.3.2024",
    title: "BÀN GIAO LÔ XE TERACO 190SL ĐẦU TIÊN RA THỊ TRƯỜNG",
    image: "/images/anh3.png",
    content:
      "Ngay sau khi được nhà máy DAEHAN MOTORS công nhận ĐẠI LÝ 3S ỦY QUYỀN chính thức tại VIỆT NAM, TERACO HỒNG SƠN STAR ĐÀ NẴNG đã bắt tay triển khai công việc lên kế hoạch bán hàng, truyền thông quảng bá sản phẩm thương hiệu TERACO. Được sự tín nhiệm của đối tác 13.3.2024 Teraco Hồng Sơn Star đã ký kết đơn hàng đầu tiên đánh dấu cột mốc quan trọng trong lịch sử hình thành và phát triển của công ty.",
  },
  {
    date: "2024",
    title: "PHÁT TRIỂN GIA TĂNG DOANH SỐ",
    image: "/images/anh4.png",
    content:
      "Năm 2024 Đại Lý đánh dấu mốc tăng trưởng đạt 55% doanh số, trong suốt quá trình hình thành và phát triển TERACO HỒNG SƠN STAR đã trở thành đại lý đáng tin cậy với lịch sử hình thành lâu đời, đội ngũ CB-CNV tận tâm kinh nghiệm, nhiệt huyết, chất lượng dịch vụ vượt trội đảm bảo bảo hành bảo dưỡng đúng quy định và hiệu quả nhất để nâng cao sự hài lòng và tin tưởng đối với khách hàng.",
  },
];

const AboutUs = () => {
  return (
    <div className="wrapper">
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <HeaderSidebar />
      </div>
      {/* Sidebar Panel End */}

      {/* header top */}
      <HeaderTop />
      {/* End header top */}

      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Main Header Nav For Mobile */}
      <MobileMenu />
      {/* End Main Header Nav For Mobile */}

      {/* Inner Page Breadcrumb */}
      <section className="inner_page_breadcrumb">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb_content">
                <h2 className="breadcrumb_title">Về chúng tôi</h2>
                <p className="subtitle">
                  Công ty ô tô Hồng Sơn Đà Nẵng là một trong những đại lý ô tô
                  và xe máy điện hàng đầu tại Đà Nẵng.
                </p>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Trang chủ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <a href="#">Về chúng tôi</a>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Inner Page Breadcrumb */}

      {/* About Text Content */}
      <section className="about-section pb130">
        <div className="container">
          <div className="row">
            <AboutTextBlock />
          </div>
        </div>
      </section>
      {/* End About Text Content */}

      {/* Why Chose Us */}
      <section className="why-chose pb90 pt0-md">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="main-title text-center">
                <h2>Tại sao chọn chúng tôi?</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <WhyChoose />
          </div>
        </div>
      </section>
      {/* End Why Chose Us */}

      {/* Our Partners */}
      <section className="our-partner pb100">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center">
                <h2>Đối tác</h2>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="partner_divider">
            <div className="row">
              <Partner />
            </div>
            {/* End .row */}
          </div>

          {/* End Lich su phat trien row */}
          <div className="partner_divider bg-gray-50 py-10 mt-3">
            <div className="row">
              <div className="main-title text-center mb-10">
                <h2 className="text-3xl font-bold ">Lịch sử phát triển</h2>
              </div>
              <div className="relative border-l-2 border-red-500 pl-12 space-y-12">
                {timelineData.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex gap-6 group transition-transform duration-300 cursor-pointer hover:scale-[1.015]"
                    data-aos="fade-up"
                    data-aos-delay={100}
                  >
                    {/* Dot */}
                    <div className="absolute -left-6 top-2 w-4 h-4 bg-red-500 rounded-full border-4 border-white z-10 transition-all duration-300 group-hover:bg-red-700 group-hover:scale-125 group-hover:shadow-md"></div>

                    {/* Date */}
                    <div className="w-28 text-red-600 font-semibold text-sm group-hover:text-red-700 transition-colors duration-200">
                      {item.date}
                    </div>

                    {/* Content box */}
                    <div className="bg-white p-4 rounded-lg shadow-md w-full transition-all duration-300 group-hover:shadow-2xl group-hover:border-l-4 group-hover:border-red-400">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full max-w-sm mb-4 rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      <h3 className="text-red-600 font-bold uppercase mb-2 transition-colors duration-200 group-hover:text-red-700">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-800 transition-colors duration-200">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End  Our Partners */}

      {/* Our Footer */}
      <Footer />
      {/* End Our Footer */}

      {/* Modal */}
      <div
        className="sign_up_modal modal fade"
        id="logInModal"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex={-1}
        aria-hidden="true"
      >
        <LoginSignupModal />
      </div>
      {/* End Modal */}
    </div>
    // End wrapper
  );
};

export default AboutUs;
