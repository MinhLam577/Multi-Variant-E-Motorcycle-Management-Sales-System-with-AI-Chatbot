import { makeAutoObservable, flow } from "mobx";

export const makeAutoFlow = <T extends object>(
    target: T,
    overrides: Record<string, any> = {},
    config: { autoBind?: boolean } = { autoBind: true }
) => {
    const flowMap: Record<string, typeof flow> = { ...overrides };
    const proto = Object.getPrototypeOf(target);

    for (const key of Object.getOwnPropertyNames(proto)) {
        if (key === "constructor") continue;
        const value = (proto as any)[key];
        if (
            typeof value === "function" &&
            Object.prototype.toString.call(value) ===
                "[object GeneratorFunction]"
        ) {
            flowMap[key] = flow;
        }
    }

    makeAutoObservable(target, flowMap, config);
};
