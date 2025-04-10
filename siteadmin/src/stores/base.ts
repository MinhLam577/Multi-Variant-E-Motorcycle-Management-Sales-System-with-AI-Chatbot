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
import VoucherObservable from "./voucher";
import SettingObservable from "./setting";
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
export class RootStore implements MessageStore {
    status: number = null;
    errorMsg: string = null;
    successMsg: string = null;
    showSuccessMsg: boolean = false;

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
        this.voucherObservable = new VoucherObservable(this);
        this.settingObservable = new SettingObservable(this);
    }
    clearMessage() {
        this.status = null;
        this.errorMsg = null;
        this.successMsg = null;
        this.showSuccessMsg = false;
    }
    setStatusMessage(
        status: number,
        errorMsg: string,
        successMsg: string,
        showSuccessMsg: boolean = false
    ) {
        if (status) this.status = status;
        if (errorMsg) this.errorMsg = errorMsg;
        if (successMsg) this.successMsg = successMsg;
        this.showSuccessMsg = showSuccessMsg;
    }
}
