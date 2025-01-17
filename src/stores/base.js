import AccountObservable from "./account";
import BrandObservable from "./brand";
import LoginObservable from "./login";
import ProductObservable from "./product";
import UploadImageObservable from "./uploadImage";
import UserObservable from "./user";

export class RootStore {
  constructor() {
    this.accountObservable = AccountObservable;
    this.loginObservable = new LoginObservable(this);
    this.userObservable = new UserObservable(this);
    this.uploadImageObservable = new UploadImageObservable(this);
    this.brandObservable = new BrandObservable(this);
    this.productObservable = new ProductObservable(this);
  }
}
