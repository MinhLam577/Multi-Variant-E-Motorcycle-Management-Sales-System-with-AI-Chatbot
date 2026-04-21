import Footer from "@/app/components/common/Footer";
import LoginSignupModal from "@/app/components/common/login-signup";
import Link from "next/link";
import MobileMenu from "../components/common/MobileMenu";
import Header from "../components/home/Header";

export const metadata = {
    title: "404 || minhdeptrai.site",
};

const NotFound = () => {
    return (
        <div className="wrapper">
            <Header />

            {/* Mobile Menu */}
            <MobileMenu />

            {/* Error Page */}
            <section className="our-error bgc-f9 py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-6 text-center">
                            {/* 404 Code */}
                            <div className="error_page mb-4">
                                <h1 className="display-1 fw-bold">
                                    4<span className="text-thm">0</span>4
                                </h1>
                                <h3 className="subtitle mt-3">
                                    Trang không tồn tại
                                </h3>
                                <p className="text-muted mt-2">
                                    Có thể đường dẫn bạn truy cập đã bị thay
                                    đổi, bị xóa hoặc chưa từng tồn tại.
                                </p>
                            </div>

                            {/* Suggestions */}
                            <div className="mb-4">
                                <p className="mb-2">Bạn có thể thử:</p>
                                <ul className="list-unstyled text-muted pl-[13rem] text-left">
                                    <li>- Kiểm tra lại đường dẫn URL</li>
                                    <li>- Quay về trang chủ</li>
                                    <li>- Sử dụng menu để tìm nội dung</li>
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <Link href="/" className="btn_error btn-thm">
                                    Về trang chủ
                                </Link>

                                <Link
                                    href="/contact"
                                    className="btn btn-outline-secondary flex items-center"
                                >
                                    Liên hệ hỗ trợ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

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
        </div>
    );
};

export default NotFound;
