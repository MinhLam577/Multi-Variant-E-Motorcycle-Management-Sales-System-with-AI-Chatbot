"use client";
import { createContext, useMemo, useReducer } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const reducer = (prevState, action) => {
    switch (action.type) {
      case "ON_CHANGE_THEME":
        return { ...prevState, theme: action.token };
      default:
        return prevState;
    }
  };

  const initialState = { theme: "primary-car" };
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChangeTheme = useMemo(
    () => (val) => dispatch({ type: "ON_CHANGE_THEME", token: val }),
    []
  );

  return (
    <ThemeContext.Provider value={{ theme: state.theme, onChangeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export { ThemeContext };
export default ThemeProvider;
