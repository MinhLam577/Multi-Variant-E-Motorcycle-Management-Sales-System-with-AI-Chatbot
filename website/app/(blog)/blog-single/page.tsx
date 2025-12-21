import Footer from "@/app/components/common/Footer";
import DefaultHeader from "@/app/components/common/DefaultHeader";
import HeaderSidebar from "@/app/components/common/HeaderSidebar";
import HeaderTop from "@/app/components/common/HeaderTop";
import MobileMenu from "@/app/components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import Image from "next/image";
import Blog from "@/app/components/common/Blog";
import Meta from "@/app/components/blog/blog-single/Meta";
import Pagination from "@/app/components/blog/blog-single/Pagination";

export const metadata = {
    title: "minhdeptrai.site || Chuyên mua bán và trao đổi xe máy điện uy tín",
};

const BlogDynamicSingle = () => {
    return (
        <div className="wrapper">
            <div
                className="offcanvas offcanvas-end"
                tabIndex={-1}
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

            {/* Blog Single Post */}
            <section className="blog_post_container bt1 pt50 pb0 mt70-992">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 m-auto">
                            <div className="for_blog blog_single_post">
                                <div className="details">
                                    <div className="wrapper">
                                        <h2 className="title">Tiêu đề</h2>
                                        <Meta />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End .col */}
                    </div>
                    {/* End .row */}
                </div>
                {/* End .container */}

                <div className="container-fluid p0">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="blog-single-post-thumb">
                                <Image
                                    width={1519}
                                    height={475}
                                    priority
                                    style={{ objectFit: "cover" }}
                                    className="img-whp"
                                    src="/images/blog/bsp1.jpg"
                                    alt="bsp1.jpg"
                                />
                            </div>
                        </div>
                    </div>
                    {/* End .row */}
                </div>
                {/* End container-fluid */}
            </section>
            {/* Blog Single Post */}

            {/* Start Blog Single Post Description */}
            <section className="blog_post_container pt50 pb70">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-8">
                            <div className="main_blog_post_content">
                                <div className="mbp_thumb_post">
                                    <h4>Mô tả</h4>
                                    <p className="para mb25 mt20">
                                        Tháng này, Auto Trader đang trao tặng
                                        một chiếc Mini Electric trị giá £26,000
                                        – cộng thêm tối đa £1,200 cho bảo hiểm
                                        xe của bạn, được Compare the Market bảo
                                        hiểm.
                                    </p>
                                    <p className="para mb20">
                                        Không có bắt hay phí ẩn – bạn chỉ cần
                                        trên 18 tuổi, và là cư dân UK nắm giữ
                                        bằng lái xe UK đầy đủ. Bạn có thể kiểm
                                        tra các điều khoản và điều kiện đầy đủ
                                        tại đây.
                                    </p>
                                    <p className="para mb40">
                                        Đơn giản chỉ cần điền vào biểu mẫu quay
                                        số trúng thưởng vào bất kỳ thời điểm nào
                                        giữa 1 tháng 7 năm 2021 và 31 tháng 7
                                        năm 2021 và chiếc Mini Electric này có
                                        thể là của bạn miễn phí!
                                    </p>

                                    <div className="row">
                                        <div className="col-lg-12">
                                            <Image
                                                width={796}
                                                height={465}
                                                style={{
                                                    objectFit: "cover",
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                                src="/images/blog/bsp2.jpg"
                                                alt="bsp2.jpg"
                                            />
                                        </div>
                                    </div>
                                    {/* End .row */}

                                    {/* End .row */}
                                </div>
                                {/* End mbp_thumb_post */}

                                <hr className="mt50" />
                                <Pagination />
                                <hr />

                                {/* End CommentForm */}
                            </div>
                            {/* End main_blog_post_content */}
                        </div>
                        {/* End .col */}
                    </div>
                    {/* End .row */}
                </div>
                {/* End .container */}
            </section>
            {/* End Blog Single Post Description */}

            {/* Our Blog Recent Articles */}
            <section className="our-blog pb90 bgc-f9">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="main-title text-center">
                                <h2>Bài viết gần đây</h2>
                            </div>
                        </div>
                    </div>
                    {/* End .row */}

                    <div className="row">
                        <Blog />
                    </div>
                    {/* End .row */}
                </div>
                {/* End .container */}
            </section>
            {/* Our Blog Recent Articles */}

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

export default BlogDynamicSingle;
