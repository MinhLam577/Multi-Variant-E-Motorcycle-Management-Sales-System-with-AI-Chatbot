import { AccountObservable } from "./account";
import BrandObservable from "./brand";
import LoginObservable from "./login";
import ProductObservable from "./product.store";
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
export class RootStore {
    paymentMethodObservable: PaymentMethodObservable;
    orderObservable: OrderObservable;
    accountObservable: AccountObservable;
    loginObservable: LoginObservable;
    userObservable: UserObservable;
    uploadImageObservable: UploadImageObservable;
    brandObservable: BrandObservable;
    productObservable: ProductObservable;

<<<<<<< HEAD
  skusObservable: SkusObservable;
  voucherObservable: VoucherObservable;
  settingObservable: SettingObservable;
  blogsObservable: BlogsObservable;
  cartObservable: CartObservable;
  categoryObservable: CategoryObservable
  constructor() {
    this.paymentMethodObservable = new PaymentMethodObservable(this);
    this.skusObservable = new SkusObservable(this);
    this.orderObservable = new OrderObservable(this);
    this.accountObservable = new AccountObservable();
    this.loginObservable = new LoginObservable(this);
    this.userObservable = new UserObservable(this);
=======
    skusObservable: SkusObservable;
    voucherObservable: VoucherObservable;
    settingObservable: SettingObservable;
    blogsObservable: BlogsObservable;
    cartObservable: CartObservable;
    constructor() {
        this.paymentMethodObservable = new PaymentMethodObservable(this);
        this.skusObservable = new SkusObservable(this);
        this.orderObservable = new OrderObservable(this);
        this.accountObservable = new AccountObservable();
        this.loginObservable = new LoginObservable(this);
        this.userObservable = new UserObservable(this);
>>>>>>> 5a89b1d563a8f342c5d034a075c2955e40431f66

        this.brandObservable = new BrandObservable(this);
        this.productObservable = new ProductObservable(this);

<<<<<<< HEAD
    this.voucherObservable = new VoucherObservable(this);
    this.settingObservable = new SettingObservable(this);
    this.blogsObservable = new BlogsObservable(this);
    this.cartObservable = new CartObservable(this);
    this.categoryObservable = new CategoryObservable(this);
  }
=======
        this.voucherObservable = new VoucherObservable(this);
        this.settingObservable = new SettingObservable(this);
        this.blogsObservable = new BlogsObservable(this);
        this.cartObservable = new CartObservable(this);
    }
>>>>>>> 5a89b1d563a8f342c5d034a075c2955e40431f66
}
