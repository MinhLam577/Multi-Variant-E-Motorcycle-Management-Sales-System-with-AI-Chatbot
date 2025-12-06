/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#006400",
            },
            keyframes: {
                slideUp: {
                    "0%": { transform: "translate3d(0, 100px, 0)", opacity: 0 },
                    "100%": { transform: "translateZ(0)", opacity: 1 },
                },
                slideLeftToRight: {
                    "0%": {
                        transform: "translate3d(-100px, 0, 0)",
                        opacity: 0,
                    },
                    "100%": { transform: "translateZ(0)", opacity: 1 },
                },
                slideRightToLeft: {
                    "0%": { transform: "translate3d(100px, 0, 0)", opacity: 0 },
                    "100%": { transform: "translateZ(0)", opacity: 1 },
                },
                slideDown: {
                    "0%": {
                        transform: "translate3d(0, -100px, 0)",
                        opacity: 0,
                    },
                    "100%": { transform: "translateZ(0)", opacity: 1 },
                },
            },
            animation: {
                slideLeftToRight: "slideLeftToRight 1s ease",
                slideRightToLeft: "slideRightToLeft 1s ease",
                slideUp: "slideUp 1s ease",
                slideDown: "slideDown 1s ease",
            },
        },
    },
    plugins: [],
};
