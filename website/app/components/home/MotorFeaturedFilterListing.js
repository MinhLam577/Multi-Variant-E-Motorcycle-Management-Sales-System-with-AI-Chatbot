"use client";
import listingsData from "@/data/listingMotor";
import { useStore } from "@/src/stores";
import { toCurrency } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

// const filterOptions = [
//   { value: "*", name: "Tất cả" },
//   { value: "new", name: "Xe điện Vinfast" },
//   { value: "car", name: "Xe YADEKA" },
//   { value: "car", name: "Xe YAKA" },
//   { value: "car", name: "Xe EVGO" },
//   { value: "car", name: "Xe điện thời trang" },
//   { value: "car-specialized", name: "Xe điện học sinh" },
// ];
const EnumProductType = {
  CARS: "car",
  MOTOBIKES: "motorbike",
};

const EnumProductType1 = {
  CARS: "Xe hơi",
  MOTOBIKES: "Xe máy điện",
};

const MotorFeaturedFilterListing = observer(() => {
  //   const [filter, setFilter] = useState("*");

  //   const filteredItems =
  //     filter === "*"
  //       ? listingsData.slice(0, 8)
  //       : listingsData.slice(0, 8).filter((item) => item.tags.includes(filter));
  const { productObservable } = useStore();
  useEffect(() => {
    const fetch = async () => {
      await productObservable.getListProductBuyMany(
        { type: EnumProductType.MOTOBIKES },
        EnumProductType1.MOTOBIKES
      );
      console.log(productObservable?.data?.motobikes?.data);
    };
    fetch();
  }, []);

  return (
    <div className="popular_listing_sliders">
      {/* Tab panes */}
      <div className="row">
        {productObservable?.data?.motobikes?.data?.length > 0 ? (
          productObservable?.data?.motobikes?.data.map((listing) => (
            <div className="col-sm-6 col-xl-3" key={listing.products.id}>
              <Link
                href={`/listing-single-v2/${listing.products.id}`}
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
                      src={listing.products.images[0]}
                      alt={listing.products.titles}
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
                        {toCurrency(listing?.products.price)}
                      </h5>
                      <h6 className="title">
                        <Link
                          href={`/listing-single-v2/${listing.products.id}`}
                        >
                          {listing.products.title}
                        </Link>
                      </h6>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="empty">
            <a>Sản phẩm trống</a>
          </div>
        )}
      </div>
    </div>
  );
});

export default MotorFeaturedFilterListing;
// {/* Nav tabs */}
// <div className="nav nav-tabs justify-content-center">
//   {productObservable?.data?.motobikes?.data.map((type) => (
//     <button
//       key={type.value}
//       className={filter === type.value ? "active nav-link" : "nav-link"}
//       onClick={() => setFilter(type.value)}
//     >
//       {type.name}
//     </button>
//   ))}
// </div>
