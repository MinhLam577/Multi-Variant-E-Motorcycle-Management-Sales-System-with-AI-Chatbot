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
import OverviewMotor from "@/app/components/listing/listing-single/OverviewMotor";
import ReleatedMotor from "@/app/components/listing/listing-single/ReleatedMotor";
import { toCurrency } from "@/utils";
import Link from "next/link";

export const metadata = {
  title: "Listing Single V2 || hongson",
};

const ListingSingleV2 = () => {
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

          <div className="row mb30">
            <div className="col-lg-7 col-xl-8">
              <div className="single_page_heading_content">
                <div className="car_single_content_wrapper">
                  <ul className="car_info mb20-md">
                    <li className="list-inline-item">
                      <a href="#">MỚI</a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">
                        <span className="flaticon-clock-1 vam" /> 1 ngày trước
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">
                        <span className="flaticon-eye vam" />
                        13102
                      </a>
                    </li>
                  </ul>
                  <h2 className="title">Xe máy điện</h2>
                  <p className="para"></p>
                </div>
              </div>
            </div>
            {/* End .col-lg-7 */}

            <div className="col-lg-5 col-xl-4">
              <div className="single_page_heading_content text-start text-lg-end">
                <div className="price_content">
                  <div className="price mt60 mb10 mt10-md">
                    <h3>{toCurrency(100000000)}</h3>
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
                  <h4 className="title">Tổng quan</h4>
                  <OverviewMotor />
                </div>
              </div>
              {/* End opening_hour_widgets */}

              <div className="listing_single_description mt30">
                <h4 className="mb30">
                  Mô tả{" "}
                  <span className="float-end body-color fz13">ID #9535</span>
                </h4>
                <DescriptionsMotor />
              </div>
              {/* End car descriptions */}

              <div className="user_profile_location">
                <h4 className="title">Địa điểm</h4>
                <div className="property_sp_map mb40">
                  <div className="h400 bdrs8 map_in" id="map-canvas">
                    <Map />
                  </div>
                </div>
                <div className="upl_content d-block d-md-flex">
                  <p className="float-start fn-sm mb20-sm">
                    <span className="fas fa-map-marker-alt pr10 vam" />
                    548 Nguyễn Hữu Thọ, Cẩm Lệ, Đà Nẵng QL1A, Hòa Phước, Hòa
                    Vang
                  </p>
                  <button className="btn location_btn">Đường đi</button>
                </div>
              </div>
              {/* End Location */}

              {/* End Motor Specifications */}
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
                <Link href="/page-list-v1" className="more_listing">
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
    </div>
    // End wrapper
  );
};

export default ListingSingleV2;
