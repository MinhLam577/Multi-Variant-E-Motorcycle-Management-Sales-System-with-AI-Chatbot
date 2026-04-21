"use client";
import Footer from "@/app/components/common/Footer";
import MobileMenu from "@/app/components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import AdvanceFilter from "@/app/components/listing/advance-filter";
import Pagination from "@/app/components/common/Pagination";
import ListGridFilter from "@/app/components/listing/ListGridFilter";
import CarItems from "@/app/components/listing/listing-styles/listing-v1/CarItems";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/store.context";
import { paginationData } from "@/src/stores/order.store";
import {
    EnumProductSortBy,
    EnumProductStore,
    globalFilterType,
} from "@/src/stores/productStore";
import { filterEmptyFields } from "@/utils";
import { observer } from "mobx-react-lite";
import Header from "@/app/components/home/Header";
import BreadCrumb from "@/app/components/common/atoms/BreadCrumb";
import { Skeleton } from "antd";

const ListingV1 = observer(() => {
    const store = useStore();
    const storeProduct = store.productObservable;
    const storeCategory = store.categoryObservable
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
    const [isFetch, setIsFetch] = useState<boolean>(false)
    useEffect(() => {
        const typeFromParams = searchParams.get("type");
        const categoryIDFromParams = searchParams.get("categoryID");
        const search = searchParams.get("search");
        if (typeFromParams) {
            setType(typeFromParams as EnumProductStore);
        }
        if (categoryIDFromParams) {
            fetchCategoryByID(categoryIDFromParams);
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
        }
    }, [type]);

    // Function gọi API
    const fetchProductsData = async (
        query:
            | (paginationData & globalFilterType)
            | paginationData
            | globalFilterType,
        type: EnumProductStore = EnumProductStore.MOTORBIKE
    ) => {
        try {
            await storeProduct.getListProduct(query, type);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchCategoryByID = async (id: string)=>{
      try{
        await storeCategory.getCategoryDetail(id)
      }
      catch(e){
        console.error("Error fetching category: ", e)
      }
    }

    const fetchOtherData = async () => {
        try {
            setIsFetch(true)
            await storeProduct.getProductSortBy();
        } catch (error) {
            console.error("Error fetching other data:", error);
        }
          finally{
            setIsFetch(false)
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
            <Header/>

            <MobileMenu />
            <Skeleton
              loading={isFetch}
              paragraph={
                {
                rows: 9
                }
              }
            >
              <BreadCrumb
                items={[
                  { label: "Trang chủ", href: "/" },
                  { label: storeCategory.detailData?.name },
                ]}
              />
              <section className="advance_search_menu_sectn bgc-thm2 pb0 mt70-992 filter-style_two z-50 lg:z-0 !bg-[#f9f9f9] !pt-0">
                  <div className="container">
                      <AdvanceFilter
                          handleFilterChange={setQueryObject}
                          handleClearAllFilters={handleClearAllFilters}
                          queryObject={queryObject}
                      />
                  </div>
              </section>
              <section className="our-listing pt0 bgc-f9 pb30-991">
                  <div className="container">
                      <div className="row">
                          <ListGridFilter
                              data={storeProduct?.data?.motobikes.data}
                              setQueryObject={setQueryObject}
                              queryObject={queryObject}
                          />
                      </div>
                      {/* End .row */}
                      <div className="row">
                          <CarItems
                              data={storeProduct?.data?.motobikes.data}
                              queryObject={queryObject}
                              categoryName={storeCategory.detailData?.name}
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
            </Skeleton>

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
