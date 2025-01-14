import PropTypes from "prop-types";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserRoleConstant } from "../constants";
import { GlobalContext } from "../contexts/global";
import AppLayout from "./layout";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const auth = useContext(GlobalContext);
  const { isAuthenticated, user, isInitialized } = auth;

  console.log("ProtectedRoute-auth", auth);

  if (isInitialized) {
    return <Loading />;
  }
  if (!isAuthenticated) {
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
