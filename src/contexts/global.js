import { createContext, useMemo, useReducer } from "react";
import { node } from "prop-types";

const initValue = {
  user: JSON.parse(localStorage.getItem("user")),
  isLogin: false,
  isLoading: true,
  token: localStorage.getItem("token"),
  success: {},
  name: "",
};
export const GlobalContext = createContext(initValue);

const GlobalReducer = (state, { type, data }) => {
  switch (type) {
    case "login": {
      if (state && !state.user.userId) {
        return { ...state, user: data };
      }
      return state;
    }
    case "update": {
      if (state && state.user.userId) {
        return { ...state, user: data };
      }
      return state;
    }
    case "logout": {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { ...state, user: data };
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
  const [state, dispatch] = useReducer(GlobalReducer, initValue);
  const providerValue = useMemo(
    () => ({ ...state, globalDispatch: dispatch }),
    [state, dispatch]
  );

  return (
    <GlobalContext.Provider value={providerValue}>
      {children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: node,
};

GlobalProvider.defaultProps = {
  children: null,
};

export default GlobalProvider;
