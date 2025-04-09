import AccountObservable from "./account";
import BrandObservable from "./brand";
import LoginObservable from "./login";
import EMotorbikeObservable from "./motorbike";
import ProductObservable from "./productStore";
import UploadImageObservable from "./uploadImage";
import UserObservable from "./user";
import OrderObservable from "./order";
import PaymentMethodObservable from "./paymentMethod";
import SkusObservable from "./skus";

export type paginationData = {
  current: number;
  pageSize: number;
};
import VoucherObservable from "./voucher";
import SettingObservable from "./setting";
export class RootStore {
  paymentMethodObservable: PaymentMethodObservable;
  orderObservable: OrderObservable;
  accountObservable: AccountObservable;
  loginObservable: LoginObservable;
  userObservable: UserObservable;
  uploadImageObservable: UploadImageObservable;
  brandObservable: BrandObservable;
  productObservable: ProductObservable;
  motorbikeObservable: EMotorbikeObservable;
  skusObservable: SkusObservable;
  voucherObservable: VoucherObservable;
  settingObservable: SettingObservable;
  constructor() {
    this.paymentMethodObservable = new PaymentMethodObservable(this);
    this.skusObservable = new SkusObservable(this);
    this.orderObservable = new OrderObservable(this);
    this.accountObservable = AccountObservable;
    this.loginObservable = new LoginObservable(this);
    this.userObservable = new UserObservable(this);
    this.uploadImageObservable = new UploadImageObservable(this);
    this.brandObservable = new BrandObservable(this);
    this.productObservable = new ProductObservable(this);
    this.motorbikeObservable = new EMotorbikeObservable(this);
    this.voucherObservable = new VoucherObservable(this);
    this.settingObservable = new SettingObservable(this);
  }
}
