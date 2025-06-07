// "use client";
// import Footer from "@/app/components/common/Footer";
// import DefaultHeader from "@/app/components/common/DefaultHeader";
// import HeaderSidebar from "@/app/components/common/HeaderSidebar";
// import HeaderTop from "@/app/components/common/HeaderTop";
// import MobileMenu from "@/app/components/common/MobileMenu";
// import LoginSignupModal from "@/app/components/common/login-signup";
// import BreadCrumb from "@/app/components/listing/listing-single/BreadCrumb";
// import ShareMeta from "../../../components/listing/listing-single/ShareMeta";
// import ProductGallery from "@/app/components/listing/listing-single/listing-single-v1/ProductGallery";
// import Overview from "@/app/components/listing/listing-single/Overview";
// import Descriptions from "@/app/components/listing/listing-single/Descriptions";
// import Features from "@/app/components/listing/listing-single/Features";
// import Map from "@/app/components/common/Map";
// import ConsumerReviews from "@/app/components/listing/listing-single/ConsumerReviews";
// import ReviewBox from "@/app/components/listing/listing-single/ReviewBox";
// import ContactSeller from "@/app/components/listing/listing-single/sidebar/ContactSeller";
// import SellerDetail from "@/app/components/listing/listing-single/sidebar/SellerDetail";
// import Link from "next/link";
// import ReleatedCar from "@/app/components/listing/listing-single/ReleatedCar";
// import { toCurrency } from "@/utils";

// // export const metadata = {
// //   title: "Ô Tô Hồng Sơn || Chuyên mua bán và trao đổi xe ô tô uy tín",
// //   description: `Ô Tô Hồng Sơn cung cấp đa dạng dòng xe với giá tốt nhất, hỗ trợ tài chính linh hoạt và được tin cậy bởi hàng ngàn khách hàng.`,
// // };

// const ListingSingleV1 = () => {
//   return (
//     <div className="wrapper">
//       <div
//         className="offcanvas offcanvas-end"
//         tabIndex="-1"
//         id="offcanvasRight"
//         aria-labelledby="offcanvasRightLabel"
//       >
//         <HeaderSidebar />
//       </div>
//       {/* Sidebar Panel End */}

//       {/* Main Header Nav */}
//       <DefaultHeader />
//       {/* End Main Header Nav */}

//       {/* Main Header Nav For Mobile */}
//       <MobileMenu />
//       {/* End Main Header Nav For Mobile */}

//       {/* Agent Single Grid View */}
//       <section className="our-agent-single bgc-f9 pb90 mt70-992 pt30">
//         <div className="container">
//           <div className="row mb30">
//             <div className="col-xl-12">
//               <div className="breadcrumb_content style2">
//                 <BreadCrumb />
//               </div>
//             </div>
//           </div>
//           {/* End .row bradcrumb */}

//           <div className="row mb30">
//             <div className="col-lg-7 col-xl-8">
//               <div className="single_page_heading_content">
//                 <div className="car_single_content_wrapper">
//                   <ul className="car_info mb20-md">
//                     <li className="list-inline-item">
//                       <a href="#">MỚI</a>
//                     </li>
//                     <li className="list-inline-item">
//                       <a href="#">
//                         <span className="flaticon-clock-1 vam" /> 1 ngày trước
//                       </a>
//                     </li>
//                     <li className="list-inline-item">
//                       <a href="#">
//                         <span className="flaticon-eye vam" />
//                         13102
//                       </a>
//                     </li>
//                   </ul>
//                   <h2 className="title">GAZ SOBOL 11 CHỖ NGỒI</h2>
//                   <p className="para">Thương hiệu: GAZ Loại: Xe Khách </p>
//                 </div>
//               </div>
//             </div>
//             {/* End .col-lg-7 */}

//             <div className="col-lg-5 col-xl-4">
//               <div className="single_page_heading_content text-start text-lg-end">
//                 <div className="price_content">
//                   <div className="price mt60 mb10 mt10-md">
//                     <h3>{toCurrency(null)}</h3>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* End col-lg-5 */}
//           </div>
//           {/* End .row */}

