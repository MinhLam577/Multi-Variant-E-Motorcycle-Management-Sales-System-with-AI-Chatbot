import { Base64 } from "js-base64";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router";
import secureLocalStorage from "react-secure-storage";
import { keyStorageAccount } from "../constants";
import { useStore } from "../stores";

const AuthContext = createContext();

const AuthProvider = observer(({ children }) => {
  const { accountObservable } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    getLocal();
  }, [accountObservable?.account]);

  const getLocal = () => {
    const dataEncoded = secureLocalStorage.getItem(keyStorageAccount);
    if (!dataEncoded) return null;
    const value = Base64.decode(dataEncoded);
    const jsonValue = JSON.parse(value);
    return jsonValue;
  };

  const loginAction = useCallback(async () => {
    navigate("/");
  }, [navigate]);

  const logOut = useCallback(async () => {
    await accountObservable.clearAccount();
    navigate("/login");
  }, [accountObservable, navigate]);

  const value = useMemo(
    () => ({
      user: getLocal(),
      loginAction,
      logOut,
    }),
    [accountObservable, loginAction, logOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
