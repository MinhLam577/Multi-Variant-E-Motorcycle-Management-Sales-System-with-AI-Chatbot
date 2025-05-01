"use client";
import { useLocalObservable } from "mobx-react-lite";
import PropTypes from "prop-types";
import { createContext, useContext } from "react";
import { RootStore } from "./base";
const StoreContext = createContext(null);
export const StoreProvider = ({ children }) => {
  //một observable object.
  const store = useLocalObservable(() => new RootStore());
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

StoreProvider.propTypes = {
  children: PropTypes.any,
};

export const useStore = () => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};
