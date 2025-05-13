import { makeAutoObservable, toJS } from "mobx";
import { MessageStore, paginationData, RootStore } from "./base";
import BrandAPI from "src/api/brand.api";
import WarehouseAPI from "src/api/warehouse.api";

export type warehouseResponseType = {
    id: string;
    name: string;
    address: string;
    description: string;
    created_at: string;
    updated_at: string;
};

class WarehouseObservable {
    rootStore: RootStore;
    pagination: paginationData = {
        current: 1,
        pageSize: 100,
    };
    data: warehouseResponseType[] = [];
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    *getListWarehouse() {
        try {
            const response = yield WarehouseAPI.getAllWarehouses();
            const { data, status, message } = response;
            const success_status = [200, 201, 204];
            if (success_status.includes(status)) {
                this.data = data;
                this.rootStore.status = status;
                this.rootStore.successMsg = message;
            } else {
                this.rootStore.status = status;
                this.rootStore.errorMsg = message;
            }
        } catch (e: any) {
            console.error(e);
            this.rootStore.status = 500;
            this.rootStore.errorMsg = e?.message || "Lỗi không xác định";
        }
    }
}

export default WarehouseObservable;
