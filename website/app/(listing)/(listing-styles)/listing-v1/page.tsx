"use client";
import Footer from "@/app/components/common/Footer";
import DefaultHeader from "@/app/components/common/DefaultHeader";
import HeaderSidebar from "@/app/components/common/HeaderSidebar";
import MobileMenu from "@/app/components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import AdvanceFilter from "@/app/components/listing/advance-filter";
import Pagination from "@/app/components/common/Pagination";
import ListGridFilter from "@/app/components/listing/ListGridFilter";
import CarItems from "@/app/components/listing/listing-styles/listing-v1/CarItems";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/src/stores";
import { paginationData } from "@/src/stores/order.store";
import {
    EnumProductSortBy,
    EnumProductStore,
    globalFilterType,
} from "@/src/stores/productStore";
import { filterEmptyFields } from "@/utils";
import { observer } from "mobx-react-lite";
import { headerWithActionsStore } from "@/app/components/common/HeaderWidthActions";

const ListingV1 = observer(() => {
    const store = useStore();
    const storeProduct = store.productObservable;
    const [queryObject, setQueryObject] = useState<
        globalFilterType & paginationData
    >({
        brandID: undefined,
        categoryID: undefined,
        search: undefined,
        price_min: undefined,
        price_max: undefined,
        type: undefined,
        sort_by: EnumProductSortBy.UPDATED_AT_DESC,
        ...storeProduct.pagination,
    });

    const searchParams = useSearchParams();
    const [type, setType] = useState<EnumProductStore>();
    useEffect(() => {
        const typeFromParams = searchParams.get("type");
        const categoryIDFromParams = searchParams.get("categoryID");
        const search = searchParams.get("search");
        if (typeFromParams) {
            setType(typeFromParams as EnumProductStore);
        }
        if (categoryIDFromParams) {
            setQueryObject((prev) => ({
                ...prev,
                categoryID: categoryIDFromParams,
            }));
        }
        if (search !== undefined) {
            setQueryObject((prev) => ({
                ...prev,
                search: search,
            }));
        }
    }, [searchParams]);

    useEffect(() => {
        if (type) {
            setQueryObject((prev) => ({
                ...prev,
                type: type,
            }));
            headerWithActionsStore.setType(type);
        }
    }, [type]);

    // Function gọi API
    const fetchProductsData = async (
        query:
            | (paginationData & globalFilterType)
            | paginationData
            | globalFilterType,
        type: EnumProductStore = EnumProductStore.CAR
    ) => {
        try {
            await storeProduct.getListProduct(query, type);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchOtherData = async () => {
        try {
            await storeProduct.getProductSortBy();
        } catch (error) {
            console.error("Error fetching other data:", error);
        }
    };

    // Cập nhật URL khi người dùng thay đổi lựa chọn
    const updateUrl = (newParams: globalFilterType) => {
        // Lấy các tham số hiện tại từ URL
        const newQueryParams = new URLSearchParams(
            Object.entries(newParams).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        );
        window.history.replaceState(null, "", `?${newQueryParams.toString()}`);
    };

    const handleClearAllFilters = () => {
        setQueryObject({
            brandID: undefined,
            categoryID: undefined,
            search: undefined,
            price_min: undefined,
            price_max: undefined,
            type: type,
            current: 1,
            pageSize: 10,
        });
    };

    useEffect(() => {
        if (queryObject.type) {
            const searchObject = filterEmptyFields(queryObject);
            updateUrl(searchObject);
            fetchProductsData(searchObject, type);
        }
    }, [queryObject]);

    useEffect(() => {
        fetchOtherData();
    }, []);

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

            {/* End header top */}

            {/* Main Header Nav */}
            <DefaultHeader />
            {/* End Main Header Nav */}

            {/* Main Header Nav For Mobile */}
            <MobileMenu />
            {/* End Main Header Nav For Mobile */}

            {/* Advance_search_menu_sectn*/}
            <section className="advance_search_menu_sectn bgc-thm2 pt20 pb0 mt70-992 filter-style_two z-50 lg:z-0">
                <div className="container">
                    <AdvanceFilter
                        handleFilterChange={setQueryObject}
                        handleClearAllFilters={handleClearAllFilters}
                        queryObject={queryObject}
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
                                {type === EnumProductStore.MOTORBIKE ? (
                                    <h2 className="breadcrumb_title">
                                        Xe máy điện
                                    </h2>
                                ) : (
                                    <h2 className="breadcrumb_title">Xe ôtô</h2>
                                )}

                                <ol className="breadcrumb fn-sm mt15-sm">
                                    <li className="breadcrumb-item">
                                        <a href="/">Home</a>
                                    </li>
                                    <li
                                        className="breadcrumb-item active"
                                        aria-current="page"
                                    >
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
                        <ListGridFilter
                            data={
                                type === EnumProductStore.CAR
                                    ? storeProduct?.data?.cars.data
                                    : storeProduct?.data?.motobikes.data || []
                            }
                            setQueryObject={setQueryObject}
                            queryObject={queryObject}
                        />
                    </div>
                    {/* End .row */}

                    <div className="row">
                        <CarItems
                            data={
                                type === EnumProductStore.CAR
                                    ? storeProduct?.data?.cars.data
                                    : storeProduct?.data?.motobikes.data || []
                            }
                            queryObject={queryObject}
                        />
                    </div>
                    {/* End .row */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="mbp_pagination mt10">
                                <Pagination
                                    setQueryObject={setQueryObject}
                                    queryObject={queryObject}
                                />
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
});

export default ListingV1;
