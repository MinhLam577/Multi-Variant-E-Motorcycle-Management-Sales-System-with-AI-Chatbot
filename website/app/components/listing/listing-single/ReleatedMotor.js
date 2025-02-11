"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import listingCar from "@/data/listingMotor";
import Link from "next/link";
import Image from "next/image";
import { toCurrency } from "@/utils";

const ReleatedMotor = () => {
  return (
    <>
      <Swiper
        spaceBetween={20}
        speed={1000}
        modules={[Pagination]}
        pagination={{
          el: ".car-for-rent-pag",
          spaceBetween: 10,
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
        {listingCar.slice(0, 6).map((listing) => (
          <SwiperSlide key={listing.id}>
            <div className="item">
              <div className="car-listing">
                <div className="thumb">
                  {listing.featured ? (
                    <>
                      <div className="tag">Mới</div>
                    </>
                  ) : undefined}
                  {!listing.featured ? (
                    <>
                      <div className="tag blue">Đã qua sử dụng</div>
                    </>
                  ) : undefined}

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
                      <Link href="/listing-single-v1">{listing.title}</Link>
                    </h6>
                  </div>{" "}
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
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-3 text-center">
        <div className="car-for-rent-pag" />
      </div>
    </>
  );
};

export default ReleatedMotor;
