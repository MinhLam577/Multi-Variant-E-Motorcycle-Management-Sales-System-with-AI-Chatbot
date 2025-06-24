"use client";
import Footer from "@/app/components/common/Footer";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import HeaderTop from "../../components/common/HeaderTop";
import MobileMenu from "../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import CartItems from "@/app/components/shop/cart/CartItems";
import Coupon from "@/app/components/shop/cart/Coupon";
import CartTotal from "@/app/components/shop/cart/CartTotal";
import { useStore } from "@/src/stores";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Empty } from "antd";
// export const metadata = {
//   title: "Cart || hongson ",
// };

const Cart = observer(() => {
    const [selectedAllItems, setSelectedAllItems] = useState(false); // Thêm state để lưu các sản phẩm đã chọn
    const { cartObservable } = useStore();
    // selectedItems
    //const [selectedItems, setSelectedItems] = useState([]); // Thêm state để lưu các sản phẩm đã chọn
    useEffect(() => {
        cartObservable.getListCart();
    }, []);

    const handleCheckedAll = () => {
        if (selectedAllItems) {
            // Đang chọn hết => Bỏ chọn hết
            cartObservable.setSelectedItems([]);
            setSelectedAllItems(false);
        } else {
            // Đang chưa chọn hết => Chọn tất cả
            const allIds = cartObservable?.data?.map((item) => item.id) || [];
            cartObservable.setSelectedItems(allIds);
            setSelectedAllItems(true);
        }
    };
    if (!cartObservable?.data) {
        return null; // Hoặc <div>Loading...</div> nếu bạn thích
    }

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

            {/* Inner Page Breadcrumb */}
            <section className="inner_page_breadcrumb style2 bgc-f9">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="breadcrumb_content style2">
                                <h2 className="breadcrumb_title">Shop Cart</h2>

                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="#">Home</a>
                                    </li>
                                    <li
                                        className="breadcrumb-item active"
                                        aria-current="page"
                                    >
                                        Cart
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Inner Page Breadcrumb */}

            {/* Shop cart Content */}
            <section className="shop-cart bgc-f9 pt0">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-8 col-xl-9">
                                    <div className="shopping_cart_tabs ovyh">
                                        <div className="shopping_cart_table">
                                            {cartObservable?.data.length > 0 ? (
                                                <table className="table table-responsive w-full">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="text-center"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        selectedAllItems
                                                                    }
                                                                    onChange={() =>
                                                                        handleCheckedAll()
                                                                    }
                                                                />
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="text-center text-black"
                                                            >
                                                                Sản phẩm
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="text-center text-black"
                                                            >
                                                                Đơn giá
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="text-center text-black"
                                                            >
                                                                Số lượng
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="text-center text-black"
                                                            >
                                                                Tổng tiền
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="text-center text-black"
                                                            ></th>
                                                        </tr>
                                                    </thead>

                                                    <tbody className="table_body">
                                                        <CartItems
                                                            cartListObserver={
                                                                cartObservable?.data
                                                            }
                                                            selectedItems={
                                                                cartObservable?.selectedItems
                                                            }
                                                            setSelectedAllItems={
                                                                setSelectedAllItems
                                                            }
                                                            cartObservable={
                                                                cartObservable
                                                            }
                                                        />
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="w-full flex justify-center py-10">
                                                    <Empty />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* End .shopping_cart_table */}

                                    <div className="shopping_cart_tabs">
                                        <div className="shopping_cart_table">
                                            <div className="checkout_form mt30">
                                                <div className="checkout_coupon"></div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End .shopping_cart_coupon*/}
                                </div>
                                {/* End .col-lg-8 */}

                                <div className="col-md-6 col-lg-4 col-xl-3">
                                    <CartTotal
                                        cartList={cartObservable?.data}
                                        cartObservable={cartObservable}
                                    />
                                </div>

                                {/* End .col-lg-6 */}
                            </div>
                            {/* End .row */}
                        </div>
                        {/* End .col-12 */}
                    </div>
                    {/* End .row */}
                </div>
                {/* End .container */}
            </section>
            {/* Shop Cart Content */}

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

export default Cart;
