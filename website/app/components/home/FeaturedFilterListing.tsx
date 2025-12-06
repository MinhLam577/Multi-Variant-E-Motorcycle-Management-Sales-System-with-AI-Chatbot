"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/context/store.context";
import { toCurrency } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { EnumProductStore } from "@/src/stores/productStore";
import { Skeleton } from "antd";

const FeaturedFilterListing = observer(() => {
    const { productObservable } = useStore();
    const isFetchedRef = useRef(false);

    useEffect(() => {
        if (isFetchedRef.current) return;
        const fetchDataMotobike = async () => {
            await productObservable.getBestSellingProducts(
                EnumProductStore.CAR
            );
        };
        fetchDataMotobike();
        isFetchedRef.current = true;
    }, []);

    return (
        <Skeleton
            loading={productObservable?.loading}
            active
            className="!bg-white !rounded-lg !p-4"
            paragraph={{ rows: 4 }}
            title={false}
        >
            <div className="popular_listing_sliders">
                {/* Nav tabs */}
                {/* Tab panes */}
                <div className="row">
                    {productObservable?.data?.cars?.bestSelling.map(
                        (listing) => (
                            <div className="col-sm-6 col-xl-3" key={listing.id}>
                                <Link
                                    href={`/listing-single-v1/${listing.id}`}
                                    className="car-listing block text-inherit no-underline"
                                >
                                    <div className="car-listing">
                                        <div className="thumb">
                                            <Image
                                                style={{
                                                    width: "100%",
                                                    objectFit: "cover",
                                                }}
                                                width={383}
                                                height={284}
                                                priority
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                className="!h-64"
                                            />
                                        </div>
                                        <div className="details">
                                            <div className="wrapper">
                                                <h5 className="price">
                                                    {toCurrency(
                                                        listing.skus?.[0]
                                                            ?.price_sold
                                                    )}
                                                </h5>
                                                <h6 className="title line-clamp-2">
                                                    {listing.title}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </div>
        </Skeleton>
    );
});

export default FeaturedFilterListing;
