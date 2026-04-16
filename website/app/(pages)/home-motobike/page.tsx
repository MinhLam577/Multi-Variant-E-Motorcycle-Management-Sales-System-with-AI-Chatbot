import Footer from "@/app/components/common/Footer";
import LoginSignupModal from "@/app/components/common/login-signup";
import MobileMenu from "@/app/components/common/MobileMenu";
import Partner from "@/app/components/common/Partner";
import WhyChoose from "@/app/components/common/WhyChoose";
import Blog from "@/app/components/home/Blog";
import Header from "@/app/components/home/Header";
import MotorBikeTypeList from "@/app/components/home/MotorBikerTypeList";
import MotorFeaturedFilterListing from "@/app/components/home/MotorFeaturedFilterListing";
import MotorHero from "@/app/components/home/MotorHero";
import SaleBanner from "@/app/components/home/SaleBanner";
import Link from "next/link";
export const metadata = {
    title: "minhdeptrai.site | Mua Bán Xe Máy Điện Uy Tín & Chất Lượng",
    description: `minhdeptrai.site - Địa chỉ uy tín chuyên cung cấp các dòng xe máy điện chất lượng cao, dịch vụ chăm sóc khách hàng chuyên nghiệp, giá cả cạnh tranh.`,
};

const partners = [
    { imgPath: "/images/partners/bike_1.png", delay: 100 },
    { imgPath: "/images/partners/bike_1.png", delay: 300 },
    { imgPath: "/images/partners/bike_1.png", delay: 500 },
    { imgPath: "/images/partners/bike_1.png", delay: 700 },
    { imgPath: "/images/partners/bike_1.png", delay: 900 },
    { imgPath: "/images/partners/bike_1.png", delay: 1100 },
];

const filterOptions = [
    { value: "*", name: "Tất cả" },
    { value: "new", name: "Xe điện Vinfast" },
    { value: "car", name: "Xe YADEKA" },
    { value: "car", name: "Xe YAKA" },
    { value: "car", name: "Xe EVGO" },
    { value: "car", name: "Xe điện thời trang" },
    { value: "car-specialized", name: "Xe điện học sinh" },
];

const HomeMotorbike = () => {
    return (
        <div className="wrapper ovh">
            {/* Main Header Nav */}
            <Header />
            {/* End Main Header Nav */}

            {/* Main Header Nav For Mobile */}
            <MobileMenu />
            {/* End Main Header Nav For Mobile */}

            {/* Hero */}
            <MotorHero />
            {/* End Hero */}

            {/* Featured Product  */}
            <section className="featured-product">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="main-title text-center">
                                <h2>Xe bán chạy</h2>
                            </div>
                        </div>
                    </div>
                    {/* End .row */}

                    <div className="row">
                        <div
                            className="col-lg-12"
                            data-aos-delay="100"
                            data-aos="fade-up"
                            suppressHydrationWarning
                        >
                            <MotorFeaturedFilterListing />
                        </div>
                    </div>
                    {/* End .row */}

                    <div className="row  mt20">
                        <div className="col-lg-12">
                            <div className="text-center ">
                                <Link
                                    href="/listing-v1?type=motorbike"
                                    className="more_listing "
                                >
                                    Xem tất cả{" "}
                                    <span className="icon">
                                        <span className="fas fa-plus" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* End .row */}
                </div>
                {/* End .container */}
            </section>
            {/* End Featured Product  */}

            {/* Our Partners */}
            <section className="our-partner pt0 pb100">
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
            {/* End Our Partners */}

            {/* Category Product  */}
            <section className="featured-product">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="main-title text-center">
                                <h2>Cách loại xe máy điện</h2>
                            </div>
                        </div>
                    </div>
                    {/* End .row */}

                    <div className="row">
                        <div
                            className="col-lg-12"
                            data-aos-delay="100"
                            data-aos="fade-up"
                            suppressHydrationWarning
                        >
                            <MotorBikeTypeList />
                        </div>
                    </div>
                    {/* End .row */}

                    <div className="row mt20 ">
                        <div className="col-lg-12 ">
                            <div className="text-center mt-20">
                                <Link
                                    href="/listing-v1?type=motorbike"
                                    className="more_listing"
                                >
                                    Xem tất cả{" "}
                                    <span className="icon">
                                        <span className="fas fa-plus" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* End .row */}
                </div>
                {/* End .container */}
            </section>
            {/* End Category Product  */}

            {/* Sale Banner  */}
            <section className="our-blog pb90 pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="main-title text-center">
                                <h2>Khuyến mãi</h2>
                            </div>
                        </div>
                    </div>
                    {/* End .row */}

                    <div className="row">
                        <SaleBanner />
                    </div>
                    {/* End .row */}
                </div>
            </section>
            {/* End Sale Banner  */}

            {/* Why Chose us  */}
            <section className="why-chose pt0 pb90">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="main-title text-center">
                                <h2>Về chúng tôi?</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <WhyChoose />
                    </div>
                </div>
            </section>
            {/* Why Chose us  */}

            {/* Our Blog */}
            <section className="our-blog pb90 pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="main-title text-center">
                                <h2>Tin tức</h2>
                            </div>
                        </div>
                    </div>
                    {/* End .row */}

                    <div className="row">
                        <Blog />
                    </div>
                    {/* End .row */}
                </div>
            </section>
            {/* End Our Blog */}

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

export default HomeMotorbike;
