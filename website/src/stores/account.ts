import { Base64 } from "js-base64";
import { action, makeObservable, observable, runInAction } from "mobx";
import secureLocalStorage from "react-secure-storage";
import { keyStorageAccount } from "../constants";

class AccountObservable {
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
            // // Chuyển object thành chuỗi JSON
            const jsonValue = JSON.stringify(data);
            // Mã hóa chuỗi JSON bằng Base64
            const dataEncoded = Base64.encode(jsonValue);
            // Lưu vào secureLocalStorage với key đã định nghĩa
            secureLocalStorage.setItem(keyStorageAccount, dataEncoded);

            // Cập nhật observable MobX (nếu bạn đang dùng MobX)

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

            const value = Base64.decode(String(dataEncoded));
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
export { AccountObservable };

//export default new AccountObservable();
