import { makeAutoObservable, toJS } from "mobx";
import { RootStore } from "./base";
import SkusAPI from "../api/skus";
import { SUCCESS_STATUSES } from "src/constants";
import { ResponsePromise } from "src/api";
import { DetailImportResponseType } from "./imports.store";

export type SkusDetailImportResponseType = {
    id: string;
    detail_import: DetailImportResponseType[];
};
export default class SkusObservable {
    status: number = null;
    errorMsg: string = "";
    successMsg: string = "";
    showSuccessMsg: boolean = false;
    rootStore: RootStore;
    data: {
        detail_imports: SkusDetailImportResponseType[];
    } = {
        detail_imports: [],
    };

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        this.getDetailImportsByIds = this.getDetailImportsByIds.bind(this);
        this.setStatusMessage = this.setStatusMessage.bind(this);
        this.clearStatusMessage = this.clearStatusMessage.bind(this);
    }

    *getDetailImportsByIds(ids: string[]) {
        try {
            const response: ResponsePromise =
                yield SkusAPI.getDetailImportsByIds(ids);
            const { status, message, data } = response;
            if (SUCCESS_STATUSES.includes(status)) {
                this.status = status;
                this.data.detail_imports = data;
                this.successMsg = message;
            } else {
                this.status = status;
                this.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.status = 500;
            this.errorMsg = "Error fetching data";
        }
    }

    setStatusMessage(
        status: number,
        successMsg: string,
        errorMsg: string,
        showSuccessMsg: boolean = false
    ) {
        this.status = status;
        if (successMsg) {
            this.successMsg = successMsg;
        }
        if (errorMsg) {
            this.errorMsg = errorMsg;
        }
        this.showSuccessMsg = showSuccessMsg;
    }
    clearStatusMessage() {
        this.showSuccessMsg = false;
        this.status = null;
        this.successMsg = "";
        this.errorMsg = "";
    }
}
