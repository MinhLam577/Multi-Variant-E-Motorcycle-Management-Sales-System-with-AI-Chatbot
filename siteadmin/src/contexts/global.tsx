import { createContext, useEffect, useReducer } from "react";
import { useStore } from "../stores";

const initValue = {
    isInitialized: true,
    isAuthenticated: false,
    user: null,
    name: null,
};
export const GlobalContext = createContext(null);
export const NavigateContext = createContext(null);

const GlobalReducer = (state, { type, data }) => {
    switch (type) {
        case "login": {
            if (state && data) {
                return {
                    ...state,
                    user: data,
                    isAuthenticated: true,
                    isInitialized: false,
                };
            }
            return { ...state, isAuthenticated: false, isInitialized: false };
        }
        case "update": {
            if (state && state.user.userId) {
                return { ...state, user: data };
            }
            return state;
        }
        case "logout": {
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isInitialized: false,
            };
        }
        case "breadcrum": {
            return { ...state, name: data };
        }
        default: {
            return state;
        }
    }
};
const GlobalProvider = ({ children }) => {
    const { accountObservable } = useStore();
    const [state, dispatch] = useReducer(GlobalReducer, initValue);

    useEffect(() => {
        const init = async () => {
            const account = await accountObservable.getAccount();
            if (account?.access_token) {
                dispatch({ type: "login", data: account });
            } else {
                dispatch({ type: "logout", data: null });
            }
        };
        init();
    }, []);

    return (
        <GlobalContext.Provider value={{ ...state, globalDispatch: dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
