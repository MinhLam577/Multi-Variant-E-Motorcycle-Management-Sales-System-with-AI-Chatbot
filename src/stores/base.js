import AccountStore from "./account";

class RootStore {
  constructor() {
    this.account = new AccountStore();
  }
}

export default new RootStore();
