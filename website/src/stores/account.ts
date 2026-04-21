// import { Base64 } from "js-base64";
// import secureLocalStorage from "react-secure-storage";
// import { keyStorageAccount } from "../constants";
// import { makeAutoFlow } from "@/utils/mobx-func.utils";
// import { LoginResponse } from "@/types/auth-validate.type";

// class AccountObservable {
//     loadingAccount: boolean = true;
//     account: LoginResponse = null;

//     constructor() {
//         makeAutoFlow<AccountObservable>(this);
//     }

//     *init() {
//         const existing = yield this.init();
//         if (existing) {
//             this.account = existing;
//         }
//         return existing;
//     }

//     *setAccount(data: LoginResponse, remember?: boolean) {
//         try {
//             this.loadingAccount = true;
//             const jsonValue = JSON.stringify(data);
//             const dataEncoded = Base64.encode(jsonValue);
//             if (remember) {
//                 secureLocalStorage.setItem(keyStorageAccount, dataEncoded);
//                 sessionStorage.removeItem(keyStorageAccount);
//             } else {
//                 sessionStorage.setItem(keyStorageAccount, dataEncoded);
//                 secureLocalStorage.removeItem(keyStorageAccount);
//             }
//             this.account = data;
//             return data;
//         } catch (e) {
//             console.error("Error setting account:", e);
//             return null;
//         } finally {
//             this.loadingAccount = false;
//         }
//     }

//     *getAccount(): Generator<any, LoginResponse | null, unknown> {
//         try {
//             this.loadingAccount = true;
//             if (this.account) return this.account;
//             const dataEncoded =
//                 secureLocalStorage.getItem(keyStorageAccount) ||
//                 sessionStorage.getItem(keyStorageAccount) ||
//                 null;
//             if (!dataEncoded) {
//                 return null;
//             }
//             const decoded = Base64.decode(String(dataEncoded));
//             const jsonValue = JSON.parse(decoded) as LoginResponse;
//             this.account = jsonValue;
//             return jsonValue;
//         } catch (e) {
//             console.error("Error getting account:", e);
//             return null;
//         } finally {
//             this.loadingAccount = false;
//         }
//     }

//     *clearAccount() {
//         try {
//             secureLocalStorage.removeItem(keyStorageAccount);
//             sessionStorage.removeItem(keyStorageAccount);
//             this.account = null;
//             this.loadingAccount = false;
//         } catch (e) {
//             console.error("Error clearing account:", e);
//         }
//     }
// }
// export { AccountObservable };

import { makeAutoObservable, runInAction } from "mobx";
import secureLocalStorage from "react-secure-storage";
import { Base64 } from "js-base64";
import { LoginResponse } from "@/types/auth-validate.type";
import { keyStorageAccount } from "../constants";

export class AccountObservable {
    account: LoginResponse | null = null;
    loadingAccount = true;

    constructor() {
        makeAutoObservable(this);
    }

    // 🔥 parse storage
    private parseStorage(): LoginResponse | null {
        try {
            const dataEncoded =
                secureLocalStorage.getItem(keyStorageAccount) ||
                sessionStorage.getItem(keyStorageAccount);

            if (!dataEncoded) return null;

            const decoded = Base64.decode(String(dataEncoded));
            return JSON.parse(decoded);
        } catch (e) {
            console.error("Parse account error:", e);
            return null;
        }
    }

    // 🔥 save storage
    private saveStorage(data: LoginResponse, remember = true) {
        const encoded = Base64.encode(JSON.stringify(data));

        if (remember) {
            secureLocalStorage.setItem(keyStorageAccount, encoded);
            sessionStorage.removeItem(keyStorageAccount);
        } else {
            sessionStorage.setItem(keyStorageAccount, encoded);
            secureLocalStorage.removeItem(keyStorageAccount);
        }
    }

    // 🔥 clear storage
    private clearStorage() {
        secureLocalStorage.removeItem(keyStorageAccount);
        sessionStorage.removeItem(keyStorageAccount);
    }

    // init app
    init() {
        this.loadingAccount = true;

        const data = this.parseStorage();

        runInAction(() => {
            this.account = data;
            this.loadingAccount = false;
        });

        return data;
    }

    // set account
    setAccount(data: LoginResponse, remember = true) {
        this.loadingAccount = true;

        try {
            this.saveStorage(data, remember);

            runInAction(() => {
                this.account = data;
            });

            return data;
        } catch (e) {
            console.error("Set account error:", e);
            return null;
        } finally {
            runInAction(() => {
                this.loadingAccount = false;
            });
        }
    }

    // update token (dùng cho refresh)
    updateAccessToken(newToken: string) {
        if (!this.account) return;

        const updated = {
            ...this.account,
            access_token: newToken,
        };

        this.saveStorage(updated, true);

        runInAction(() => {
            this.account = updated;
        });
    }

    // logout
    clearAccount() {
        this.clearStorage();

        runInAction(() => {
            this.account = null;
            this.loadingAccount = false;
        });
    }

    // getter tiện dụng
    get accessToken() {
        return this.account?.access_token || null;
    }

    get refreshToken() {
        return this.account?.refresh_token || null;
    }

    get isLoggedIn() {
        return !!this.account?.access_token;
    }
}
