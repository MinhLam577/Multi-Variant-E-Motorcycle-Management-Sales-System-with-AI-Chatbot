import {
    action,
    flow,
    makeAutoObservable,
    makeObservable,
    observable,
} from "mobx";
import apiClient from "../api/apiClient";
import endpoints from "../api/endpoints";
import { SUCCESS_STATUSES } from "../constants";
import { RootStore } from "./base";

class ProductObservable {
    status: number = SUCCESS_STATUSES[0];
    errorMessage: string = "";
    successMessage: string = "";
    showSuccessMessage: boolean = false;
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    setStatusMessage(
        status: number,
        errorMessage: string,
        successMessage: string,
        showSuccess: boolean = false
    ) {
        if (status) this.status = status;
        if (errorMessage) this.errorMessage = errorMessage;
        if (successMessage) this.successMessage = successMessage;
        this.showSuccessMessage = showSuccess;
    }
}

export default ProductObservable;
