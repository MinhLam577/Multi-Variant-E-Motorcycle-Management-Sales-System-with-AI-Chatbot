import { ConfigProvider } from "antd";
import { ReactNode } from "react";

interface CustomizeButtonProps {
    children: ReactNode;
    colorText?: string;
    defaultBg?: string;
    defaultHoverBg?: string;
    defaultHoverColor?: string;
    defaultActiveBg?: string;
    defaultActiveColor?: string;
    defaultActiveBorderColor?: string;
    token?: Record<string, any>;
    [key: string]: any; // cho phép các props khác như ...res
}

export const CustomizeButton = ({
    children,
    colorText,
    defaultBg,
    defaultHoverBg,
    defaultHoverColor,
    defaultActiveBg,
    defaultActiveColor,
    defaultActiveBorderColor,
    token,
    ...res
}: CustomizeButtonProps) => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        ...res,
                        defaultBg: defaultBg || "var(--primary-blue-color)",
                        colorText: colorText || "white",
                        defaultHoverBg:
                            defaultHoverBg ||
                            "color-mix(in srgb, var(--primary-blue-color) 85%, transparent)",
                        defaultHoverColor: defaultHoverColor || "white",
                        defaultActiveBg:
                            defaultActiveBg || "var(--primary-blue-color)",
                        defaultActiveColor: defaultActiveColor || "white",
                        defaultActiveBorderColor:
                            defaultActiveBorderColor ||
                            "var(--primary-blue-color)",
                    },
                },
                token: {
                    ...token,
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
};
