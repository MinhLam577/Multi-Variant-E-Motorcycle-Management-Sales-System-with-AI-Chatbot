"use client";
import DefaultHeader from "@/app/components/common/DefaultHeader";
import Footer from "@/app/components/common/Footer";
import HeaderSidebar from "@/app/components/common/HeaderSidebar";
import HeaderTop from "@/app/components/common/HeaderTop";
import LoginSignupModal from "@/app/components/common/login-signup";
import Map from "@/app/components/common/Map";
import MobileMenu from "@/app/components/common/MobileMenu";
import BreadCrumb from "@/app/components/listing/listing-single/BreadCrumb";
import DescriptionsMotor from "@/app/components/listing/listing-single/DescriptionsMotor";
import ProductGallery from "@/app/components/listing/listing-single/listing-single-v2/ProductGallery";
import ReleatedMotor from "@/app/components/listing/listing-single/ReleatedMotor";
import { useStore } from "@/src/stores";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// export const metadata = {
//   title: "Listing Single V2 || hongson",
// };
import { observer } from "mobx-react-lite";
import { message } from "antd";
import OptionSelector from "@/app/components/listing/listing-single/listing-single-v2/Select_OptionValue";
import QuantityExceedModal from "@/app/components/modal/modal.quantity.Cart_DetailProduct";
const ListingSingleV2 = observer(() => {
    const [sku, setSku] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptionValueId, setSelectedOptionValueId] = useState(null);
    const [selectedPayload, setSelectedPayload] = useState(null);

    // mobx
    const store = useStore();
    const storeAccount = store.accountObservable;
    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };
    // kiểm tra chọn đủ thuộc tính giá trị chưa
    const [allSelected, setAllSelected] = useState(false);
    const { cartObservable } = useStore();
    const router = useRouter();
    const handleQuantityChange = (e) => {
        const value = e.target.value;

        // Cho phép người dùng xoá hết (rỗng) => không bị NaN
        const remaining = sku?.quantity_remaining || 100;

        if (value === "") {
            setQuantity("");
            return;
        }

        const num = parseInt(value);
        if (!isNaN(num) && num > 0 && num <= remaining) {
            setQuantity(num);
        } else if (num > remaining) {
            setQuantity(remaining);
        }
    };

    const increaseQuantity = () => {
        const remaining = sku?.quantity_remaining;
        setQuantity((prev) => (prev < remaining ? prev + 1 : prev));
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };
    const handleAddCart = async () => {
        if (
            sku &&
            allSelected &&
            (quantity + storeProduct?.data?.dataSKU?.cart_item?.[0]?.quantity ||
                0) <= sku?.quantity_remaining
        ) {
            const body = {
                cart_item: {
                    quantity: quantity,
                    sku_id: sku.id,
                },
            };
            await cartObservable.PostCart_ByBuyNow(body);
            await storeProduct.GetSkusByOptionValueIdsAlreadyLogin({
                optionValues: selectedPayload,
            });
            if (
                cartObservable.successMsg ==
                "Thêm sản phẩm vào giỏ hàng thành công"
            ) {
                message.success(cartObservable.successMsg);
            }
        } else if (
            (sku &&
                allSelected &&
                quantity +
                    storeProduct?.data?.dataSKU?.cart_item?.[0]?.quantity) ||
            0 > sku?.quantity_remaining
        ) {
            showModal();
        } else {
            message.error("Vui lòng chọn phân loại hàng");
        }
    };
    const handleAddCart_BuyNow = async () => {
        if (
            sku &&
            allSelected &&
            (quantity + storeProduct?.data?.dataSKU?.cart_item?.[0]?.quantity ||
                0) <= sku?.quantity_remaining
        ) {
            const body = {
                cart_item: {
                    quantity: quantity,
                    sku_id: sku.id,
                },
            };
            await cartObservable.PostCart_ByBuyNow(body);
            await storeProduct.GetSkusByOptionValueIdsAlreadyLogin({
                optionValues: selectedPayload,
            });

            if (
                cartObservable.successMsg ==
                "Thêm sản phẩm vào giỏ hàng thành công"
            ) {
                message.success(cartObservable.successMsg);
                router.push("/cart"); // Chuyển hướng tới trang thanh toán
            }
        } else if (
            (sku &&
                allSelected &&
                quantity +
                    storeProduct?.data?.dataSKU?.cart_item?.[0]?.quantity) ||
            0 > sku?.quantity_remaining
        ) {
            showModal();
        } else {
            message.error("Vui lòng chọn phân loại hàng");
        }
    };
    const params = useParams();
    const id = params?.id;
    const storeProduct = store.productObservable;
    useEffect(() => {
        const fetchData = async () => {
            if (id && typeof id === "string") {
                try {
                    await storeProduct.getDetailProductByID(id);
                    await storeAccount.getAccount();
                } catch (error) {
                    console.error("Fetch failed:", error);
                }
            }
        };

        fetchData();
    }, [id]);
    const handleOptionSelect = async (payload) => {
        // Validate dữ liệu
        if (!Array.isArray(payload) || payload.length === 0) {
            console.warn("Dữ liệu không hợp lệ:", payload);
            return;
        }
        // 👉 Lưu payload vào state
        setSelectedPayload(payload);
        try {
            const idCustomer = storeAccount.account?.userId;
            if (idCustomer) {
                // ✅ Gửi đúng định dạng backend yêu cầu: { optionValues: [...] }
                await storeProduct.GetSkusByOptionValueIdsAlreadyLogin({
                    optionValues: payload,
                });

                // ✅ Cập nhật kết quả nếu có
                setSku(storeProduct?.data?.dataSKU);
            } else {
                // ✅ Gửi đúng định dạng backend yêu cầu: { optionValues: [...] }
                await storeProduct.GetSkusByOptionValueIdsNoneLogin({
                    optionValues: payload,
                });
                // ✅ Cập nhật kết quả nếu có
                setSku(storeProduct?.data?.dataSKU);
            }
        } catch (err) {
            console.error("Lỗi khi tìm SKU:", err);
        }
    };
    // };
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
            <section className="our-agent-single bgc-f9 pb90 mt70-992 pt30">
                <div className="container">
                    <div className="row mb30">
                        <div className="col-xl-12">
                            <div className="breadcrumb_content style2">
                                <BreadCrumb />
                            </div>
                        </div>
                    </div>
                    {/* End .row bradcrumb */}

                    <div className="row mb-10">
                        <div className="col-lg-7 col-xl-8">
                            <div className="single_page_heading_content">
                                <div className="car_single_content_wrapper">
                                    <h2 className="title">Xe máy điện</h2>

                                    <p className="para"></p>
                                </div>
                            </div>
                        </div>
                        {/* End .col-lg-7 */}

                        <div className="col-lg-5 col-xl-5">
                            <div className="single_page_heading_content text-start text-lg-end">
                                <div className="price_content"></div>
                            </div>
                        </div>
                        {/* End col-lg-5 */}
                    </div>
                    {/* End .row */}

                    <div className="row">
                        <div className="col-lg-7 col-xl-7">
                            <ProductGallery
                                selectedOptionValueId={selectedOptionValueId}
                            />
                            {/* End Car Gallery */}

                            {/* End opening_hour_widgets */}
                            <div className="listing_single_description mt30">
                                <h4 className="mb30 font-bold">
                                    Mô tả{" "}
                                    <span className="float-end body-color fz13"></span>
                                </h4>
                                <DescriptionsMotor
                                    description={
                                        storeProduct?.data?.dataDetail?.data
                                            ?.description
                                    }
                                />
                            </div>
                            {/* End car descriptions */}
                            <div className="user_profile_location">
                                <h4 className="title">Địa điểm</h4>
                                <div className="property_sp_map mb40">
                                    <div
                                        className="h400 bdrs8 map_in"
                                        id="map-canvas"
                                    >
                                        <Map />
                                    </div>
                                </div>
                                <div className="upl_content d-block d-md-flex">
                                    <p className="float-start fn-sm mb20-sm">
                                        <span className="fas fa-map-marker-alt pr10 vam" />
                                        548 Nguyễn Hữu Thọ, Cẩm Lệ, Đà Nẵng
                                        QL1A, Hòa Phước, Hòa Vang
                                    </p>
                                    <button className="btn location_btn">
                                        Đường đi
                                    </button>
                                </div>
                            </div>
                            {/* End Location */}
                            {/* End Motor Specifications */}
                        </div>
                        <div className="col-lg-5 col-xl-5 space-y-6 text-sm text-gray-700">
                            {/* Tiêu đề */}
                            <div className="flex items-start gap-2">
                                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                                    Yêu Thích
                                </span>
                                <h1 className="text-xl font-semibold leading-tight text-gray-900">
                                    {
                                        storeProduct?.data?.dataDetail?.data
                                            ?.title
                                    }
                                </h1>
                            </div>

                            {/* Đánh giá */}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>
                                    <strong>Thương hiệu: </strong>
                                    {storeProduct?.data?.dataDetail?.data?.brand
                                        ?.name || "Không rõ"}
                                </span>
                                {sku?.masku && (
                                    <span>
                                        <strong>Mã sku:</strong> {sku?.masku}
                                    </span>
                                )}

                                <span>
                                    {`Đã Bán ${
                                        sku?.quantity_sold ||
                                        storeProduct?.data?.dataDetail?.data
                                            ?.totalSold ||
                                        0
                                    }`}{" "}
                                </span>
                            </div>

                            {/* Giá */}
                            <div className="bg-[#fff0f0] p-4 rounded-lg">
                                <div className="flex items-end gap-3 flex-wrap">
                                    <span className="text-red-500 text-2xl font-bold">
                                        ₫
                                        {Number(
                                            sku?.price_sold ||
                                                storeProduct?.data?.dataDetail
                                                    ?.data?.skus?.[0]
                                                    ?.price_sold ||
                                                0
                                        ).toLocaleString()}
                                    </span>

                                    <span className="line-through text-gray-400 text-sm">
                                        ₫
                                        {Number(
                                            sku?.price_compare ||
                                                storeProduct?.data?.dataDetail
                                                    ?.data?.skus?.[0]
                                                    ?.price_compare ||
                                                0
                                        ).toLocaleString()}
                                    </span>
                                    {(() => {
                                        const priceCompare =
                                            sku?.price_compare ||
                                            storeProduct?.data?.dataDetail?.data
                                                ?.skus?.[0]?.price_compare;
                                        const priceSold =
                                            sku?.price_sold ||
                                            storeProduct?.data?.dataDetail?.data
                                                ?.skus?.[0]?.price_sold;

                                        if (priceCompare && priceSold) {
                                            const discount = Math.round(
                                                ((+priceCompare - +priceSold) /
                                                    +priceCompare) *
                                                    100
                                            );
                                            return (
                                                <span className="text-red-500 text-sm font-medium">
                                                    -{discount}%
                                                </span>
                                            );
                                        }

                                        return null;
                                    })()}
                                </div>
                            </div>

                            {/* Mã giảm giá */}

                            {/* Chính sách */}

                            {/* Hiển thỉ biến thể : Màu sắc , kích thước */}

                            <div className="space-y-6">
                                <OptionSelector
                                    optionValues={
                                        storeProduct?.data?.optionValues
                                    }
                                    onSelectChange={handleOptionSelect}
                                    setAllSelected={setAllSelected}
                                />
                            </div>

                            {/* Số lượng */}
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 font-medium">
                                    Số Lượng
                                </span>
                                <div className="flex items-center border rounded">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="px-3 py-1 text-gray-500 hover:text-black"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="text"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className="w-12 text-center border-l border-r outline-none"
                                    />
                                    <button
                                        onClick={increaseQuantity}
                                        className="px-3 py-1 text-gray-500 hover:text-black"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-gray-500 text-sm">
                                    {sku?.quantity_remaining ||
                                        storeProduct?.data?.dataDetail?.data
                                            ?.totalStock}{" "}
                                    sản phẩm có sẵn
                                </span>
                            </div>

                            {/* Hành động */}
                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    className="bg-red-100 flex items-center border border-red-500 text-red-500 px-5 py-2 rounded-full hover:bg-red-50 transition-colors"
                                    onClick={() => handleAddCart()}
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 2.6A1 1 0 007 17h12m-5 4a1 1 0 100-2 1 1 0 000 2zm-6 0a1 1 0 100-2 1 1 0 000 2z"
                                        />
                                    </svg>
                                    Thêm Vào Giỏ Hàng
                                </button>
                                <button
                                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
                                    onClick={() => handleAddCart_BuyNow()}
                                >
                                    Mua Ngay
                                </button>
                            </div>
                        </div>

                        {/* End .col-xl-8 */}
                    </div>
                    {/* End .row */}
                </div>
                {/* End .container */}
            </section>
            {/* End Agent Single Grid View */}
            {/* Car For Rent */}
            <section className="car-for-rent bb1">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="main-title text-center text-md-start mb10-520">
                                <h2 className="title">Xe bán chạy</h2>
                            </div>
                        </div>
                        {/* End .col-sm-6 */}

                        <div className="col-sm-6">
                            <div className="text-center text-md-end mb30-520">
                                <Link
                                    href="/page-list-v1"
                                    className="more_listing"
                                >
                                    Xem thêm
                                    <span className="icon">
                                        <span className="fas fa-plus" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                        {/* End .col-sm-6 */}
                    </div>
                    {/* End .row */}

                    <div className="col-lg-12">
                        <div
                            className="home1_popular_listing home3_style"
                            data-aos-delay="100"
                        >
                            <div className="listing_item_4grid_slider nav_none">
                                <ReleatedMotor />
                            </div>
                        </div>
                    </div>
                    {/* End .col-lg-12 */}
                </div>
                {/* End .container */}
            </section>
            {/* End Car For Rent */}
            {/* Our Footer */}
            <Footer />
            {/* End Our Footer */}
            {/* Modal */}
            <div
                className="sign_up_modal modal fade"
                id="logInModal"
                data-backdrop="static"
                data-keyboard=""
                tabIndex={-1}
                aria-hidden="true"
            >
                <LoginSignupModal />
            </div>
            {/* End Modal */}
            <QuantityExceedModal
                showModal={showModal}
                handleOk={handleOk}
                setIsModalOpen={setIsModalOpen}
                isModalOpen={isModalOpen}
                quantity_Limit={
                    storeProduct?.data?.dataSKU?.cart_item[0]?.quantity || 0
                }
            />
            ;
        </div>
        // End wrapper
    );
});

