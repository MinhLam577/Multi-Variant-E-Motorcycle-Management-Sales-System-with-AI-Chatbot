"use client";
import Footer from "@/app/components/common/Footer";
import DefaultHeader from "@/app/components/common/DefaultHeader";
import HeaderSidebar from "@/app/components/common/HeaderSidebar";
import HeaderTop from "@/app/components/common/HeaderTop";
import MobileMenu from "@/app/components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import Blog from "@/app/components/common/Blog";
import Meta from "@/app/components/blog/blog-single/Meta";
import Pagination from "@/app/components/blog/blog-single/Pagination";
import { useParams } from "next/navigation";
import { useStore } from "@/context/store.context";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

const BlogDynamicSingle = observer(() => {
    const { id } = useParams();
    const store = useStore();
    const storeBlog = store.blogsObservable;
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                await storeBlog.getBlogDetails(id as string);
            };
            fetchData();
        }
    }, [id]);
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
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <article className="space-y-6">
                        <header className="text-center !z-[100] md:!z-0 relative">
                            <h1 className="text-3xl pt-4 md:!pt-0 md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                                {storeBlog.dataById?.title}
                            </h1>
                            <Meta />
                        </header>

                        {/* Optional banner image or spacing */}
                        <div className="w-full h-[1px] bg-gray-200 my-6"></div>
                    </article>
                </div>
            </section>

            <section className="py-16 bg-[#f3f4f6] !pb-0">
                {/* nền tổng thể */}
                <div className="max-w-3xl mx-auto px-4">
                    <article className=" md:p-10">
                        {/* hoặc bỏ hẳn bg nếu muốn */}
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Mô tả
                        </h2>
                        <div
                            className="prose prose-lg max-w-none prose-img:rounded-xl prose-img:shadow-sm"
                            dangerouslySetInnerHTML={{
                                __html: storeBlog.dataById?.content,
                            }}
                        />
                        <div className="my-10 border-t "></div>
                        <Pagination />
                        <div className="mt-10 border-t "></div>
                    </article>
                </div>
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
});

export default BlogDynamicSingle;
