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
    <div className="popular_listing_sliders mb-10">
      {/* Tab panes */}
      <div className="row">
        {productObservable?.data?.motobikes?.data?.length > 0 ? (
          productObservable?.data?.motobikes?.data.map((listing) => (
            <div className="col-sm-6 col-xl-3" key={listing.products.id}>
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
                      src={listing.products.images[0]}
                      alt={listing.products.title}
                    />

                    {/* Icon ảnh */}
                    <div className="absolute bottom-2 left-2 flex space-x-2 z-10">
                      <a
                        className="text-white bg-black/50 text-xs px-2 py-1 rounded flex items-center gap-1"
                        href="#"
                      >
                        <span className="flaticon-photo-camera" />
                        <span>{listing.photosCount}</span>
                      </a>
                      <a
                        className="text-white bg-black/50 text-xs px-2 py-1 rounded flex items-center gap-1"
                        href="#"
                      >
                        <span className="flaticon-play-button" />
                        <span>{listing.videosCount}</span>
                      </a>
                    </div>
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

// danh sách  sp

//  <div className="col-sm-6 col-xl-3" key={listing.products.id}>
//               <Link
//                 href={`/listing-single-v2/${listing.products.id}`}
//                 className="car-listing block text-inherit no-underline"
//               >
//                 <div className="car-listing">
//                   <div className="thumb">
//                     <Image
//                       width={284}
//                       height={183}
//                       style={{
//                         width: "100%",
//                         objectFit: "cover",
//                       }}
//                       priority
//                       src={listing.products.images[0]}
//                       alt={listing.products.titles}
//                     />
//                     <div className="thmb_cntnt2">
//                       <ul className="mb0">
//                         <li className="list-inline-item">
//                           <a className="text-white" href="#">
//                             <span className="flaticon-photo-camera mr3" />{" "}
//                             {listing.photosCount}
//                           </a>
//                         </li>
//                         <li className="list-inline-item">
//                           <a className="text-white" href="#">
//                             <span className="flaticon-play-button mr3" />{" "}
//                             {listing.videosCount}
//                           </a>
//                         </li>
//                       </ul>
//                     </div>
//                     <div className="thmb_cntnt3">
//                       <ul className="mb0">
//                         <li className="list-inline-item">
//                           <a href="#">
//                             <span className="flaticon-shuffle-arrows" />
//                           </a>
//                         </li>
//                         <li className="list-inline-item">
//                           <a href="#">
//                             <span className="flaticon-heart" />
//                           </a>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="details">
//                     <div className="wrapper">
//                       <h5 className="price">
//                         {toCurrency(listing?.products.price)}
//                       </h5>
//                       <h6 className="title">
//                         <Link
//                           href={`/listing-single-v2/${listing.products.id}`}
//                         >
//                           {listing.products.title}
//                         </Link>
//                       </h6>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             </div>
