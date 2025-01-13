import AppLayout from "./layout";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GlobalContext } from "../contexts/global";
import { UserRoleConstant } from "../constants";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const auth = useContext(GlobalContext);

  const { token, user } = auth;
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    user?.role !== UserRoleConstant.ADMIN &&
    user?.role !== UserRoleConstant.SALES &&
    user?.role !== UserRoleConstant.USER
  ) {
    return <Navigate to="/Forbidden" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
export default ProtectedRoute;
