import { ConfigProvider } from "antd";
import PropTypes from "prop-types";
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
}) => {
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

CustomizeButton.propTypes = {
    children: PropTypes.node,
    colorText: PropTypes.string,
    defaultBg: PropTypes.string,
    defaultHoverBg: PropTypes.string,
    defaultHoverColor: PropTypes.string,
    defaultActiveBg: PropTypes.string,
    defaultActiveColor: PropTypes.string,
    defaultActiveBorderColor: PropTypes.string,
    token: PropTypes.object,
};
