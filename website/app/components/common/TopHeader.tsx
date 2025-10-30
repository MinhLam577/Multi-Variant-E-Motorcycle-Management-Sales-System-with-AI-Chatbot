"use client";
import MovingSloganLeftToRight from "./SloganHeaderMovingLeftToRight";
import { observer } from "mobx-react-lite";
import { useTheme } from "@/context/theme.context";
const TopHeader = observer(() => {
    const { theme } = useTheme();
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
