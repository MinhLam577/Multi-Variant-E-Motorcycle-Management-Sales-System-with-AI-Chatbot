import { flow, makeAutoObservable } from "mobx";

export const makeAutoFlow = <T extends object>(
    obj: T,
    config: object = { autoBind: true }
) => {
    const flowMap: Record<string, any> = {};
    const proto = Object.getPrototypeOf(obj);
    Object.getOwnPropertyNames(proto).forEach((key) => {
        if (key === "constructor") return;
        const desc = Object.getOwnPropertyDescriptor(proto, key);
        const value = desc?.value;
        if (
            typeof value === "function" &&
            value?.constructor?.name === "GeneratorFunction"
        ) {
            flowMap[key] = flow;
        }
    });
    makeAutoObservable(obj, flowMap, config);
};
