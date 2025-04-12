import { useEffect, useState } from "react";
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
  //set default: hideChildren = false => vẫn render children
  // hideChildren = true => ko render children, ví dụ hide button (button này check quyền)
  const { permission, hideChildren = false } = props;
  const [allow, setAllow] = useState<boolean>(true);
  console.log("oki");
  //   const permissions = useAppSelector((state) => state.account.user.permissions);
  const Store = useStore();
  const AccountStore = Store.accountObservable;
  useEffect(() => {
    AccountStore.getAccount();
  }, []);
  const permissions = AccountStore.account?.permissions || [];

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
