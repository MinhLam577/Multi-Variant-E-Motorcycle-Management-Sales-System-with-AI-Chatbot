import { useLocalObservable } from "mobx-react-lite";
import PropTypes from "prop-types";
import { createContext, useContext } from "react";
import { RootStore } from "./base";

const storeContext = createContext(null);

export const StoreProvider = ({ children }) => {
  //một observable object.
  const store = useLocalObservable(() => new RootStore());
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

StoreProvider.propTypes = {
  children: PropTypes.any,
};

export const useStore = () => {
  const store = useContext(storeContext);

  if (!store) {
    throw new Error("useStore must be used within a StoreProvider.");
  }
  return store;
};