//           <div className="row">
//             <div className="col-lg-8 col-xl-8">
//               <ProductGallery />
//               {/* End Car Gallery */}
//               <div className="opening_hour_widgets p30 mt30">
//                 <div className="wrapper">
//                   <div className="nav nav-tabs col-lg-12" role="tablist">
//                     <button
//                       className="nav-link"
//                       id="nav-description-tab"
//                       data-bs-toggle="tab"
//                       data-bs-target="#nav-description"
//                       role="tab"
//                       aria-controls="nav-description"
//                       aria-selected="true"
//                     >
//                       Mô tả
//                     </button>
//                     <button
//                       className="nav-link active"
//                       id="nav-overview-tab"
//                       data-bs-toggle="tab"
//                       data-bs-target="#nav-overview"
//                       role="tab"
//                       aria-controls="nav-overview"
//                       aria-selected="false"
//                     >
//                       Tổng quan
//                     </button>
//                     <button
//                       className="nav-link"
//                       id="nav-features-tab"
//                       data-bs-toggle="tab"
//                       data-bs-target="#nav-features"
//                       role="tab"
//                       aria-controls="nav-features"
//                       aria-selected="false"
//                     >
//                       Chức năng
//                     </button>
//                     <button
//                       className="nav-link"
//                       id="nav-location-tab"
//                       data-bs-toggle="tab"
//                       data-bs-target="#nav-location"
//                       role="tab"
//                       aria-controls="nav-location"
//                       aria-selected="false"
//                     >
//                       Địa điểm
//                     </button>
//                     <button
//                       className="nav-link"
//                       id="nav-review-tab"
//                       data-bs-toggle="tab"
//                       data-bs-target="#nav-review"
//                       role="tab"
//                       aria-controls="nav-review"
//                       aria-selected="false"
//                     >
//                       Đánh giá
//                     </button>
//                   </div>
//                   {/* Tab panes */}
//                   <div className="tab-content col-lg-12" id="nav-tabContent">
//                     <div
//                       className="tab-pane fade"
//                       id="nav-description"
//                       role="tabpanel"
//                       aria-labelledby="nav-description-tab"
//                     >
//                       <div className="listing_single_description bdr_none pl0 pr0">
//                         <h4 className="mb30">
//                           Mô tả{" "}
//                           <span className="float-end body-color fz13">
//                             ID #9535
//                           </span>
//                         </h4>
//                         <Descriptions />
//                       </div>
//                       {/* End car descriptions */}
//                     </div>
//                     {/* End description tabcontent */}

//                     <div
//                       className="tab-pane fade show active"
//                       id="nav-overview"
//                       role="tabpanel"
//                       aria-labelledby="nav-overview-tab"
//                     >
//                       <div className="opening_hour_widgets p30 bdr_none pl0 pr0">
//                         <div className="wrapper">
//                           <h4 className="title">Tổng quan</h4>
//                           <Overview />
//                         </div>
//                       </div>
//                       {/* End opening_hour_widgets */}
//                     </div>
//                     {/* End overview tabcontent */}

//                     <div
//                       className="tab-pane fade"
//                       id="nav-features"
//                       role="tabpanel"
//                       aria-labelledby="nav-features-tab"
//                     >
//                       <div className="user_profile_service bdr_none pl0 pr0">
//                         <Features />
//                         <hr />
//                         <div className="row">
//                           <div className="col-lg-12">
//                             <a className="fz12 tdu color-blue" href="#">
//                               Xem tất cả
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                       {/* End user profile service */}
//                     </div>
//                     {/* End user profile service tabcontent */}

//                     <div
//                       className="tab-pane fade"
//                       id="nav-location"
//                       role="tabpanel"
//                       aria-labelledby="nav-location-tab"
//                     >
//                       <div className="user_profile_location bdr_none pl0 pr0">
//                         <h4 className="title">Địa điểm</h4>
//                         <div className="property_sp_map mb40">
//                           <div className="h400 bdrs8 map_in" id="map-canvas">
//                             <Map />
//                           </div>
//                         </div>
//                         <div className="upl_content d-block d-md-flex">
//                           <p className="float-start fn-sm mb20-sm">
//                             <span className="fas fa-map-marker-alt pr10 vam" />
//                             548 Nguyễn Hữu Thọ, Cẩm Lệ, Đà Nẵng QL1A, Hòa Phước,
//                             Hòa
//                           </p>
//                           <button className="btn location_btn">Đường đi</button>
//                         </div>
//                       </div>
//                       {/* End Location */}
//                     </div>
//                     {/* End location tab content */}
//                   </div>
//                 </div>
//               </div>
//               {/* End Location */}
//             </div>
//             {/* End .col-xl-8 */}

