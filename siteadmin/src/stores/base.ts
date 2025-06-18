import AccountObservable from "./account.store";
import BrandObservable from "./brand.store";
import LoginObservable from "./login.store";
import ProductObservable from "./product.store";
import OrderObservable from "./order.store";
import PaymentMethodObservable from "./paymentMethod";
import SkusObservable from "./skus.store";
import CategoriesObservable from "./categories.store";

import VoucherObservable from "./voucher";
import SettingObservable from "./setting";
import WarehouseObservable from "./warehouse.store";
import { action, makeObservable, observable } from "mobx";
import OptionObservable from "./options.store";
import UserStaffObservable from "./user.store";
import ImportObservable from "./imports.store";
import ExportObservable from "./exports.store";
import UserObservable from "../stores/user";
import PermissionObservable from "./permission.store";
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

export type paginationData = {
    current: number;
    pageSize: number;
};

export class RootStore implements MessageStore {
    @observable status: number = null;
    @observable errorMsg: string = null;
    @observable successMsg: string = null;
    @observable showSuccessMsg: boolean = false;
    @observable loading: boolean = false;

    exportObservable: ExportObservable;
    importObservable: ImportObservable;
    userStaffObservable: UserStaffObservable;
    optionObservable: OptionObservable;
    paymentMethodObservable: PaymentMethodObservable;
    orderObservable: OrderObservable;
    accountObservable: typeof AccountObservable;
    loginObservable: LoginObservable;
    brandObservable: BrandObservable;
    productObservable: ProductObservable;
    skusObservable: SkusObservable;
    voucherObservable: VoucherObservable;
    settingObservable: SettingObservable;
    categoriesObservable: CategoriesObservable;
    warehouseObservable: WarehouseObservable;
    userObservable: UserObservable;
    permissionObservable: PermissionObservable;
    constructor() {
        makeObservable(this);
        this.permissionObservable = new PermissionObservable(this);
        this.userObservable = new UserObservable(this);
        this.exportObservable = new ExportObservable(this);
        this.importObservable = new ImportObservable(this);
        this.userStaffObservable = new UserStaffObservable(this);
        this.optionObservable = new OptionObservable(this);
        this.warehouseObservable = new WarehouseObservable(this);
        this.categoriesObservable = new CategoriesObservable(this);
        this.paymentMethodObservable = new PaymentMethodObservable(this);
        this.skusObservable = new SkusObservable(this);
        this.orderObservable = new OrderObservable(this);
        this.accountObservable = AccountObservable;
        this.loginObservable = new LoginObservable(this);
        this.brandObservable = new BrandObservable(this);
        this.productObservable = new ProductObservable(this);
        this.voucherObservable = new VoucherObservable(this);
        this.settingObservable = new SettingObservable(this);
    }

    @action
    clearMessage() {
        this.status = null;
        this.errorMsg = null;
        this.successMsg = null;
        this.showSuccessMsg = false;
    }

    @action
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

    @action
    setLoading(loading: boolean) {
        this.loading = loading;
    }
}
