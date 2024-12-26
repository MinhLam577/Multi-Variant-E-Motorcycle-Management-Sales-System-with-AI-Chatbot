import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "../../businessComponents/users/UserTable";
import { GlobalContext } from "../../contexts/global";
import UserSearch from "../../businessComponents/users/UserSearch";

const User = () => {
  const navigate = useNavigate();
  const [globalFilters, setGlobalFilters] = useState({ searchText: null });
  const { globalDispatch } = useContext(GlobalContext);

  const handleEditUser = (usersData) => {
    globalDispatch({
      type: 'breadcrum',
      data: usersData.fullname
    });
    navigate(`/users/${usersData.userId}/edit`, { replace: true });
  };

  const handleViewUser = (usersData) => {
    globalDispatch({
      type: 'breadcrum',
      data: usersData.fullname
    });
    navigate(`/users/${usersData.userId}`, { replace: true });
  };

  return (
    <>
      <UserSearch
        setFilters={setGlobalFilters}
      />
      <UserTable
        globalFilters={globalFilters}
        handleUpdateUser={handleEditUser}
        handleViewUser={handleViewUser}
      />
    </>
  );
};

export default User;