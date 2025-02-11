"use client";
import { useContext } from "react";
import MainMenu from "../common/MainMenu";
import { ThemeContext } from "@/app/layout/ThemeContext";
const Header = () => {
  const value = useContext(ThemeContext);

  return (
    <header className="header-nav menu_style_home_one transparent main-menu" style={{borderTop: '1px solid white'}}>
      {/* Ace Responsive Menu */}
      <nav style={{ backgroundColor: `var(--${value.theme})` }}>
        <div className="container">
          {/* Menu Toggle btn*/}
          <div className="menu-toggle">
            <button type="button" id="menu-btn">
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
          </div>

          {/* Responsive Menu Structure*/}
          <ul
            id="respMenu"
            className="ace-responsive-menu text-center"
            data-menu-style="horizontal"
          >
            <MainMenu />
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
