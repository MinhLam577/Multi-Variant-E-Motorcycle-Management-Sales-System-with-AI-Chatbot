"use client";
import { useLocalObservable } from "mobx-react-lite";
import { createContext, useContext } from "react";
import { RootStore } from "@/src/stores/base";
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
        throw new Error("useStore phải được sử dụng trong StoreProvider.");
    }
    return store;
};
