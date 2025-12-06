import Footer from "@/app/components/common/Footer";
import { HeaderWithActions } from "@/app/components/common/HeaderWidthActions";
import LoginSignupModal from "@/app/components/common/login-signup";
import MobileMenu from "@/app/components/common/MobileMenu";
import Partner from "@/app/components/common/Partner";
import WhyChoose from "@/app/components/common/WhyChoose";
import Blog from "@/app/components/home/Blog";
import FeaturedFilterListing from "@/app/components/home/FeaturedFilterListing";
import Header from "@/app/components/home/Header";
import Hero from "@/app/components/home/Hero";
import SaleBanner from "@/app/components/home/SaleBanner";
import Link from "next/link";
import SearchMobile from "@/app/components/common/SearchMobile";
export const metadata = {
    title: "minhdeptrai.site | Mua Bán Xe Máy Điện Uy Tín & Chất Lượng",
    description: `minhdeptrai.site - Địa chỉ uy tín chuyên cung cấp các dòng xe hơi chất lượng cao, dịch vụ chăm sóc khách hàng chuyên nghiệp, giá cả cạnh tranh.`,
};

const Home = () => {
    return (
        <div className="wrapper ovh">
            <HeaderWithActions />

            <Header />
            <MobileMenu />

            <SearchMobile />
            <Hero />

            <section className="featured-product">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="main-title text-center">
                                <h2>Sản phẩm bán chạy </h2>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div
                            className="col-lg-12"
                            data-aos-delay="100"
                            data-aos="fade-up"
                            suppressHydrationWarning={true}
                        >
                            <FeaturedFilterListing />
                        </div>
                    </div>

                    <div className="row mt20">
                        <div className="col-lg-12">
                            <div className="text-center">
                                <Link
                                    href="/listing-v1/?type=car"
                                    className="more_listing"
                                >
                                    Xem tất cả
                                    <span className="icon">
                                        <span className="fas fa-plus" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="our-partner pt0 pb90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="main-title text-center">
                                <h2>Đối tác</h2>
                            </div>
                        </div>
                    </div>

                    <div className="partner_divider">
                        <div className="row">
                            <Partner />
                        </div>
                    </div>
                </div>
            </section>

            <section className="our-blog pb90 pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="main-title text-center">
                                <h2>Khuyến mãi</h2>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <SaleBanner />
                    </div>
                </div>
            </section>

            <section className="why-chose pt0">
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

            <section className="our-blog pb90 pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="main-title text-center">
                                <h2>Tin tức</h2>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <Blog />
                    </div>
                </div>
            </section>

            <Footer />

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
        </div>
    );
};

export default Home;
