import Footer from "@/app/components/common/Footer";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import HeaderTop from "../../components/common/HeaderTop";
import MobileMenu from "../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import ListWithImage from "@/app/components/pages/service/ListWithImage";
import ServiceBlock from "@/app/components/pages/service/ServiceBlock";
import ScheduleService from "@/app/components/pages/service/ScheduleService";
import ServiceHours from "@/app/components/pages/service/ServiceHours";
import Header from "@/app/components/home/Header";
import BreadCrumb from "@/app/components/common/atoms/BreadCrumb";

export const metadata = {
    title: "Service || minhdeptrai.site ",
};

const Service = () => {
    return (
        <div className="wrapper">
            <Header />

            {/* Main Header Nav For Mobile */}
            <MobileMenu />
            {/* End Main Header Nav For Mobile */}

            <BreadCrumb
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Dịch vụ" },
                ]}
                bgWrapper="bg-[#f9f9f9]"
            />

            {/* Service Section Area */}
            <section className="our-service bgc-f9 pb90 pt0">
                <div className="container">
                    <ListWithImage />
                </div>
            </section>
            {/* End Service Section Area */}

            {/* Service Section Area */}
            <section className="our-service">
                <div className="container">
                    <ServiceBlock />
                </div>
            </section>
            {/* Service Section Area */}

            {/* Service Forms Section Area */}
            <section className="service-forms bgc-f9">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-xl-7">
                            <div className="service_form mb30-sm">
                                <h5 className="title">Đặt lịch ngay</h5>
                                <ScheduleService />
                            </div>
                        </div>
                        {/* End .col */}

                        <div className="col-md-6 col-xl-5">
                            <div className="opening_hour_widgets">
                                <div className="wrapper">
                                    <h4 className="title">Giờ mở cửa</h4>
                                    <ServiceHours />
                                </div>
                            </div>
                        </div>
                        {/* End .col */}
                    </div>
                    {/* End .row */}
                </div>
                {/* End .container */}
            </section>
            {/* End Service Forms Section Area */}

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

export default Service;
