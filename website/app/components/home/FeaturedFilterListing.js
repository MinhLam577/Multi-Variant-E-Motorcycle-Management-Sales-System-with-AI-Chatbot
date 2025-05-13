// "use client";
// import listingsData from "@/data/listingCar";
// import { toCurrency, toMileage } from "@/utils";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// const filterOptions = [
//   { value: "*", name: "Tất cả" },
//   { value: "new", name: "Xe tải" },
//   { value: "car", name: "Xe khách" },
//   { value: "truck", name: "Xe ben" },
//   { value: "car-specialized", name: "Xe chuyên dụng" },
// ];

// const FeaturedFilterListing = () => {
//   const [filter, setFilter] = useState("*");

//   const filteredItems =
//     filter === "*"
//       ? listingsData.slice(0, 8)
//       : listingsData.slice(0, 8).filter((item) => item.tags.includes(filter));

//   return (
//     <div className="popular_listing_sliders">
//       {/* Nav tabs */}
//       <div className="nav nav-tabs justify-content-center">
//         {filterOptions.map((type) => (
//           <button
//             key={type.value}
//             className={filter === type.value ? "active nav-link" : "nav-link"}
//             onClick={() => setFilter(type.value)}
//           >
//             {type.name}
//           </button>
//         ))}
//       </div>

//       {/* Tab panes */}
//       <div className="row">
//         {filteredItems.map((listing) => (
//           <div className="col-sm-6 col-xl-3" key={listing.id}>
//             <div className="car-listing">
//               <div className="thumb">
//                 {listing.featured ? (
//                   <>
//                     <div className="tag">Đã qua sử dụng</div>
//                   </>
//                 ) : undefined}
//                 {!listing.featured ? (
//                   <>
//                     <div className="tag blue">Mới</div>
//                   </>
//                 ) : undefined}

//                 <Image
//                   width={284}
//                   height={183}
//                   style={{
//                     width: "100%",
//                     objectFit: "cover",
//                   }}
//                   priority
//                   src={listing.image}
//                   alt={listing.title}
//                 />
//                 <div className="thmb_cntnt2">
//                   <ul className="mb0">
//                     <li className="list-inline-item">
//                       <a className="text-white" href="#">
//                         <span className="flaticon-photo-camera mr3" />{" "}
//                         {listing.photosCount}
//                       </a>
//                     </li>
//                     <li className="list-inline-item">
//                       <a className="text-white" href="#">
//                         <span className="flaticon-play-button mr3" />{" "}
//                         {listing.videosCount}
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//                 <div className="thmb_cntnt3">
//                   <ul className="mb0">
//                     <li className="list-inline-item">
//                       <a href="#">
//                         <span className="flaticon-shuffle-arrows" />
//                       </a>
//                     </li>
//                     <li className="list-inline-item">
//                       <a href="#">
//                         <span className="flaticon-heart" />
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               <div className="details">
//                 <div className="wrapper">
//                   <h5 className="price">{toCurrency(listing.price)}</h5>
//                   <h6 className="title">
//                     <Link href="/listing-single">{listing.title}</Link>
//                   </h6>
//                 </div>{" "}
//                 <div className="listing_footer">
//                   <ul className="mb0">
//                     <li className="list-inline-item">
//                       <span className="flaticon-road-perspective me-2" />
//                       {toMileage(listing.mileage)}
//                     </li>
//                     <li className="list-inline-item">
//                       <span className="flaticon-gas-station me-2" />
//                       {listing.fuelType}
//                     </li>
//                     <li className="list-inline-item">
//                       <span className="flaticon-gear me-2" />
//                       {listing.transmission}
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FeaturedFilterListing;
"use client";
import { observer } from "mobx-react-lite";
import listingsData from "@/data/listingCar";
import { useStore } from "@/src/stores";
import { toCurrency, toMileage } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// const filterOptions = [
//   { value: "*", name: "Tất cả" },
//   { value: "new", name: "Xe tải" },
//   { value: "car", name: "Xe khách" },
//   { value: "truck", name: "Xe ben" },
//   { value: "car-specialized", name: "Xe chuyên dụng" },
// ];
const EnumProductType = {
  CARS: "car",
  MOTOBIKES: "motorbike",
};

const EnumProductType1 = {
  CARS: "Xe hơi",
  MOTOBIKES: "Xe máy điện",
};
const FeaturedFilterListing = observer(() => {
  // const [filter, setFilter] = useState("*");

  // const filteredItems =
  //   filter === "*"
  //     ? listingsData.slice(0, 8)
  //     : listingsData.slice(0, 8).filter((item) => item.tags.includes(filter));
  const filteredItems = [];
  const { productObservable } = useStore();
  const isFetchedRef = useRef(false);

  useEffect(() => {
    if (isFetchedRef.current) return;

    const fetchDataMotobike = async () => {
      console.log("re - render ");
      await productObservable.getListProductBuyMany(
        { type: EnumProductType.CARS },
        EnumProductType1.CARS
      );
      console.log(productObservable?.data?.cars?.data);
    };

    fetchDataMotobike();
    isFetchedRef.current = true;
  }, []);

  return (
    <div className="popular_listing_sliders">
      {/* Nav tabs */}

      {/* Tab panes */}
      <div className="row">
        {productObservable?.data?.cars?.data.map((listing) => (
          <div className="col-sm-6 col-xl-3" key={listing.id}>
            <Link
              href={`/listing-single-v1/${listing.products.id}`}
              className="car-listing block text-inherit no-underline"
            >
              <div className="car-listing">
                <div className="thumb">
                  {listing.featured ? (
                    <>
                      <div className="tag">Đã qua sử dụng</div>
                    </>
                  ) : undefined}
                  {!listing.featured ? (
                    <>
                      <div className="tag blue">Mới</div>
                    </>
                  ) : undefined}

                  <Image
                    width={284}
                    height={183}
                    style={{
                      width: "100%",
                      objectFit: "cover",
                    }}
                    priority
                    src={listing?.products?.images[0]}
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
                      <Link href={`/listing-single-v1/${listing.products.id}`}>
                        {listing.products.title}
                      </Link>
                    </h6>
                  </div>{" "}
                  <div className="listing_footer">
                    <ul className="mb0">
                      <li className="list-inline-item">
                        <span className="flaticon-road-perspective me-2" />
                        {toMileage(listing.mileage)}
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
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
});

export default FeaturedFilterListing;
