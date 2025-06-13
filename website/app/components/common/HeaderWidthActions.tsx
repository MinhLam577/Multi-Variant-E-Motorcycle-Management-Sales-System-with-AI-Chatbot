"use client";
import { ThemeContext } from "@/app/layout/ThemeContext";
import { EnumProductStore } from "@/src/stores/productStore";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

class HeaderWithActionsStore {
    type: EnumProductStore = EnumProductStore.CAR;
    constructor() {
        makeAutoObservable(
            this,
            {},
            {
                autoBind: true,
            }
        );
    }

    setType(type: EnumProductStore) {
        this.type = type;
    }
}

export const headerWithActionsStore = new HeaderWithActionsStore();

export const HeaderWithActions = observer(() => {
    const { onChangeTheme, theme } = useContext(ThemeContext);

    const handleLeftClick = () => {
        onChangeTheme("primary-car");
        headerWithActionsStore.setType(EnumProductStore.CAR);
    };
    const handleRightClick = () => {
        onChangeTheme("primary-bike");
        headerWithActionsStore.setType(EnumProductStore.MOTORBIKE);
    };

    return (
        <div className="header_action xl:!flex lg:!flex md:!hidden sm:!hidden hidden">
            {/* <!-- Left Content --> */}
            <Link href="/" passHref legacyBehavior>
                <div
                    style={{
                        backgroundColor:
                            theme === "primary-car" ? `var(--${theme})` : null,
                    }}
                    className="left-content"
                    onClick={handleLeftClick}
                >
                    <Image
                        alt="oto"
                        src="/images/icon/car.png"
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
});
