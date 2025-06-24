"use client";

import SwiperCore, { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
SwiperCore.use([Navigation]);

const MotorHero = () => {
    const slides = [
        {
            image: "/images/home-motor/homepage-motor-3.jpg",
            height: "700px",
        },
        {
            image: "/images/home-motor/homepage-motor-2.jpg",
            height: "700px",
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
        <section className="xl:!py-0 lg:!py-0 md:!pt-16 xs:!pt-16 !pb-16">
            <div
                className="main-banner-wrapper home3_style"
                style={{ overflow: "hidden" }}
            >
                <div className="banner-style-one">
                    {/* <div> */}
                    <Swiper {...params}>
                        {slides.map((slide, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className="slide slide-one"
                                    style={{
                                        backgroundImage: `url(${slide.image})`,
                                        height: slide.height,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
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
