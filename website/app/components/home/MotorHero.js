"use client";

import SwiperCore, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
SwiperCore.use([Navigation]);

const MotorHero = () => {
  const slides = [
    {
      image: "/images/home/1.png",
      height: "740px",
      price: "$478",
      title: "Ferrari 488 Spider Base - 2019",
      rating: "4.7",
      numReviews: "(684 reviews)",
      features: [
        { icon: "flaticon-road-perspective", text: "77362" },
        { icon: "flaticon-gas-station", text: "Diesel" },
        { icon: "flaticon-gear", text: "Automatic" },
      ],
    },
  ];

  const params = {
    spaceBetween: 0,
    slidesPerView: 1,
    loop: true,
    speed: 1000,
    navigation: {
      prevEl: ".left-btn",
      nextEl: ".right-btn",
    },
  };

  return (
    <section className="home-one bg-home1">
      <div
        className="main-banner-wrapper home3_style"
        style={{ overflow: "hidden" }}
      >
        <div className="banner-style-one">
          <Swiper {...params}>
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div
                  className="slide slide-one"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    height: slide.height,
                    backgroundSize: "cover",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="carousel-btn-block banner-carousel-btn">
          <span className="carousel-btn left-btn">
            <i className="flaticon-left-arrow left" />
          </span>
          <span className="carousel-btn right-btn">
            <i className="flaticon-right-arrow right" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default MotorHero;
