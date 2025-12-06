"use client";
import Aos from "aos";
import React, { Suspense, useEffect } from "react";
import "../node_modules/react-modal-video/scss/modal-video.scss";
import "aos/dist/aos.css";
import "../public/scss/main.scss";
import ScrollToTop from "./components/common/ScrollTop";
import styled from "styled-components";
import ThemeProvider from "@/context/theme.context";
import { StoreProvider } from "@/context/store.context";
import "./globals.css";
import Chatbox from "./(pages)/chatbot/page";
import AuthProvider from "@/context/auth.context";
if (typeof window !== "undefined") {
    import("bootstrap");
}

const Body = styled.body`
    margin: 0;
    padding: 0;
`;

export default function RootLayout({ children }) {
    useEffect(() => {
        Aos.init({
            duration: 1200,
        });
    }, []);

    return (
        <html lang="en" suppressHydrationWarning={true}>
            <ThemeProvider>
                <StoreProvider>
                    <AuthProvider>
                        <Body>
                            <Suspense>{children}</Suspense>
                            <ScrollToTop />
                            <Chatbox />
                        </Body>
                    </AuthProvider>
                </StoreProvider>
            </ThemeProvider>
        </html>
    );
}
