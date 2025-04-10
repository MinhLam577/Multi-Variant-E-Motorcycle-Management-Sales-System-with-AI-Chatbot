import AccountObservable from "./account";
import BrandObservable from "./brand.store";
import LoginObservable from "./login";
import EMotorbikeObservable from "./motorbike";
import ProductObservable from "./product.store";
import UploadImageObservable from "./uploadImage";
import UserObservable from "./user";
import OrderObservable from "./order.store";
import PaymentMethodObservable from "./paymentMethod";
import SkusObservable from "./skus";
import CategoriesObservable from "./categories.store";

export type paginationData = {
    current: number;
    pageSize: number;
};
export interface MessageStore {
    status?: number;
    errorMsg?: string;
    successMsg?: string;
    showSuccessMsg?: boolean;
    clearMessage: () => void;
    setStatusMessage: (
        status: number,
        errorMsg: string,
        successMsg: string
    ) => void;
}
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
    categoriesObservable: CategoriesObservable;
    constructor() {
        this.categoriesObservable = new CategoriesObservable(this);
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
    }
}
