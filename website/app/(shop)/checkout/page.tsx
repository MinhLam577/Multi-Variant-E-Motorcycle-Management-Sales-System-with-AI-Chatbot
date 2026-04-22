import Footer from "@/app/components/common/Footer";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import HeaderTop from "../../components/common/HeaderTop";
import MobileMenu from "../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import BillingMain from "@/app/components/shop/checkout";
import AddressDefault from "@/app/components/shop/checkout/addressDefault";
import Header from "@/app/components/home/Header";

export const metadata = {
    title: "Thanh Toán || minhdeptrai.site ",
};

const Checkout = () => {
    return (
        <div className="wrapper">
            <Header />

            {/* Main Header Nav For Mobile */}
            <MobileMenu />
            {/* End Main Header Nav For Mobile */}

            {/* Inner Page Breadcrumb */}
            <section className="inner_page_breadcrumb style2 bgc-f9 bt1 inner_page_section_spacing">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="breadcrumb_content style2">
                                <h2 className="breadcrumb_title">Thanh Toán</h2>

                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/">Trang chủ</a>
                                    </li>
                                    <li
                                        className="breadcrumb-item active"
                                        aria-current="page"
                                    >
                                        Thanh Toán
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Inner Page Breadcrumb */}

            {/* Shop Checkouts Content */}
            <section className="shop-checkouts pt0 bgc-f9 pb100">
                <div className="container">
                    <div className="row">
                        <BillingMain />
                    </div>
                </div>
            </section>
            {/* End Shop Checkouts Content */}

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

export default Checkout;
// <BillingMain />
