"use client";
import { useState } from "react";
import ModalVideo from "react-modal-video";
import "react-modal-video/scss/modal-video.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { observer } from "mobx-react-lite";
// import required modules
import Image from "next/image";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { useStore } from "@/src/stores";

const slides = [
  {
    imageSrc: "/images/listing/lsp1-v1.png",
    videoId: "VWrJkx6O0L8",
  },
  {
    imageSrc: "/images/listing/lsp1-v2.png",
    videoId: "TLEyLGWvjII",
  },
  {
    imageSrc: "/images/listing/lsp1-v3.png",
    videoId: "BS2jGGYC60c",
  },
  {
    imageSrc: "/images/listing/lsp1-v3.png",
    videoId: "8PiZNUCexrA",
  },
  {
    imageSrc: "/images/listing/lsp1-v3.png",
    videoId: "m4ZGuAbUMg8",
  },
];

const ProductGallery = observer(() => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [videoId, setVideoId] = useState("");

    const store = useStore();
    const storeProduct = store.productObservable;

  const openModal = (id) => {
    setVideoId(id);
    setOpen(true);
  };
  const optionValuesImage =
    storeProduct?.data?.resultOption_OptionValue?.[0]?.option_values || [];
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <Swiper
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#fff",
            }}
            spaceBetween={10}
            navigation={true}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2 sps_content single_product_grid user_profile "
          >
            {optionValuesImage.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="item">
                  <Image
                    width={856}
                    height={554}
                    priority
                    style={{ width: "100%", objectFit: "cover" }}
                    className="w-100 h-100"
                    src={slide.image}
                    alt="large car"
                  />

                  <div className="overlay_icon">
                    <button
                      className="video_popup_btn popup-img popup-youtube pt10"
                      onClick={() => openModal(slide.videoId)}
                    >
                      <span className="flaticon-play-button" />
                      Video
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper mt-2 thumb-gallery-opacity"
          >
            {optionValuesImage.map((slide, index) => (
              <SwiperSlide key={index}>
                <Image
                  width={163}
                  height={106}
                  priority
                  style={{ objectFit: "cover" }}
                  src={slide.image}
                  alt="thum car"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <ModalVideo
        channel="youtube"
        isOpen={isOpen}
        videoId={videoId}
        onClose={() => setOpen(false)}
      />
    </>
  );
});
export default ProductGallery;
