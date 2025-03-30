import { Base64 } from "js-base64";
import { action, makeObservable, observable, runInAction } from "mobx";
import secureLocalStorage from "react-secure-storage";
import { keyStorageAccount } from "../constants";

export class AccountObservable {
    loadingAccount = true;
    account = null;

    constructor() {
        makeObservable(this, {
            account: observable,
            loadingAccount: observable,
            setAccount: action.bound,
            getAccount: action.bound,
            clearAccount: action.bound,
            init: action.bound,
        });
    }

    async init() {
        await this.getAccount();
    }

    async setAccount(data) {
        try {
            const jsonValue = JSON.stringify(data);
            const dataEncoded = Base64.encode(jsonValue);
            secureLocalStorage.setItem(keyStorageAccount, dataEncoded);
            runInAction(() => {
                this.account = data;
            });

            // xí về check
            return data;
        } catch (e) {
            console.error("Error setting account:", e);
            return null;
        }
    }

    async getAccount() {
        try {
            const dataEncoded = secureLocalStorage.getItem(keyStorageAccount);
            if (!dataEncoded) return null;

            const value = Base64.decode(dataEncoded);
            const jsonValue = JSON.parse(value);

            this.account = jsonValue;

            return jsonValue;
        } catch (e) {
            console.error("Error getting account:", e);
            return null;
        }
    }

    async clearAccount() {
        secureLocalStorage.removeItem(keyStorageAccount);

        runInAction(() => {
            this.account = null;
        });
    }
}

export default new AccountObservable();
