import Footer from "@/app/components/common/Footer";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import HeaderTop from "../../components/common/HeaderTop";
import MobileMenu from "../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import Form from "@/app/components/pages/login/Form";
import SocialLogin from "@/app/components/pages/login/SocialLogin";
import Link from "next/link";

export const metadata = {
    title: "Log In - HongSon",
};

const LogIn = () => {
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

            {/*  SigIn */}
            <section className="our-log bgc-f9 !pt-14">
                <div className="container">
                    <div className="row relative mt-0 md:max-lg:!mt-12 lg:mt-0 flex flex-col md:flex-row z-[100]">
                        <div className="col-md-6 col-lg-6 offset-xl-1 col-xl-5 flex-1 !mr-0 sm:max-xl:!mr-[100px]">
                            <div className="login_form mt60-sm">
                                <h2 className="title">Sign in</h2>
                                <p className="text-sm">
                                    <span className="text-sm text-gray-500 mr-1">
                                        Are you a new a dealer?
                                    </span>
                                    <Link href="/signup" className="text-base">
                                        Sign up.
                                    </Link>
                                </p>
                                <Form />
                            </div>
                        </div>
                        {/* End .col */}

                        <div className="col-md-6 col-lg-5 offset-xl-1 col-xl-5 flex-1 md:border-l border-gray-200 border-solid !pl-4 md:!pl-[100px]">
                            <div className="login_with !mt-0 border-none !pl-0">
                                <h2 className="title">Connect With Social</h2>
                                <SocialLogin />
                            </div>
                        </div>
                        {/* End .col */}
                    </div>
                    {/* End .row */}
                </div>
                {/* End .container */}
            </section>
            {/*  SigIn */}

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

export default LogIn;
