import { useContext } from "react";
import { GlobalContext } from "../contexts/global";
import { useNavigate } from "react-router";
import { Button } from "antd";
import { useAuth } from "../contexts/AuthProvider";

const Forbidden = () => {
  const { globalDispatch } = useContext(GlobalContext);
  const navigate = useNavigate();
  const auth = useAuth();
  const handleLogout = () => {
    auth.logOut();
  };

  return (
    <div>
      Forbidden
      <Button onClick={() => handleLogout()}>Logout</Button>
    </div>
  );
};

Forbidden.propTypes = {};

export default Forbidden;
