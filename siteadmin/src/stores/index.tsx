import { createContext, useContext } from "react";
import { RootStore } from "./base";
const rootStore = new RootStore();
const StoreContext = createContext<RootStore | null>(null);
export const StoreProvider = ({ children }) => {
    return (
        <StoreContext.Provider value={rootStore}>
            {children}
        </StoreContext.Provider>
    );
};
export const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error("useStore must be used within a StoreProvider.");
    }
    return store;
};
