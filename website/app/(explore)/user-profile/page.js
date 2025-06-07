import Footer from "@/app/components/common/Footer";
import LoginSignupModal from "@/app/components/common/login-signup";
import BreadCrumb from "@/app/components/user-profile/BreadCrumb";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import HeaderTop from "../../components/common/HeaderTop";
import MobileMenu from "../../components/common/MobileMenu";

export const metadata = {
    title: "Ô Tô Hồng Sơn",
    description: `Ô Tô Hồng Sơn cung cấp đa dạng dòng xe với giá tốt nhất, hỗ trợ tài chính linh hoạt và được tin cậy bởi hàng ngàn khách hàng.`,
};

const UserProfile = () => {
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

            {/* Agent Single Grid View */}
            <section className="our-agent-single bgc-f9 pb90 inner_page_section_spacing mt70-992">
                <div className="container">
                    <div className="row mb30">
                        <div className="col-xl-12">
                            <BreadCrumb />
                        </div>
                    </div>
                    {/* End breadcrumb */}
                </div>
                {/* End .container */}
            </section>

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

export default UserProfile;
