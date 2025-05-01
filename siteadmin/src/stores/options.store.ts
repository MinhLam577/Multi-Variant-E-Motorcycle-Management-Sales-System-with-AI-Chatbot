import { makeAutoObservable, toJS } from "mobx";
import { RootStore } from "./base";
import OptionsAPI from "src/api/options.api";

type OptionType = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
};

class OptionObservable {
    data: OptionType[] = [];
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this, {}, { autoBind: true });
    }
    loading: boolean = false;
    *getListOptions() {
        try {
            const response = yield OptionsAPI.getAllOptions();
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

export default OptionObservable;
