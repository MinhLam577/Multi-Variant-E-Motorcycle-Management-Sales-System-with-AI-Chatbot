"use client";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
} from "react";
import { useStore } from "./store.context";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types/auth-validate.type";
import { observer } from "mobx-react-lite";
export type AuthContextType = {
    user: LoginResponse | null;
    isLoading: boolean;
    logIn: () => void;
    logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { accountObservable } = useStore();
    const router = useRouter();
    useEffect(() => {
        accountObservable.init();
    }, [accountObservable]);
    const logIn = () => {
        router.push("/");
    };

    const logOut = async () => {
        await accountObservable.clearAccount();
        router.push("/login");
    };

    const value = useMemo(
        () => ({
            user: accountObservable.account,
            isLoading: accountObservable.loadingAccount ?? true,
            logOut,
            logIn,
        }),
        [
            accountObservable.account,
            accountObservable.loadingAccount,
            logOut,
            logIn,
            router,
        ]
    );
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default observer(AuthProvider);
export const useAuth = (): AuthContextType => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("Vui lòng sử dụng auth context trong auth provider");
    }
    return auth;
};
