module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
                exclude: /@antv\/util/, // Bỏ qua thư viện @antv/util
            },
        ],
    },
};
