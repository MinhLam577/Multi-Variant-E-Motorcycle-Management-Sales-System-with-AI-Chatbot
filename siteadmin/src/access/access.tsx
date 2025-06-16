import { useEffect, useMemo, useState } from "react";
import { Result } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "src/stores";
import { toJS } from "mobx";
interface IProps {
    hideChildren?: boolean;
    children: React.ReactNode;
    permission: { method: string; path: string; module: string };
}

const Access = observer((props: IProps) => {
    const { permission, hideChildren = false } = props;
    const [allow, setAllow] = useState<boolean>(true);
    const store = useStore();
    const loginObservable = store.loginObservable;
    const AccountStore = store.accountObservable;
    // Lấy permissions từ store, tránh object mới mỗi lần
    const permissions = useMemo(() => {
        return toJS(AccountStore.account?.permissions || []);
    }, [AccountStore.account?.permissions]);

    useEffect(() => {
        const fetchData = async () => {
            if (!AccountStore.account?.email) {
                await AccountStore.getAccount();
            }
            if (!AccountStore.account?.permissions?.length) {
                await loginObservable.getAccountApi(AccountStore.account.email);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (permissions?.length) {
            if (
                !permission ||
                !permission.path ||
                !permission.method ||
                !permission.module
            ) {
                setAllow(true);
                return;
            }
            const check = permissions?.find(
                (item) =>
                    item?.path === permission.path &&
                    item?.method === permission.method &&
                    item?.module === permission.module
            );
            if (check) {
                setAllow(true);
            } else setAllow(false);
        }
    }, [permissions]);

    return (
        <>
            {allow === true ? (
                <>{props.children}</>
            ) : (
                <>
                    {hideChildren === false ? (
                        <Result
                            status="403"
                            title="Truy cập bị từ chối"
                            subTitle="Xin lỗi, bạn không có quyền hạn truy cập thông tin này"
                        />
                    ) : (
                        <>{/* render nothing */}</>
                    )}
                </>
            )}
        </>
    );
});

export default Access;
