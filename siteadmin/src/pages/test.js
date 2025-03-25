import { useEffect } from "react";
import { useStore } from "../stores";
import { observer } from "mobx-react-lite";

export const TestComponent = observer(() => {
    const store = useStore();
    const { TestObservable, loginObservable } = store;
    const { status } = TestObservable;

    return (
        <div>
            Test Component: {status} <br />
            <button
                onClick={() => {
                    const randomUUID = Math.random().toString(36).substring(7);
                    console.log("randomUUID", randomUUID);
                    TestObservable.setStatus(randomUUID);
                }}
            >
                Change status
            </button>
        </div>
    );
});
