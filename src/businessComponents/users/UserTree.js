import { useEffect, useState } from 'react';
import { Tree } from 'antd';
import { useLazyQuery } from '@apollo/client';
import { GET_CHILDREN_USER } from '../../graphql/users';
import UserDetailInTree from './trees/UserDetailInTree';
import UserTreeNode from './trees/UserTreeNode';

const ADMIN_ID = 'HOFA000001';

const UserTree = () => {
  const [getChildren] = useLazyQuery(GET_CHILDREN_USER);
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

  const onLoadData = async ({ key }) => {
    const res = await getChildren({
      variables: {
        id: key
      }
    });
    
    setSelectedUserInfo(res.data?.user);

    setUserTreeData((origin) =>
      updateTreeData(origin, key, res.data?.user?.children?.map(i=> (
        {
          title: <UserTreeNode 
            user = {i}
            handleSelect={onLoadData}
          />,
          key: `${i.userId}`,
        }
      )))
    );
  }

  const getAdmin = async () => {
    const res = await getChildren({
      variables: {
        id: ADMIN_ID
      }
    });

    setSelectedUserInfo(res.data?.user);
    setUserTreeData([{
      title: <UserTreeNode 
        user = {res.data?.user}
        handleSelect={onLoadData}
        getUserMonthIncome={()=>{}}
        refetch={()=>{}}
        data={{}}
      />,
      key: ADMIN_ID,
    }]);
  };

  if (!userTreeData.length) {
    return "Loading...";
  }

  return (
    <div className='my-4 grid grid-cols-2 gap-4'>
      <Tree
        expandAction 
        loadData={onLoadData} 
        treeData={userTreeData} 
      />
      <UserDetailInTree 
        userInfo = {selectedUserInfo}
      />
    </div>
  );
};
export default UserTree;