export default ListingSingleV2;
// <div>
//                 <p className="font-medium mb-1">An Tâm Mua Sắm Cùng Shopee</p>
//                 <div className="flex items-center gap-2 text-sm text-gray-700">
//                   <svg
//                     className="w-4 h-4 text-red-500"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 11c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zM5 13l1 6h12l1-6M12 3l1 4H8l1-4h3z"
//                     />
//                   </svg>
//                   Trả hàng miễn phí 15 ngày · Bảo hiểm Thiệt hại sản phẩm
//                 </div>
//               </div>
// <div>
//                 <p className="font-medium mb-2">Mã Giảm Giá Của Shop</p>
//                 <div className="flex gap-2 flex-wrap">
//                   {["Giảm 10%", "Giảm ₫10k", "Giảm ₫3k", "Giảm ₫5k"].map(
//                     (item, i) => (
//                       <span
//                         key={i}
//                         className="bg-pink-100 text-red-500 px-3 py-1 rounded-full text-xs font-medium"
//                       >
//                         {item}
//                       </span>
//                     )
//                   )}
//                 </div>
//               </div>

//               {/* Combo khuyến mãi */}
//               <div>
//                 <p className="font-medium mb-1">Combo Khuyến Mãi</p>
//                 <div className="inline-block border border-red-500 text-red-500 px-3 py-1 rounded-full text-xs font-medium">
//                   Mua 2 & giảm 5%
//                 </div>
//               </div>

///

// {
//   storeProduct?.data?.resultOption_OptionValue?.map((element) => {
//     return (
//       <div>
//         <p className="font-medium mb-2">{element.name}</p>
//         <div className="flex gap-2 flex-wrap">
//           {element.option_values.map((item) => {
//             const isActive = item.id === selectedOptionValueId;
//             return (
//               <button
//                 key={item.id}
//                 className={`border px-3 py-1 rounded-full text-xs transition-colors ${
//                   isActive
//                     ? "border-red-500 text-red-500"
//                     : "hover:border-red-500 hover:text-red-500"
//                 }`}
//                 onClick={() => handleFindSku(item.id)}
//               >
//                 {item.value}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     );
//   });
// }
// <span className="text-yellow-500 font-semibold">4.7 ★</span>
// <div className="opening_hour_widgets p30 mt30">
//   <div className="wrapper">
//     <h4 className="title">Tổng quan</h4>
//     <OverviewMotor />
//   </div>
// </div>;
