// NavigateContext.js
import PropTypes from "prop-types";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Tạo Context
const NavigateContext = createContext(null);

// Custom hook để lấy navigate
export const useNavigateContext = () => useContext(NavigateContext);

// Provider cho toàn ứng dụng
export const NavigateProvider = ({ children }) => {
  const navigate = useNavigate();

  return (
    <NavigateContext.Provider value={{ navigate }}>
      {children}
    </NavigateContext.Provider>
  );
};

// Add PropTypes validation
NavigateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
