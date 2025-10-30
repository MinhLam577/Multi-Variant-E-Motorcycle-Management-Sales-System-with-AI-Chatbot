"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import Link from "next/link";
import Image from "next/image";
import { toCurrency } from "@/utils";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { EnumProductStore } from "@/src/stores/productStore";
import { filterEmptyFields } from "@/utils";
import { useStore } from "@/context/store.context";
const ReleatedMotor = observer(() => {
    const [queryObject, setQueryObject] = useState({
        brandID: undefined,
        categoryID: undefined,
        search: undefined,
        price_min: undefined,
        price_max: undefined,
        type: EnumProductStore.MOTORBIKE,
    });
    const { productObservable } = useStore();
    const fetchData = async (query, type = EnumProductStore.MOTORBIKE) => {
        try {
            await productObservable.getListProduct(query, type);
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    // Cập nhật URL khi người dùng thay đổi lựa chọn
    const updateUrl = (newParams) => {
        // Lấy các tham số hiện tại từ URL
        const newQueryParams = new URLSearchParams(
            Object.entries(newParams).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {})
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
            type: queryObject.type,
        });
    };

    useEffect(() => {
        if (Object.keys(queryObject).length > 0) {
            const searchObject = filterEmptyFields(queryObject);
            updateUrl(searchObject);
            fetchData(searchObject, queryObject.type);
        }
    }, [queryObject]);

    return (
        <>
            <Swiper
                spaceBetween={20}
                speed={1000}
                modules={[Pagination]}
                pagination={{
                    el: ".car-for-rent-pag",
                    clickable: true,
                }}
                breakpoints={{
                    // breakpoints for responsive design
                    320: {
                        slidesPerView: 1,
                    },
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1068: {
                        slidesPerView: 4,
                    },
                }}
            >
                {productObservable?.data?.motobikes?.data
                    .slice(0, 6)
                    .map((listing) => {
                        return (
                            <SwiperSlide key={listing.products.id}>
                                <div className="item">
                                    <div className="car-listing">
                                        <div className="thumb">
                                            <Link
                                                href={`/listing-single-v2/${listing?.products?.id}?type=motorbike`}
                                            >
                                                <div className="w-full h-[220px] relative overflow-hidden rounded-t-xl">
                                                    <Image
                                                        width={284}
                                                        height={183}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                        priority
                                                        src={
                                                            listing?.products
                                                                ?.images?.[0]
                                                        }
                                                        alt={
                                                            listing.products
                                                                .title
                                                        }
                                                    />
                                                </div>
                                            </Link>
                                            <div className="thmb_cntnt2">
                                                <ul className="mb0">
                                                    <li className="list-inline-item">
                                                        <a
                                                            className="text-white"
                                                            href="#"
                                                        >
                                                            <span className="flaticon-photo-camera mr3" />{" "}
                                                            {0}
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <a
                                                            className="text-white"
                                                            href="#"
                                                        >
                                                            <span className="flaticon-play-button mr3" />{" "}
                                                            {0}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="thmb_cntnt3">
                                                <ul className="mb0">
                                                    <li className="list-inline-item">
                                                        <a href="#">
                                                            <span className="flaticon-shuffle-arrows" />
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <a href="#">
                                                            <span className="flaticon-heart" />
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="details mt-1">
                                            <div className="wrapper">
                                                <h5 className="price">
                                                    {toCurrency(
                                                        listing?.products
                                                            ?.skus?.[0]
                                                            ?.price_sold
                                                    )}
                                                </h5>
                                                <h6 className="mt-1 text-base  leading-snug h-[48px] overflow-hidden line-clamp-2">
                                                    <Link
                                                        href={`/listing-single-v2/${listing?.products?.id}?type=motorbike`}
                                                    >
                                                        {
                                                            listing?.products
                                                                ?.title
                                                        }
                                                    </Link>
                                                </h6>
                                            </div>{" "}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
            </Swiper>
            <div className="mt-3 text-center">
                <div className="car-for-rent-pag" />
            </div>
        </>
    );
});

export default ReleatedMotor;
{
    /* <div className="listing_footer">
                    <ul className="mb0">
                      <li className="list-inline-item">
                        <span className="flaticon-road-perspective me-2" />
                        {listing?.mileage}
                      </li>
                      <li className="list-inline-item">
                        <span className="flaticon-gas-station me-2" />
                        {listing?.fuelType}
                      </li>
                      <li className="list-inline-item">
                        <span className="flaticon-gear me-2" />
                        {listing?.transmission}
                      </li>
                    </ul>
                  </div> */
}
