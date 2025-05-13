import { useEffect, useMemo, useState } from "react";
import { Result } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "src/stores";

// import { useAppSelector } from "@/redux/hooks";
interface IProps {
  hideChildren?: boolean;
  children: React.ReactNode;
  permission: { method: string; path: string; module: string };
}

const Access = observer((props: IProps) => {
  const { permission, hideChildren = false } = props;
  const [allow, setAllow] = useState<boolean>(true);
  //   const permissions = useAppSelector((state) => state.account.user.permissions);
  const Store = useStore();
  const { loginObservable } = useStore();
  const AccountStore = Store.accountObservable;
  // Lấy permissions từ store, tránh object mới mỗi lần
  const permissions = useMemo(() => {
    return AccountStore.account?.permissions || [];
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
    if (permissions.length) {
      const check = permissions.find(
        (item) =>
          item.path === permission.path &&
          item.method === permission.method &&
          item.module === permission.module
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
              subTitle="Xin lỗi, bạn không có quyền hạn (permission) truy cập thông tin này"
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