//             <div className="col-lg-4 col-xl-4">
//               <h4 className="mb30 mt30">Màu</h4>
//               <div className="offer_btns">
//                 {[
//                   { name: "Tím", hex: "#4B0082" },
//                   { name: "Cam", hex: "#FFA07A" },
//                   { name: "Hồng", hex: "#FF6347" },
//                   { name: "Nâu", hex: "#D2B48C" },
//                   { name: "Xám", hex: "#808080" },
//                   { name: "Bạc", hex: "#B1B1B1" },
//                 ].map((color) => (
//                   <button
//                     key={color.name}
//                     className="btn btn-thm ofr_btn1 btn-block mt0 mb20 color_btns"
//                     style={{ backgroundColor: color.hex }}
//                   >
//                     {color.name}
//                   </button>
//                 ))}
//               </div>
//               <div className="offer_btns">
//                 <div className="text-end">
//                   <button className="btn btn-thm ofr_btn1 btn-block mt0 mb20">
//                     <span className="flaticon-coin mr10 fz18 vam" />
//                     Nhận báo giá
//                   </button>
//                 </div>
//               </div>
//               {/* End offer_btn
//                */}
//               <div className="sidebar_seller_contact">
//                 <SellerDetail />
//                 <h4 className="mb30">Liên hệ</h4>
//                 <ContactSeller />
//               </div>

//               {/* End .col-xl-4 */}
//             </div>
//           </div>
//           {/* End .row */}
//         </div>
//         {/* End .container */}
//       </section>
//       {/* End Agent Single Grid View */}

//       {/* Car For Rent */}
//       <section className="car-for-rent bb1">
//         <div className="container">
//           <div className="row">
//             <div className="col-sm-6">
//               <div className="main-title text-center text-md-start mb10-520">
//                 <h2 className="title">Xe bán chạy</h2>
//               </div>
//             </div>
//             {/* End .col-sm-6 */}

//             <div className="col-sm-6">
//               <div className="text-center text-md-end mb30-520">
//                 <Link href="/page-list-v1" className="more_listing">
//                   Xem thêm
//                   <span className="icon">
//                     <span className="fas fa-plus" />
//                   </span>
//                 </Link>
//               </div>
//             </div>
//             {/* End .col-sm-6 */}
//           </div>
//           {/* End .row */}

//           <div className="col-lg-12">
//             <div
//               className="home1_popular_listing home3_style"
//               data-aos-delay="100"
//             >
//               <div className="listing_item_4grid_slider nav_none">
//                 <ReleatedCar />
//               </div>
//             </div>
//           </div>
//           {/* End .col-lg-12 */}
//         </div>
//         {/* End .container */}
//       </section>
//       {/* End Car For Rent */}

//       {/* Our Footer */}
//       <Footer />
//       {/* End Our Footer */}

//       {/* Modal */}
//       <div
//         className="sign_up_modal modal fade"
//         id="logInModal"
//         data-backdrop="static"
//         data-keyboard=""
//         tabIndex={-1}
//         aria-hidden="true"
//       >
//         <LoginSignupModal />
//       </div>
//       {/* End Modal */}
//     </div>
//     // End wrapper
//   );
// };

// export default ListingSingleV1;

import ListingSingle from "@/app/components/listing/listing-single/listing-single-v1/page";
export const metadata = {
    title: "Ô Tô Hồng Sơn",
    description: `Ô Tô Hồng Sơn cung cấp đa dạng dòng xe với giá tốt nhất, hỗ trợ tài chính linh hoạt và được tin cậy bởi hàng ngàn khách hàng.`,
};

const ListingSingleV1 = () => {
    return (
        <ListingSingle />
        // End wrapper
    );
};

export default ListingSingleV1;
