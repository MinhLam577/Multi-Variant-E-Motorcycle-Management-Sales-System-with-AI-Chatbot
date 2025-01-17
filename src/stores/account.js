import { Base64 } from "js-base64";
import { makeAutoObservable, makeObservable, action, observable } from "mobx";
import secureLocalStorage from "react-secure-storage";
import { keyStorageAccount } from "../constants";

export class AccountObservable {
  loadingAccount = true;
  account = null;
  roles = null;
  me = null;

  // constructor() {
  //   makeAutoObservable(this);
  // }
  constructor() {
    makeObservable(this, {
      setAccount: action.bound,
      getAccount: action.bound,
      account: observable,
    });
  }

  async setAccount(data) {
    console.log("updateNewToken-setAccount", data);

    try {
      const jsonValue = JSON.stringify(data);
      const dataEndcode = Base64.encode(jsonValue);
      secureLocalStorage.setItem(keyStorageAccount, dataEndcode);
      this.account = data;
      return data;
    } catch (e) {
      return null;
    }
  }

  async getAccount() {
    try {
      const dataEndcode = await secureLocalStorage.getItem(keyStorageAccount);
      const value = Base64.decode(dataEndcode.toString());
      if (value !== null) {
        const jsonValue = JSON.parse(value);
        this.account = jsonValue;
        return jsonValue;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  async clearAccount() {
    secureLocalStorage.removeItem(keyStorageAccount);
    this.account = null;
  }
}

export default new AccountObservable();
