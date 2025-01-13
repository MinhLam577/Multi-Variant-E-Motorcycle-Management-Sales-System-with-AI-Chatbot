import { useContext } from "react";
import { GlobalContext } from "../contexts/global";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const Forbidden = () => {
  const { globalDispatch } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    globalDispatch({
      type: "logout",
    });
    navigate("/login");
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
