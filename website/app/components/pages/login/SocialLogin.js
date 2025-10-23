"use client";
import React from "react";
const SocialLogin = () => {
    const handleLoginGoogle = (url) => {
        console.log("Google url", process.env.NEXT_PUBLIC__URL_GOOGLE);
        window.location.href = url; // Gửi đến NestJS
    };
    const socialBtns = [
        {
            className: "btn btn_fb",
            iconClass: "fab fa-facebook-f",
            text: "Log In via Facebook",
            link: process.env.NEXT_PUBLIC__URL_FACEBOOK,
        },
        {
            className: "btn btn_google",
            iconClass: "fab fa-google",
            text: "Log In via Google+",
            link: process.env.NEXT_PUBLIC__URL_GOOGLE,
        },
    ];

    return (
        <div className="social_btn">
            {socialBtns.map((btn, index) => (
                <React.Fragment key={index}>
                    <button
                        className={btn.className}
                        onClick={() => handleLoginGoogle(btn.link)}
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
