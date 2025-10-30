"use client";
import { createContext, useContext, useMemo, useReducer } from "react";

export const ON_CHANGE_THEME = "ON_CHANGE_THEME";
export type ThemeState = {
    theme: string;
};

export type ThemeAction = {
    type: typeof ON_CHANGE_THEME;
    token: string;
};
export type ThemeContextType = ThemeState & {
    onChangeTheme: (val: string) => void;
};
const initStoreContext: ThemeContextType = {
    theme: "primary-car",
    onChangeTheme: (val: string) => {},
};

const ThemeContext = createContext<ThemeContextType>(initStoreContext);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const reducer = (prevState: ThemeState, action: ThemeAction) => {
        switch (action.type) {
            case "ON_CHANGE_THEME":
                return { ...prevState, theme: action.token };
            default:
                return prevState;
        }
    };

    const initialState: ThemeState = { theme: "primary-car" };
    const [state, dispatch] = useReducer(reducer, initialState);

    const onChangeTheme = useMemo(
        () => (val: string) =>
            dispatch({ type: "ON_CHANGE_THEME", token: val }),
        []
    );

    return (
        <ThemeContext.Provider value={{ theme: state.theme, onChangeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
export const useTheme = () => {
    const theme = useContext(ThemeContext);
    if (!theme) throw new Error("useTheme phải được dùng trong ThemeProvider");
    return theme;
};
export default ThemeProvider;
