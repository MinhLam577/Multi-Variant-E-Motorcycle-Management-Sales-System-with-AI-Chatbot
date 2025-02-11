import { Tree } from "antd";
import { useEffect, useState } from "react";
import UserDetailInTree from "./trees/UserDetailInTree";

const UserTree = () => {
  const [selectedUserInfo, setSelectedUserInfo] = useState();
  const [userTreeData, setUserTreeData] = useState([]);

  useEffect(() => {
    getAdmin();
  }, []);

  const updateTreeData = (list, key, children) =>
    list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

  const onLoadData = async ({ key }) => {};

  const getAdmin = async () => {
    // setSelectedUserInfo(res.data?.user);
    // setUserTreeData([
    //   {
    //     title: (
    //       <UserTreeNode
    //         user={res.data?.user}
    //         handleSelect={onLoadData}
    //         getUserMonthIncome={() => {}}
    //         refetch={() => {}}
    //         data={{}}
    //       />
    //     ),
    //     key: ADMIN_ID,
    //   },
    // ]);
  };

  if (!userTreeData.length) {
    return "Loading...";
  }

  return (
    <div className="my-4 grid grid-cols-2 gap-4">
      <Tree expandAction loadData={onLoadData} treeData={userTreeData} />
      <UserDetailInTree userInfo={selectedUserInfo} />
    </div>
  );
};
export default UserTree;
