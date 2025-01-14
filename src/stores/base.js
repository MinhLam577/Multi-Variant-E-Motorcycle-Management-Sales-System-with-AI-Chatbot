import AccountStore from "./account";
import LoginObservable from "./login";

export class RootStore {
  constructor() {
    this.accountObservable = new AccountStore(this);
    this.loginObservable = new LoginObservable(this);
  }
}
