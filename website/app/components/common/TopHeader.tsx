"use client";
import { useContext } from "react";
import MovingSloganLeftToRight from "./SloganHeaderMovingLeftToRight";
import { ThemeContext } from "@/app/layout/ThemeContext";
import { observer } from "mobx-react-lite";
const TopHeader = observer(() => {
    const { theme } = useContext(ThemeContext);
    return (
        <div
            className={`py-[15px]`}
            style={{
                backgroundColor: `var(--${theme})`,
            }}
        >
            <div className="wrap_content flex justify-center items-center">
                <MovingSloganLeftToRight
                    description="Chào mừng đến với minhdeptrai.com - Trang web thương mại điện tử hàng đầu VN"
                    className={`!bg-[var(--${theme})]`}
                />
            </div>
        </div>
    );
});

export default TopHeader;
