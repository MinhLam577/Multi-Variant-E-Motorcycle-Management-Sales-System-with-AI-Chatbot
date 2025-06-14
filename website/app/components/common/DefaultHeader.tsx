"use client";
import Link from "next/link";
import MainMenu from "./MainMenu";
import Image from "next/image";
import { headerWithActionsStore } from "./HeaderWidthActions";
import { EnumProductStore } from "@/src/stores/productStore";

const DefaultHeader = () => {
    return (
        <header className="header-nav menu_style_home_one home3_style main-menu hidden lg:block">
            {/* Ace Responsive Menu */}
            <nav>
                <div className="container posr">
                    {/* Menu Toggle btn*/}
                    <div className="menu-toggle">
                        <button type="button" id="menu-btn">
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                    </div>
                    <Link
                        href="/"
                        onClick={() => {
                            headerWithActionsStore.setType(
                                EnumProductStore.CAR
                            );
                        }}
                        className="navbar_brand float-start dn-md"
                    >
                        <Image
                            width={140}
                            height={45}
                            className="logo1 img-fluid"
                            src="/images/header-logo2.svg"
                            alt="header-logo.svg"
                        />
                    </Link>
                    {/* Responsive Menu Structure*/}
                    <ul
                        // id="respMenu"
                        className="ace-responsive-menu text-end"
                        data-menu-style="horizontal"
                    >
                        <MainMenu />
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default DefaultHeader;
