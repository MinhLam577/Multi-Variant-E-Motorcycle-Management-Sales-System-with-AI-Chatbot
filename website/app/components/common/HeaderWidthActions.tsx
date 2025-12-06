"use client";
import { useTheme } from "@/context/theme.context";
import { EnumProductStore } from "@/src/stores/productStore";
import { makeAutoObservable, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

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
    const { onChangeTheme, theme } = useTheme();
    const handleLeftClick = () => {
        onChangeTheme("primary-car");
        headerWithActionsStore.setType(EnumProductStore.CAR);
    };
    const handleRightClick = () => {
        onChangeTheme("primary-bike");
        headerWithActionsStore.setType(EnumProductStore.MOTORBIKE);
    };

    useEffect(() => {
        const dispose = reaction(
            () => headerWithActionsStore.type,
            (type) => {
                if (type === EnumProductStore.CAR) {
                    onChangeTheme("primary-car");
                    document.documentElement.style.setProperty(
                        `--primary-hover`,
                        "var(--primary-car)"
                    );
                } else if (type === EnumProductStore.MOTORBIKE) {
                    onChangeTheme("primary-bike");
                    document.documentElement.style.setProperty(
                        `--primary-hover`,
                        "var(--primary-bike)"
                    );
                }
            },
            {
                fireImmediately: true,
            }
        );

        return () => {
            dispose();
        };
    }, []);

    return (
        <div className="header_action xl:!flex lg:!flex md:!hidden sm:!hidden hidden">
            {/* <!-- Left Content --> */}
            <button
                style={{
                    backgroundColor:
                        theme === "primary-car" ? `var(--${theme})` : null,
                }}
                className="left-content"
                type="button"
            >
                <Link href="/" onClick={handleLeftClick}>
                    <Image
                        alt="oto"
                        src="/images/icon/car.png"
                        width={30}
                        height={30}
                        className="me-3"
                    />
                    <span>Ô TÔ TẢI</span>
                </Link>
            </button>

            {/* <!-- Center Logo --> */}
            <div className="flex justify-center items-center">
                <Link href="/" onClick={handleLeftClick}>
                    <img
                        src="/images/logo.png"
                        alt="header-logo"
                        className="object-cover w-[120px] h-[40px]"
                    />
                </Link>
            </div>

            {/* <!-- Right Content --> */}
            <button
                className="right-content"
                style={{
                    backgroundColor:
                        theme === "primary-bike" ? `var(--${theme})` : null,
                }}
            >
                <Link href="/home-motorbike" onClick={handleRightClick}>
                    <Image
                        alt="motor"
                        src={"/images/icon/scooter.png"}
                        width={30}
                        height={30}
                        className="me-2"
                    />
                    <span>XE MÁY ĐIỆN</span>
                </Link>
            </button>
        </div>
    );
});
