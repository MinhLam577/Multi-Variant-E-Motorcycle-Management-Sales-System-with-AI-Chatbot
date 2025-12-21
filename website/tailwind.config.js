/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./layout/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: 0,
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1232px", // dùng làm max-width cho desktop lớn
                "2xl": "1232px", // để không phình rộng thêm trên màn lớn
            },
        },
        extend: {
            keyframes: {
                scrollTextStart: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-100%)" },
                },
                scrollTextEnd: {
                    from: { transform: "translateX(100%)" },
                    to: { transform: "translateX(0)" },
                },
            },
            animation: {
                scrollTextStart: "scrollTextStart 20s linear infinite",
                scrollTextEnd: "scrollTextEnd 20s linear infinite",
            },
        },
    },
    plugins: [],
};
