import { Base64 } from "js-base64";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import secureLocalStorage from "react-secure-storage";
import { keyStorageAccount } from "../constants";
import { PermissionResponseType } from "src/types/permission.type";

export class AccountObservable {
    loadingAccount: boolean = true;
    account = null;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    async init() {
        await this.getAccount();
    }
    // Hàm kiểm tra quyền
    checkPermission(permission: PermissionResponseType) {
        return this.account.permissions.find(
            (item) =>
                item.path === permission.path &&
                item.method === permission.method &&
                item.module === permission.module
        );
    }

    async setAccount(data) {
        try {
            const jsonValue = JSON.stringify(data);
            const dataEncoded = Base64.encode(jsonValue);
            secureLocalStorage.setItem(keyStorageAccount, dataEncoded);
            runInAction(() => {
                this.account = data;
            });
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

            const value = Base64.decode(dataEncoded as string);
            const jsonValue = JSON.parse(value);

            runInAction(() => {
                this.account = jsonValue;
            });

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

    get permissions() {
        this.getAccount();
        return toJS(this.account?.permissions || []);
    }
}

export default new AccountObservable();
