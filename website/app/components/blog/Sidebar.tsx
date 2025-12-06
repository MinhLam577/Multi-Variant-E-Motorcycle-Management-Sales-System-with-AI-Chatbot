"use client";
import { useEffect, useState } from "react";
import Categories from "./sidebar-components/Categories";
import SearchWidget from "./sidebar-components/SearchWidget";
import "../../../public/css/sticky-padding-bottom.css";
const Sidebar = () => {
    const [isNearBottom, setIsNearBottom] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const sidebar = document.querySelector(".sticky");
            const sidebarHeight = (sidebar as HTMLElement)?.offsetHeight || 0;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY || window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight;

            // Kiểm tra khi cuộn gần đáy (khoảng 20px từ đáy)
            if (
                documentHeight - (scrollY + windowHeight) <
                20 + sidebarHeight
            ) {
                setIsNearBottom(true);
            } else {
                setIsNearBottom(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <div
            className={`blogCategory-sticky !top-5 ${
                isNearBottom ? "bottom-offset" : ""
            }`}
        >
            <div className="sidebar_search_widget">
                <h4 className="title">Search</h4>
                <SearchWidget />
            </div>

            <div className="terms_condition_widget">
                <h4 className="title mb20">Blog Categories</h4>
                <div className="widget_list">
                    <Categories />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
