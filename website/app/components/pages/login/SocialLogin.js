"use client";
import { AUTH_URLS } from "@/src/config/api.config";
import React from "react";
const SocialLogin = () => {
    const handleLogin = (url) => {
        window.location.href = url;
    };
    const socialBtns = [
        // {
        //     className: "btn btn_fb",
        //     iconClass: "fab fa-facebook-f",
        //     text: "Log In via Facebook",
        //     link: AUTH_URLS.facebook,
        // },
        {
            className: "btn btn_google",
            iconClass: "fab fa-google",
            text: "Log In via Google+",
            link: AUTH_URLS.google,
        },
    ];

    return (
        <div className="social_btn">
            {socialBtns.map((btn, index) => (
                <React.Fragment key={index}>
                    <button
                        className={btn.className}
                        type="button"
                        onClick={() => handleLogin(btn.link)}
                    >
                        <span className={btn.iconClass} />
                        {btn.text}
                    </button>
                    <br />
                </React.Fragment>
            ))}
        </div>
    );
};

export default SocialLogin;
