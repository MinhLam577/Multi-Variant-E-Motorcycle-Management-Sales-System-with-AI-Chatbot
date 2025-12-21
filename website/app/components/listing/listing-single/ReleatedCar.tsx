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
const EnumProductType1 = {
    MOTOBIKES: "Xe máy điện",
};

const ReleatedCar = observer(() => {
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
                {productObservable?.data?.cars?.data
                    .slice(0, 6)
                    .map((listing) => (
                        <SwiperSlide key={listing?.products?.id}>
                            <div className="item">
                                <div className="car-listing">
                                    <div className="thumb">
                                        <Link
                                            href={`/listing-single-v1/${listing?.products?.id}?type=car`}
                                        >
                                            <div className="w-full h-[220px] relative overflow-hidden rounded-t-xl">
                                                <Image
                                                    src={
                                                        listing?.products
                                                            ?.images?.[0]
                                                    }
                                                    alt={
                                                        listing?.products
                                                            ?.images?.[0]
                                                    }
                                                    fill
                                                    priority
                                                    className="object-cover"
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
                                    <div className="details">
                                        <div className="wrapper">
                                            <h5 className="price">
                                                {"20000 vnd"}
                                            </h5>
                                            <h6 className="title">
                                                <Link
                                                    href={`/listing-single-v1/${listing?.products?.id}?type=car`}
                                                >
                                                    {listing?.products?.title}
                                                </Link>
                                            </h6>
                                        </div>{" "}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
            <div className="mt-3 text-center">
                <div className="car-for-rent-pag" />
            </div>
        </>
    );
});

export default ReleatedCar;
