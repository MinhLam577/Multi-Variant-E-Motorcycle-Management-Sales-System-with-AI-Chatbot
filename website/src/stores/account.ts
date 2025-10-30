import { Base64 } from "js-base64";
import secureLocalStorage from "react-secure-storage";
import { keyStorageAccount } from "../constants";
import { makeAutoFlow } from "@/utils/mobx-func.utils";
import { LoginResponse } from "@/types/auth-validate.type";

class AccountObservable {
    loadingAccount: boolean = true;
    account: LoginResponse = null;

    constructor() {
        makeAutoFlow<AccountObservable>(this);
    }

    *init() {
        const existing = yield this.getAccount();
        if (existing) {
            this.account = existing;
        }
        return existing;
    }

    *setAccount(data: LoginResponse) {
        try {
            const jsonValue = JSON.stringify(data);
            const dataEncoded = Base64.encode(jsonValue);
            secureLocalStorage.setItem(keyStorageAccount, dataEncoded);
            this.account = data;
            return data;
        } catch (e) {
            console.error("Error setting account:", e);
            return null;
        }
    }

    *getAccount(): Generator<any, LoginResponse | null, unknown> {
        try {
            if (this.account) return this.account;
            const dataEncoded = secureLocalStorage.getItem(keyStorageAccount);
            if (!dataEncoded) {
                return null;
            }
            const decoded = Base64.decode(String(dataEncoded));
            const jsonValue = JSON.parse(decoded) as LoginResponse;
            this.account = jsonValue;
            return jsonValue;
        } catch (e) {
            console.error("Error getting account:", e);
            return null;
        }
    }

    *clearAccount() {
        try {
            secureLocalStorage.removeItem(keyStorageAccount);
            this.account = null;
        } catch (e) {
            console.error("Error clearing account:", e);
        }
    }
}
export { AccountObservable };
