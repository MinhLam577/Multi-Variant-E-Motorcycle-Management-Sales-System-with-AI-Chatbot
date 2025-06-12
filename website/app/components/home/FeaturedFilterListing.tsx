"use client";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/stores";
import { toCurrency } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { EnumProductStore } from "@/src/stores/productStore";

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
        <div className="popular_listing_sliders">
            {/* Nav tabs */}

            {/* Tab panes */}
            <div className="row">
                {productObservable?.data?.cars?.bestSelling.map((listing) => (
                    <div className="col-sm-6 col-xl-3" key={listing.id}>
                        <Link
                            href={`/listing-single-v1/${listing.id}`}
                            className="car-listing block text-inherit no-underline"
                        >
                            <div className="car-listing">
                                <div className="thumb">
                                    <Image
                                        width={284}
                                        height={183}
                                        style={{
                                            width: "100%",
                                            objectFit: "cover",
                                        }}
                                        priority
                                        src={listing.images[0]}
                                        alt={listing.title}
                                    />
                                </div>
                                <div className="details">
                                    <div className="wrapper">
                                        <h5 className="price">
                                            {toCurrency(
                                                listing.skus?.[0]?.price_sold
                                            )}
                                        </h5>
                                        <h6 className="title">
                                            <Link
                                                href={`/listing-single-v1/${listing.id}`}
                                            >
                                                {listing.title}
                                            </Link>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default FeaturedFilterListing;
