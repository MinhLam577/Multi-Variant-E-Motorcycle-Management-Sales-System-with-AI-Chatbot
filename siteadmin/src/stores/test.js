import { makeAutoObservable } from "mobx";
import { RootStore } from "./base";

export default class TestObservable {
    status = "";
    rootStore;
    constructor(rootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    setStatus(status) {
        this.status = status;
    }
}
