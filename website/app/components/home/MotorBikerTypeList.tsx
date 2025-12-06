"use client";
import { useStore } from "@/context/store.context";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

const EnumProductType = {
    CARS: "car",
    MOTOBIKES: "motorbike",
};

const EnumProductType1 = {
    CARS: "Xe hơi",
    MOTOBIKES: "Xe máy điện",
};

const MotorBikeTypeList = observer(() => {
    const { productObservable } = useStore();
    useEffect(() => {
        const fetch = async () => {
            await productObservable.getListProductBuyMany(
                { type: EnumProductType.MOTOBIKES },
                EnumProductType1.MOTOBIKES
            );
        };
        fetch();
    }, []);

    return (
        <div className="popular_listing_sliders">
            <div className="row">
                {productObservable?.data?.motobikes?.data
                    .slice(0, 3)
                    .map((listing) => (
                        <div
                            className="col-sm-6 col-xl-3"
                            key={listing.products.id}
                        >
                            <div className="car-listing">
                                <div className="thumb relative w-full h-[183px]">
                                    <Image
                                        width={284}
                                        height={183}
                                        className="w-full h-full object-cover"
                                        priority
                                        src={listing.products.images[0]}
                                        alt={"thumbnail"}
                                    />
                                    <div className="thmb_cntnt2">
                                        <ul className="mb0">
                                            <li className="list-inline-item">
                                                <a
                                                    className="text-white"
                                                    href="#"
                                                >
                                                    <span className="flaticon-photo-camera mr3" />{" "}
                                                    {20}
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a
                                                    className="text-white"
                                                    href="#"
                                                >
                                                    <span className="flaticon-play-button mr3" />{" "}
                                                    {30}
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
                                <div className="details p-4 h-full flex flex-col justify-between">
                                    <div className="wrapper space-y-2">
                                        <h5 className="price text-xl font-semibold text-green-600">
                                            Báo giá
                                        </h5>
                                        <h6 className="title text-base font-medium text-gray-800 hover:text-blue-600 transition line-clamp-2 truncate">
                                            <Link
                                                href={`/listing-single-v2/${listing.products.id}`}
                                            >
                                                {listing.products.title}
                                            </Link>
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
});

export default MotorBikeTypeList;

{
    /* Nav tabs */
}
// <div className="nav nav-tabs justify-content-center">
//   {filterOptions.map((type) => (
//     <button
//       key={type}
//       className={filter === type.value ? "active nav-link" : "nav-link"}
//       onClick={() => setFilter(type)}
//     >
//       {type.name}
//     </button>
//   ))}
// </div>
{
    /* Tab panes */
}
