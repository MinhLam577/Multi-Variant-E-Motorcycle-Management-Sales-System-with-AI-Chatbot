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
