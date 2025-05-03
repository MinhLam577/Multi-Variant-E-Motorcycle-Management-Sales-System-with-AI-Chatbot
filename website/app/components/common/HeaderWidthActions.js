"use client";
import { ThemeContext } from "@/app/layout/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
export const HeaderWithActions = () => {
  const { onChangeTheme, theme } = useContext(ThemeContext);

  const handleLeftClick = () => {
    onChangeTheme("primary-car");
  };
  const handleRightClick = () => {
    onChangeTheme("primary-bike");
  };

  return (
    <div className="header_action dn-992">
      {/* <!-- Left Content --> */}
      <Link href="/" passHref legacyBehavior>
        <div
          style={{
            backgroundColor: theme === "primary-car" ? `var(--${theme})` : null,
          }}
          className="left-content"
          onClick={handleLeftClick}
        >
          <Image
            alt="oto"
            src={"/images/icon/car.png"}
            width={30}
            height={30}
            className="me-3"
          />
          <a>Ô TÔ TẢI</a>
        </div>
      </Link>

      {/* <!-- Center Logo --> */}
      <div className="flex justify-center items-center">
        <Link href="/">
          <img
            src="/images/logo.png"
            alt="header-logo"
            className="object-cover w-[120px] h-[40px]"
          />
        </Link>
      </div>

      {/* <!-- Right Content --> */}
      <Link href="/home-motorbike" passHref legacyBehavior>
        <div
          className="right-content"
          onClick={handleRightClick}
          style={{
            backgroundColor:
              theme === "primary-bike" ? `var(--${theme})` : null,
          }}
        >
          <Image
            alt="motor"
            src={"/images/icon/scooter.png"}
            width={30}
            height={30}
            className="me-2"
          />
          <a>XE MÁY ĐIỆN</a>
        </div>
      </Link>
    </div>
  );
};
