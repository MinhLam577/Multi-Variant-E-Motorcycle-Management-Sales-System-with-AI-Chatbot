"use client";
import Footer from "@/app/components/common/Footer";
import DefaultHeader from "@/app/components/common/DefaultHeader";
import HeaderSidebar from "@/app/components/common/HeaderSidebar";
import HeaderTop from "@/app/components/common/HeaderTop";
import MobileMenu from "@/app/components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import AdvanceFilter from "@/app/components/listing/advance-filter";
import Map from "@/app/components/common/Map";
import { EnumProductStore } from "@/src/stores/productStore";

// export const metadata = {
//     title: "minhdeptrai.site ",
// };

const ListingMapV1 = () => {
    const handleClearAllFilters = async () => {};
    const handleFilterChange = async () => {};
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

            {/* Advance_search_menu_sectn*/}
            <section className="advance_search_menu_sectn bgc-thm2 pt20 pb0 mt70-992 filter-style_two">
                <div className="container">
                    <AdvanceFilter
                        handleClearAllFilters={handleClearAllFilters}
                        handleFilterChange={handleFilterChange}
                        queryObject={{
                            brandID: undefined,
                            categoryID: undefined,
                            search: undefined,
                            price_min: undefined,
                            price_max: undefined,
                            type: EnumProductStore.CAR,
                        }}
                    />
                </div>
            </section>
            {/* End Advance_search_menu_sectn*/}

            <section className="home-two p0">
                <div className="container-fluid p0">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="posr">
                                <div className="home_two_map">
                                    <div className="h550 map_in" id="map">
                                        <Map />
                                    </div>
                                </div>
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

export default ListingMapV1;
