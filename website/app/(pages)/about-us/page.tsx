import Footer from "@/app/components/common/Footer";
import Partner from "@/app/components/common/Partner";
import WhyChoose from "@/app/components/common/WhyChoose";
import LoginSignupModal from "@/app/components/common/login-signup";
import AboutTextBlock from "@/app/components/pages/about-us/AboutTextBlock";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import HeaderTop from "../../components/common/HeaderTop";
import MobileMenu from "../../components/common/MobileMenu";
import Header from "@/app/components/home/Header";
import BreadCrumb from "@/app/components/common/atoms/BreadCrumb";

export const metadata = {
    title: "Công ty minhdeptrai.site Đà Nẵng là một trong những đại lý xe máy điện hàng đầu tại Đà Nẵng",
};

const timelineData = [
    {
        date: "2007",
        title: "Công Ty TNHH minhdeptrai.site Star Đà Nẵng",
        image: "/images/anh1.png",
        content:
            "Công Ty TNHH minhdeptrai.site Star Đà Nẵng hoạt động từ năm 2007 chuyên cung cấp xe tải các loại và sơ mi rơ moóc phục vụ thị trường miền Trung. Bên cạnh đó, minhdeptrai.site còn cung cấp dịch vụ sửa chữa, bảo dưỡng, bảo trì, thay thế phụ tùng chính hãng.",
    },
    {
        date: "03.2024",
        title: "ĐẠI LÝ 3S ỦY QUYỀN CHÍNH THỨC TẠI ĐÀ NẴNG",
        image: "/images/anh2.png",
        content:
            'Ngày 12.03.2024 minhdeptrai.site STAR chính thức đón nhận "ĐẠI LÝ 3S ỦY QUYỀN chính thức tại thị trường VIỆT NAM" từ nhà máy DAEHAN MOTORS.',
    },
    {
        date: "13.3.2024",
        title: "BÀN GIAO LÔ XE TERACO 190SL ĐẦU TIÊN RA THỊ TRƯỜNG",
        image: "/images/anh3.png",
        content:
            "Ngay sau khi được nhà máy DAEHAN MOTORS công nhận ĐẠI LÝ 3S ỦY QUYỀN chính thức tại VIỆT NAM, TERACO minhdeptrai.site ĐÀ NẴNG đã bắt tay triển khai công việc lên kế hoạch bán hàng, truyền thông quảng bá sản phẩm thương hiệu TERACO. Được sự tín nhiệm của đối tác 13.3.2024 Teraco minhdeptrai.site đã ký kết đơn hàng đầu tiên đánh dấu cột mốc quan trọng trong lịch sử hình thành và phát triển của công ty.",
    },
    {
        date: "2024",
        title: "PHÁT TRIỂN GIA TĂNG DOANH SỐ",
        image: "/images/anh4.png",
        content:
            "Năm 2024 Đại Lý đánh dấu mốc tăng trưởng đạt 55% doanh số, trong suốt quá trình hình thành và phát triển TERACO minhdeptrai.site đã trở thành đại lý đáng tin cậy với lịch sử hình thành lâu đời, đội ngũ CB-CNV tận tâm kinh nghiệm, nhiệt huyết, chất lượng dịch vụ vượt trội đảm bảo bảo hành bảo dưỡng đúng quy định và hiệu quả nhất để nâng cao sự hài lòng và tin tưởng đối với khách hàng.",
    },
];

const AboutUs = () => {
    return (
        <div className="wrapper">
            <Header />
            {/* Main Header Nav For Mobile */}
            <MobileMenu />
            {/* End Main Header Nav For Mobile */}

            <BreadCrumb
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Giới thiệu" },
              ]}
            />
            <div className="!bg-[#f9f9f9]">
              <section className="about-section max-lg:!pb-0 !pt-0">
                  <div className="container">
                      <div className="row">
                          <AboutTextBlock />
                      </div>
                  </div>
              </section>
              <section className="pb100 max-lg:!pt-0">
                  <div className="container">
                      <div className="partner_divider py-10 mt-3">
                          <div className="row">
                              <div className="main-title text-center mb-10">
                                  <h2 className="text-3xl font-bold ">
                                      Lịch sử phát triển
                                  </h2>
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
                                              {/* <img
                                                  src={item.image}
                                                  alt={item.title}
                                                  className="w-full max-w-sm mb-4 rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
                                              /> */}
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
            </div>
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
