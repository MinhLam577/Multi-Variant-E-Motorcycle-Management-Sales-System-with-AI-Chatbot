"use client";
import listingsData from "@/data/listingMotor";
import { toCurrency } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
const filterOptions = [
  { value: "*", name: "Tất cả" },
  { value: "new", name: "Xe điện Vinfast" },
  { value: "car", name: "Xe YADEKA" },
  { value: "car", name: "Xe YAKA" },
  { value: "car", name: "Xe EVGO" },
  { value: "car", name: "Xe điện thời trang" },
  { value: "car-specialized", name: "Xe điện học sinh" },
];

const MotorBikeTypeList = () => {
  const [filter, setFilter] = useState("*");

  const filteredItems =
    filter === "*"
      ? listingsData.slice(0, 8)
      : listingsData.slice(0, 8).filter((item) => item.tags.includes(filter));

  return (
    <div className="popular_listing_sliders">
      {/* Nav tabs */}
      <div className="nav nav-tabs justify-content-center">
        {filterOptions.map((type) => (
          <button
            key={type}
            className={filter === type.value ? "active nav-link" : "nav-link"}
            onClick={() => setFilter(type)}
          >
            {type.name}
          </button>
        ))}
      </div>
      {/* Tab panes */}
      <div className="row">
        {filteredItems.map((listing) => (
          <div className="col-sm-6 col-xl-3" key={listing.id}>
            <div className="car-listing">
              <div className="thumb">
                <Image
                  width={284}
                  height={183}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  priority
                  src={listing.image}
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
                  <h5 className="price">{toCurrency(listing.price)}</h5>
                  <h6 className="title">
                    <Link href="/listing-single-v2">{listing.title}</Link>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotorBikeTypeList;
