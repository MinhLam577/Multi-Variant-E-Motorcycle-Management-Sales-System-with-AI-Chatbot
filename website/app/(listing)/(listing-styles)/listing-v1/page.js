"use client";
import Footer from "@/app/components/common/Footer";
import DefaultHeader from "@/app/components/common/DefaultHeader";
import HeaderSidebar from "@/app/components/common/HeaderSidebar";
import HeaderTop from "@/app/components/common/HeaderTop";
import MobileMenu from "@/app/components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import AdvanceFilter from "@/app/components/listing/advance-filter";
import Pagination from "@/app/components/common/Pagination";
import ListGridFilter from "@/app/components/listing/ListGridFilter";
import CarItems from "@/app/components/listing/listing-styles/listing-v1/CarItems";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Dùng useSearchParams trong App Router
import { useStore } from "@/src/stores";
// export const metadata = {
//   title: "Listing V1 || hongson ",
// };

const ListingV1 = () => {
  const searchParams = useSearchParams(); // Lấy searchParams từ URL
  const [data, setData] = useState([]);
  const [queryObject, setQueryObject] = useState({});
  const store = useStore();
  const storeProduct = store.productObservable;
  // Lắng nghe sự thay đổi của query params và gọi API

  useEffect(() => {
    // Chuyển đổi searchParams thành đối tượng
    const queryObject = Object.fromEntries(searchParams.entries());

    // Thêm giá trị mặc định cho current và pageSize nếu không có
    const updatedQueryObject = {
      ...queryObject,
      current: queryObject.current || 1, // Giá trị mặc định cho current
      pageSize: queryObject.pageSize || 10, // Giá trị mặc định cho pageSize
    };

    setQueryObject(updatedQueryObject); // Cập nhật đối tượng query

    // Gọi API với các tham số trong query
    const params = new URLSearchParams(updatedQueryObject).toString();
    fetchData(params); // Gọi API với các tham số trong URL
    console.log("re-render ");
  }, [searchParams]); // Chạy lại khi searchParams thay đổi

  // Function gọi API
  const fetchData = async (params) => {
    try {
      console.log("Fetching data with params:", params);
      await storeProduct.getListProduct(params, "Xe hơi");
      setData(storeProduct?.data?.cars?.data || []);
      // Xe hơi
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Cập nhật URL khi người dùng thay đổi lựa chọn
  const updateUrl = (newParams) => {
    const newQueryParams = new URLSearchParams(newParams);
    window.history.replaceState(null, "", `?${newQueryParams.toString()}`); // Thay đổi URL mà không reload
  };

  // Hàm xử lý khi người dùng thay đổi lựa chọn
  const handleFilterChange = (query) => {
    const updatedParams = {
      ...queryObject,
      ...query, // thêm hoặc ghi đè với query mới
    };
    updateUrl(updatedParams); // Cập nhật URL và gọi API tự động
  };
  const handleClearAllFilters = () => {
    const clearedParams = {}; // hoặc giữ lại mặc định như { page: 1 } nếu muốn
    updateUrl(clearedParams);
  };

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

      {/* End header top */}

      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Main Header Nav For Mobile */}
      <MobileMenu />
      {/* End Main Header Nav For Mobile */}

      {/* Advance_search_menu_sectn*/}
      <section className="advance_search_menu_sectn bgc-thm2 pt20 pb0 mt70-992 filter-style_two">
        <div className="container">
          <AdvanceFilter
            handleFilterChange={handleFilterChange}
            handleClearAllFilters={handleClearAllFilters}
          />
        </div>
      </section>
      {/* End Advance_search_menu_sectn*/}

      {/* Inner Page Breadcrumb */}
      <section className="inner_page_breadcrumb style2 inner_page_section_spacing">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb_content style2">
                <h2 className="breadcrumb_title">Xe ôtô</h2>
                <ol className="breadcrumb fn-sm mt15-sm">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Danh sách
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Inner Page Breadcrumb */}

      {/* Listing Grid View */}
      <section className="our-listing pt0 bgc-f9 pb30-991">
        <div className="container">
          <div className="row">
            <ListGridFilter data={storeProduct?.data?.cars?.data || []} />
          </div>
          {/* End .row */}

          <div className="row">
            <CarItems data={storeProduct?.data?.cars?.data || []} />
          </div>
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12">
              <div className="mbp_pagination mt10">
                <Pagination queryObject={queryObject} />
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* Listing Grid View */}

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

export default ListingV1;
