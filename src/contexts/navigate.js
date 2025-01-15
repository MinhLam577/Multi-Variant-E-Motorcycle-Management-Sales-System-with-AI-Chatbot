// NavigateContext.js
import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Tạo Context
const NavigateContext = createContext(null);

// Custom hook để lấy navigate
export const useNavigateContext = () => useContext(NavigateContext);

// Provider cho toàn ứng dụng
export const NavigateProvider = ({ children }) => {
  const navigate = useNavigate();

  const handleError404 = (originalRequest, respData) => {
    console.log("originalRequest", originalRequest);
    navigate("/404");
    return;
  };

  return (
    <NavigateContext.Provider value={{ navigate, handleError404 }}>
      {children}
    </NavigateContext.Provider>
  );
};

// Add PropTypes validation
NavigateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
