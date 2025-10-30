import { useLocalObservable } from "mobx-react-lite";
import { createContext, useContext } from "react";
import { RootStore } from "./base";

const StoreContext = createContext<RootStore | null>(null);
export const StoreProvider = ({ children }) => {
    //một observable object.
    const store = useLocalObservable(() => new RootStore());
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};
export const useStore = () => {
    const store = useContext(StoreContext);

    if (!store) {
        throw new Error("useStore must be used within a StoreProvider.");
    }
    return store;
};
