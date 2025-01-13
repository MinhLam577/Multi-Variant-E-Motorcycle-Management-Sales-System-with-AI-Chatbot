import { action, makeObservable, observable } from "mobx";
import { Base64 } from "js-base64";
import secureLocalStorage from "react-secure-storage";
import _ from "lodash";
const keyStorageAccount = "account";
const keyStorageRole = "role";
import BaseAPI from "../api/apiClient";

class AccountStore {
  loadingAccount = true;
  account = null;
  roles = null;
  me = null;
  constructor() {
    makeObservable(this, {
      account: observable,
      me: observable,
      roles: observable,
      loadingAccount: observable,
      setAccount: action.bound,
      getAccount: action.bound,
      setRolesByMe: action,
      getRolesByMe: action,
      meChangPassword: action.bound,
      getMe: action.bound,
    });
  }

  //   async meChangPassword(args) {
  //     try {
  //       const res = await BaseAPI.changePassword(
  //         args?.oldPassword,
  //         args?.newPassword,
  //         args?.confirmationPassword
  //       ).catch((e) => e);
  //       return res;
  //     } catch (e) {
  //       return false;
  //     }
  //   }

  //   async setRolesByMe(data) {
  //     try {
  //       const jsonValue = JSON.stringify(data);
  //       const dataEndcode = Base64.encode(jsonValue);
  //       await secureLocalStorage.setItem(keyStorageRole, dataEndcode);
  //       return true;
  //     } catch (e) {
  //       return false;
  //     }
  //   }

  //   async getRolesByMe() {
  //     try {
  //       const dataEndcode = await secureLocalStorage.getItem(keyStorageRole);
  //       const value = Base64.decode(dataEndcode.toString());

  //       if (value !== null) {
  //         const jsonValue = JSON.parse(value);
  //         let data = {};
  //         await _.forEach(jsonValue, (ele) => {
  //           const key = _.replace(ele.module, ":index", "");
  //           data[key] = {
  //             bitwise: ele.bitwise,
  //             explain: ele.explain,
  //           };
  //         });
  //         this.roles = data;
  //         return data;
  //       } else {
  //         return false;
  //       }
  //     } catch (e) {
  //       return false;
  //     }
  //   }
  //   async getMe() {
  //     const res = await BaseAPI.getMe().catch(() => {});
  //     return res;
  //   }

  async setAccount(data) {
    try {
      const jsonValue = JSON.stringify(data);
      const dataEndcode = Base64.encode(jsonValue);
      secureLocalStorage.setItem(keyStorageAccount, dataEndcode);
      this.account = data;
      return true;
    } catch (e) {
      return false;
    }
  }

  async getAccount() {
    try {
      // const value = await localStorage.getItem("user");
      const dataEndcode = await secureLocalStorage.getItem(keyStorageAccount);
      const value = Base64.decode(dataEndcode.toString());
      if (value !== null) {
        const jsonValue = JSON.parse(value);
        this.account = jsonValue;
        return jsonValue;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}

export default AccountStore;
