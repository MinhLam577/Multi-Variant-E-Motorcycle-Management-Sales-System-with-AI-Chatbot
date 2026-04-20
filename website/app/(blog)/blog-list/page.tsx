import Footer from "@/app/components/common/Footer";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import HeaderTop from "../../components/common/HeaderTop";
import MobileMenu from "../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import Pagination from "@/app/components/blog/Pagination";
import Sidebar from "@/app/components/blog/Sidebar";
import BlogList from "@/app/components/blog/BlogList";
import Header from "@/app/components/home/Header";
import BreadCrumb from "@/app/components/common/atoms/BreadCrumb";
export const metadata = {
    title: "Blog List || minhdeptrai.site",
};

const Blog = () => {
    return (
        <div className="wrapper">
            <Header/>

            {/* Main Header Nav For Mobile */}
            <MobileMenu />
            {/* End Main Header Nav For Mobile */}


            <BreadCrumb
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Tin tức" },
              ]}
              bgWrapper="bg-[#fff]"
            />

            {/* <!-- Main Blog Post Content --> */}
            <section className="blog_post_container inner_page_section_spacing !pt-0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-xl-9">
                            <BlogList />
                        </div>
                        {/* End .col-8 */}

                        <div className="col-lg-4 col-xl-3">
                            <Sidebar />
                        </div>
                        {/* End .col-4 */}
                    </div>
                    {/* End .row */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="mbp_pagination mt20">
                                <Pagination />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- Main Blog Post Content --> */}

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
    );
};

export default Blog;
