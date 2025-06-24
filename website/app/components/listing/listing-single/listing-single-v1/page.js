"use client";

import DefaultHeader from "@/app/components/common/DefaultHeader";
import HeaderSidebar from "@/app/components/common/HeaderSidebar";
import MobileMenu from "@/app/components/common/MobileMenu";
import { toCurrency } from "@/utils";
import BreadCrumb from "../BreadCrumb";
import ProductGallery from "./ProductGallery";
import { Descriptions } from "antd";
import Features from "../Features";
import Map from "@/app/components/common/Map";
import SellerDetail from "../sidebar/SellerDetail";
import ContactSeller from "../sidebar/ContactSeller";
import Link from "next/link";
import ReleatedCar from "../ReleatedCar";
import { Footer } from "antd/es/layout/layout";
import LoginSignupModal from "@/app/components/common/login-signup";
import { useStore } from "@/src/stores";
import React, { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { observer } from "mobx-react-lite";
import OptionSelector from "../listing-single-v2/Select_OptionValue";
const ListingSingle = observer(() => {
  const [sku, setSku] = useState(null);
  const [selectedOptionValueId, setSelectedOptionValueId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const params = useParams();
  const store = useStore();
  const id = params?.id;
  const storeProduct = store.productObservable;
  // kiểm tra chọn đủ thuộc tính giá trị chưa
  const [allSelected, setAllSelected] = useState(false);

  // mobx
  const storeAccount = store.accountObservable;

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

  const handleFindSku = async (idItem) => {
    setSelectedOptionValueId(idItem);
    await storeProduct.getDetailSKU_ByOptionValue(idItem);
    setSku(storeProduct?.data.dataSKU);
  };

  const handleOptionSelect = async (payload) => {
    console.log("Payload FE:", payload);

    // Validate dữ liệu
    if (!Array.isArray(payload) || payload.length === 0) {
      console.warn("Dữ liệu không hợp lệ:", payload);
      return;
    }
    // 👉 Lưu payload vào state

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
        //  console.log(storeProduct?.data?.dataSKU?.cart_item[0]?.quantity);
      }
    } catch (err) {
      console.error("Lỗi khi tìm SKU:", err);
    }
  };

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

          <div className="row mb30">
            <div className="col-lg-7 col-xl-8">
              <div className="single_page_heading_content">
                <div className="car_single_content_wrapper">
                  {/*<ul className="car_info mb20-md">
                                        <li className="list-inline-item">
                                            <a href="#">MỚI</a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#">
                                                <span className="flaticon-clock-1 vam" />{" "}
                                                1 ngày trước
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#">
                                                <span className="flaticon-eye vam" />
                                                13102
                                            </a>
                                        </li>
                                    </ul>*/}
                  <h2 className="title">
                    {storeProduct.data.dataDetail.data.title}
                  </h2>
                  <p className="para">
                    Thương hiệu:{" "}
                    {storeProduct?.data.dataDetail.data.brand?.name}
                  </p>
                </div>
              </div>
            </div>
            {/* End .col-lg-7 */}

            <div className="col-lg-5 col-xl-4">
              <div className="single_page_heading_content text-start text-lg-end">
                <div className="price_content">
                  <div className="price mt-4 mb-4 ">
                    <h3>{toCurrency(null)}</h3>
                  </div>
                </div>
              </div>
            </div>
            {/* End col-lg-5 */}
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-8 col-xl-8">
              <ProductGallery />
              {/* End Car Gallery */}
              <div className="opening_hour_widgets p30 mt30">
                <div className="wrapper">
                  <div className="nav nav-tabs col-lg-12" role="tablist">
                    <button
                      className="nav-link active"
                      id="nav-description-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-description"
                      role="tab"
                      aria-controls="nav-description"
                      aria-selected="true"
                    >
                      Mô tả
                    </button>

                    {/* <button
                      className="nav-link active"
                      //   id="nav-overview-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-overview"
                      role="tab"
                      aria-controls="nav-overview"
                      aria-selected="true"
                    >
                      Tổng quan
                    </button> */}
                    {/* <button
                      className="nav-link"
                      id="nav-features-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-features"
                      role="tab"
                      aria-controls="nav-features"
                      aria-selected="false"
                    >
                      Chức năng
                    </button> */}
                    <button
                      className="nav-link"
                      id="nav-location-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-location"
                      role="tab"
                      aria-controls="nav-location"
                      aria-selected="false"
                    >
                      Địa điểm
                    </button>
                    <button
                      className="nav-link"
                      id="nav-review-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-review"
                      role="tab"
                      aria-controls="nav-review"
                      aria-selected="false"
                    >
                      Đánh giá
                    </button>
                  </div>
                  {/* Tab panes */}
                  <div className="tab-content col-lg-12" id="nav-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="nav-description"
                      role="tabpanel"
                      aria-labelledby="nav-description-tab"
                    >
                      <div className="listing_single_description bdr_none pl0 pr0">
                        <div
                          className="mb6 text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html:
                              storeProduct?.data?.dataDetail?.data
                                .description || "",
                          }}
                        />

                        {/* <span className="float-end body-color fz13">
                            ID #9535
                          </span> */}

                        <Descriptions />
                      </div>
                      {/* End car descriptions */}
                    </div>
                    {/* End description tabcontent */}

                    {/* <div
                      className="tab-pane fade "
                      id="nav-overview"
                      role="tabpanel"
                      aria-labelledby="nav-overview-tab"
                    >
                      <div className="opening_hour_widgets p30 bdr_none pl0 pr0">
                        <div className="wrapper">
                          <h4 className="title">Tổng quan</h4>
                          <Overview
                            specifications={
                              storeProduct?.data?.dataDetail?.data
                                .specifications
                            }
                          />
                        </div>
                      </div>
                      {/* End opening_hour_widgets */}
                    {/* </div> */}
                    {/* End overview tabcontent */}

                    <div
                      className="tab-pane fade"
                      id="nav-features"
                      role="tabpanel"
                      aria-labelledby="nav-features-tab"
                    >
                      <div className="user_profile_service bdr_none pl0 pr0">
                        <Features />
                        <hr />
                        <div className="row">
                          <div className="col-lg-12">
                            <a className="fz12 tdu color-blue" href="#">
                              Xem tất cả
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* End user profile service */}
                    </div>
                    {/* End user profile service tabcontent */}

                    <div
                      className="tab-pane fade"
                      id="nav-location"
                      role="tabpanel"
                      aria-labelledby="nav-location-tab"
                    >
                      <div className="user_profile_location bdr_none pl0 pr0">
                        <h4 className="title">Địa điểm</h4>
                        <div className="property_sp_map mb40">
                          <div className="h400 bdrs8 map_in" id="map-canvas">
                            <Map />
                          </div>
                        </div>
                        <div className="upl_content d-block d-md-flex">
                          <p className="float-start fn-sm mb20-sm">
                            <span className="fas fa-map-marker-alt pr10 vam" />
                            548 Nguyễn Hữu Thọ, Cẩm Lệ, Đà Nẵng QL1A, Hòa Phước,
                            Hòa
                          </p>
                          <button className="btn location_btn">Đường đi</button>
                        </div>
                      </div>
                      {/* End Location */}
                    </div>
                    {/* End location tab content */}
                  </div>
                </div>
              </div>
              {/* End Location */}
            </div>
            {/* End .col-xl-8 */}

            <div className="col-lg-4 col-xl-4">
              {/* Giá */}
              <div className="bg-[#fff0f0] p-4 rounded-lg">
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="text-red-500 text-2xl font-bold">
                    ₫
                    {Number(
                      sku?.price_sold ||
                        storeProduct?.data?.dataDetail?.data?.skus?.[0]
                          ?.price_sold ||
                        0
                    ).toLocaleString()}
                  </span>

                  <span className="line-through text-gray-400 text-sm">
                    ₫
                    {Number(
                      sku?.price_compare ||
                        storeProduct?.data?.dataDetail?.data?.skus?.[0]
                          ?.price_compare ||
                        0
                    ).toLocaleString()}
                  </span>
                  {(() => {
                    const priceCompare =
                      sku?.price_compare ||
                      storeProduct?.data?.dataDetail?.data?.skus?.[0]
                        ?.price_compare;
                    const priceSold =
                      sku?.price_sold ||
                      storeProduct?.data?.dataDetail?.data?.skus?.[0]
                        ?.price_sold;

                    if (priceCompare && priceSold) {
                      const discount = Math.round(
                        ((+priceCompare - +priceSold) / +priceCompare) * 100
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
              {/* {storeProduct?.data?.resultOption_OptionValue?.map(
                (element: ConvertSkusOptionValue_UI, index) => (
                  <React.Fragment key={element.id || index}>
                    <h4 className="mb30 mt30">{element.name}</h4>
                    <div className="offer_btns">
                      {element.option_values.map((item) => {
                        const isActive = item.id === selectedOptionValueId;
                        return (
                          <button
                            key={item.id}
                            className={`btn  ofr_btn1 mt0 mb20  border px-3 py-1 rounded-full text-xs transition-colors ${
                              isActive
                                ? "border-red-500 text-red-500"
                                : "hover:border-red-500 hover:text-red-500"
                            }`}
                            onClick={() => handleFindSku(item.id)}
                          >
                            {item.value}
                          </button>
                        );
                      })}
                    </div>
                  </React.Fragment>
                )
              )} */}

              <div className="space-y-6 my-3">
                <OptionSelector
                  optionValues={storeProduct?.data?.optionValues}
                  onSelectChange={handleOptionSelect}
                  setAllSelected={setAllSelected}
                />
              </div>

              <div className="offer_btns">
                <div className="text-end">
                  <button
                    className=" btn btn-thm ofr_btn1 btn-block mt0 mb20"
                    onClick={() => setShowModal(true)}
                  >
                    <span className="flaticon-coin mr10 fz18 vam" />
                    Nhận báo giá
                  </button>
                </div>
                <div className="col-md-12">
                  <div className="flex flex-wrap justify-between gap-3">
                    <button className="flex-1 max-w-[48%] btn btn-thm ofr_btn1 mt0 mb20">
                      Gửi tin nhắn
                    </button>

                    <a
                      href="zalo://oa/show?oid=0973470778"
                      className="flex-1 max-w-[48%] btn btn-thm ofr_btn1 mt0 mb20 text-white text-center flex items-center justify-center"
                    >
                      <span className="flaticon-whatsapp mr2" />
                      Gọi ngay 0973470778
                    </a>
                  </div>
                </div>
              </div>
              {/* End offer_btn
               */}
              <div className="sidebar_seller_contact">
                <SellerDetail />
                {/* <h4 className="mb30">Liên hệ</h4> */}
                {showModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                      {/* Nút Đóng */}
                      <button
                        onClick={() => setShowModal(false)}
                        className="absolute top-5 right-3 text-gray-500 hover:text-black text-2xl"
                      >
                        &times;
                      </button>
                      <h2 className="text-xl font-semibold mb-4">
                        Thông tin báo giá
                      </h2>

                      <ContactSeller setShowModal={setShowModal} />
                    </div>
                  </div>
                )}
              </div>

              {/* End .col-xl-4 */}
            </div>
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
                <Link href={`/listing-v1?type=car&sort_by=updatedAtDesc&current=1&pageSize=10`} className="more_listing">
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
                <ReleatedCar />
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
    </div>
    // End wrapper
  );
});

export default ListingSingle;
// className={`btn btn-thm ofr_btn1 btn-block mt0 mb20 color_btns border-red-500 text-red-500 ${
//   isActive
//     ? "border-red-500 text-red-500"
//     : "hover:border-red-500 hover:text-red-500"
// }`}
