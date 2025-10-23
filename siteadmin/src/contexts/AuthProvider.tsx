import { Base64 } from "js-base64";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from "react";
import { useNavigate } from "react-router";
import secureLocalStorage from "react-secure-storage";
import { keyStorageAccount } from "../constants";
import { useStore } from "../stores";

type AuthContext = {
    user: any;
    loginAction: () => void;
    logOut: () => void;
};

type AuthProviderProps = {
    children: ReactNode;
};
const AuthContext = createContext<AuthContext | null>(null);

const AuthProvider = observer(({ children }: AuthProviderProps) => {
    const { accountObservable } = useStore();
    const navigate = useNavigate();
    useEffect(() => {
        getLocal();
    }, [accountObservable?.account]);

    const getLocal = () => {
        const dataEncoded = secureLocalStorage.getItem(
            keyStorageAccount
        ) as string;
        if (!dataEncoded) return null;
        const value = Base64.decode(dataEncoded);
        const jsonValue = JSON.parse(value);
        return jsonValue;
    };

    const loginAction = useCallback(() => {
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

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
});

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
