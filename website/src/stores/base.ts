import { AccountObservable } from "./account";
import BrandObservable from "./brand";
import LoginObservable from "./login";
import ProductObservable from "./productStore";
import UploadImageObservable from "./uploadImage";
import UserObservable from "./user";
import OrderObservable from "./order.store";
import PaymentMethodObservable from "./paymentMethod";
import SkusObservable from "./skus";
import BlogsObservable from "./blog";
export type paginationData = {
  current: number;
  pageSize: number;
};
import VoucherObservable from "./voucher.store";
import SettingObservable from "./setting";
import CartObservable from "./cart";
import CategoryObservable from "./categories";
import AddressObservable from "./address";
import DeliveryObservable from "./delivery";
export class RootStore {
  paymentMethodObservable: PaymentMethodObservable;
  orderObservable: OrderObservable;
  accountObservable: AccountObservable;
  loginObservable: LoginObservable;
  userObservable: UserObservable;
  uploadImageObservable: UploadImageObservable;
  brandObservable: BrandObservable;
  productObservable: ProductObservable;

  skusObservable: SkusObservable;
  voucherObservable: VoucherObservable;
  settingObservable: SettingObservable;
  blogsObservable: BlogsObservable;
  cartObservable: CartObservable;
  categoryObservable: CategoryObservable;
  addressObservable: AddressObservable;
  deliveryObservable: DeliveryObservable;
  constructor() {
    this.paymentMethodObservable = new PaymentMethodObservable(this);
    this.skusObservable = new SkusObservable(this);
    this.orderObservable = new OrderObservable(this);
    this.accountObservable = new AccountObservable();
    this.loginObservable = new LoginObservable(this);
    this.userObservable = new UserObservable(this);

    this.brandObservable = new BrandObservable(this);
    this.productObservable = new ProductObservable(this);

    this.voucherObservable = new VoucherObservable(this);
    this.settingObservable = new SettingObservable(this);
    this.blogsObservable = new BlogsObservable(this);
    this.cartObservable = new CartObservable(this);
    this.categoryObservable = new CategoryObservable(this);
    this.addressObservable = new AddressObservable(this);
    this.deliveryObservable = new DeliveryObservable(this);
  }
}
