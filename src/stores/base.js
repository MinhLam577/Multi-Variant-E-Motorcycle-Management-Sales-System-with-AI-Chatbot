import AccountStore from "./account";
import LoginObservable from "./login";
import UploadImageObservable from "./uploadImage";
import UserObservable from "./user";

export class RootStore {
  constructor() {
    this.accountObservable = new AccountStore(this);
    this.loginObservable = new LoginObservable(this);
    this.userObservable = new UserObservable(this);
    this.uploadImageObservable = new UploadImageObservable(this);
  }
}
