"use client";
import Aos from "aos";
import React, { useEffect } from "react";
import { Montserrat } from "next/font/google";
import "../node_modules/react-modal-video/scss/modal-video.scss";
import "aos/dist/aos.css";
import "../public/scss/main.scss";
import ScrollToTop from "./components/common/ScrollTop";
import styled from "styled-components";
import ThemeProvider from "@/app/layout/ThemeContext";
import { StoreProvider } from "@/src/stores";
import "./globals.css";
if (typeof window !== "undefined") {
  import("bootstrap");
}

const montserrat = Montserrat({ subsets: ["latin"] });

const Body = styled.body`
  font-family: ${montserrat.family};
  font-size: ${montserrat.fontSize};
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
    <html lang="en">
      <ThemeProvider>
        <Body>
          <StoreProvider>
            {children}
            <ScrollToTop />
          </StoreProvider>
        </Body>
      </ThemeProvider>
    </html>
  );
}
