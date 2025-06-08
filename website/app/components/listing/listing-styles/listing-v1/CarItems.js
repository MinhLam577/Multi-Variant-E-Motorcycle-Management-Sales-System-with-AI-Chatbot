import listingCar from "@/data/listingCar";
import { toCurrency } from "@/utils";
import Image from "next/image";
import Link from "next/link";

const CarItems = ({ data }) => {
    return (
        <>
            {data.map((listing) => (
                <div className="col-sm-6 col-lg-4 col-xl-3" key={listing.id}>
                    <div className="car-listing">
                        <div className="thumb">
                            {listing.featured ? (
                                <>
                                    <div className="tag">NỔI BẬT</div>
                                </>
                            ) : undefined}
                            {!listing.featured ? (
                                <>
                                    <div className="tag blue">MỚI</div>
                                </>
                            ) : undefined}

                            <Image
                                width={284}
                                height={183}
                                style={{
                                    objectFit: "cover",
                                }}
                                priority
                                src={listing.products.images[0]}
                                alt={listing.title}
                            />
                            <div className="thmb_cntnt2">
                                <ul className="mb0">
                                    <li className="list-inline-item">
                                        <a className="text-white" href="#">
                                            <span className="flaticon-photo-camera mr3" />{" "}
                                            {listing.photosCount}
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a className="text-white" href="#">
                                            <span className="flaticon-play-button mr3" />{" "}
                                            {listing.videosCount}
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
                                    {toCurrency(listing.products.price)}
                                </h5>
                                <h6 className="title">
                                    <Link href="/listing-single-v1">
                                        {listing.products.title}
                                    </Link>
                                </h6>
                            </div>
                            {/* End wrapper */}

                            <div className="listing_footer">
                                <ul className="mb0">
                                    <li className="list-inline-item">
                                        <span className="flaticon-road-perspective me-2" />
                                        {listing.mileage}
                                    </li>
                                    <li className="list-inline-item">
                                        <span className="flaticon-gas-station me-2" />
                                        {listing.fuelType}
                                    </li>
                                    <li className="list-inline-item">
                                        <span className="flaticon-gear me-2" />
                                        {listing.transmission}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default CarItems;
