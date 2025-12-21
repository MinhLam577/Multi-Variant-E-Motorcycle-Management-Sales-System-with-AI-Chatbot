"use client";

import SwiperCore, { Navigation, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation, Autoplay]);

const Hero = () => {
    const slides = [
        {
            image: "/images/home/2.jpg",
            height: "100%",
            price: "$599",
            title: "Audi R8 Coupe Base - 2019",
            rating: "4.5",
            numReviews: "(382 reviews)",
            features: [
                { icon: "flaticon-road-perspective", text: "57293" },
                { icon: "flaticon-gas-station", text: "Petrol" },
                { icon: "flaticon-gear", text: "Manual" },
            ],
        },
        {
            image: "/images/home/3.png",
            height: "100%",
            price: "$599",
            title: "Audi R8 Coupe Base - 2019",
            rating: "4.5",
            numReviews: "(382 reviews)",
            features: [
                { icon: "flaticon-road-perspective", text: "57293" },
                { icon: "flaticon-gas-station", text: "Petrol" },
                { icon: "flaticon-gear", text: "Manual" },
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
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    };

    return (
        <section className="lg:!pt-[1rem] lg:!pb-0 md:!pt-16 xs:!pt-16 !pb-16">
            <div className="container !px-0">
                <div className="md:aspect-[1200/302] md:flex gap-4">
                    <div
                        className="main-banner-wrapper home3_style container w-full md:w-[calc(100%-389px-16px)] !rounded-xl !px-0"
                        style={{ overflow: "hidden" }}
                    >
                        <div className="banner-style-one !h-full">
                            <Swiper {...params} className="!h-full">
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
                    <div className="hidden w-full grid-rows-2 gap-4 md:grid md:w-[389px]">
                        <div className="overflow-hidden rounded-xl w-full h-full">
                            <img
                                src="/images/home/2.png"
                                alt="Banner 2 image"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="overflow-hidden rounded-xl w-full h-full">
                            <img
                                src="/images/home/2.png"
                                alt="Banner 3 image"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
