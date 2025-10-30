"use client";
import { useStore } from "@/context/store.context";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { EnumProductStore, globalFilterType } from "@/src/stores/productStore";
import { filterEmptyFields } from "@/utils";
import { paginationData } from "@/src/stores/order.store";
import { Skeleton } from "antd";

const MotorFeaturedFilterListing = observer(() => {
    const [queryObject, setQueryObject] = useState<globalFilterType>({
        brandID: undefined,
        categoryID: undefined,
        search: undefined,
        price_min: undefined,
        price_max: undefined,
        type: EnumProductStore.MOTORBIKE,
    });
    const { productObservable } = useStore();
    const fetchData = async (
        query:
            | string
            | (paginationData & globalFilterType)
            | paginationData
            | globalFilterType,
        type: EnumProductStore = EnumProductStore.CAR
    ) => {
        try {
            await productObservable.getListProduct(query, type);
        } catch (e) {
            console.error("Error fetching data:", e);
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
        <Skeleton
            loading={productObservable?.loading}
            active
            className="!bg-white !rounded-lg !p-4"
            paragraph={{ rows: 4 }}
            title={false}
        >
            <div className="popular_listing_sliders mb-10">
                {/* Tab panes */}
                <div className="row">
                    {productObservable?.data?.motobikes?.data?.length > 0 ? (
                        productObservable?.data?.motobikes?.data.map(
                            (listing) => (
                                <div
                                    className="col-sm-6 col-xl-3"
                                    key={listing.products.id}
                                >
                                    <Link
                                        href={`/listing-single-v2/${listing.products.id}`}
                                        className="block no-underline text-inherit h-full"
                                    >
                                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col h-full">
                                            {/* Ảnh sản phẩm với tỷ lệ cố định */}
                                            <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                                                <Image
                                                    fill
                                                    className="object-cover"
                                                    priority
                                                    src={
                                                        listing.products
                                                            .images[0]
                                                    }
                                                    alt={listing.products.title}
                                                />
                                            </div>

                                            {/* Nội dung card */}
                                            <div className="p-4 flex flex-col flex-1">
                                                <div className="text-blue-700 font-semibold mb-1">
                                                    Báo giá
                                                </div>

                                                {/* Tên sản phẩm giới hạn 2 dòng */}
                                                <div className="text-gray-800 text-sm line-clamp-2">
                                                    {listing.products.title}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        )
                    ) : (
                        <div className="empty">
                            <a>Sản phẩm trống</a>
                        </div>
                    )}
                </div>
            </div>
        </Skeleton>
    );
});

export default MotorFeaturedFilterListing;
