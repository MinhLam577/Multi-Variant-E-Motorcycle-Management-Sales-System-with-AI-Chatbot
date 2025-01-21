import PropTypes from "prop-types";
import { Navigate } from "react-router";
import { UserRoleConstant } from "../constants";
import { useAuth } from "../contexts/AuthProvider";
import AppLayout from "./layout";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const data = useAuth();
  console.log("ProtectedRoute", data);
  // if (loading) return <Loading />;

  if (!user?.access_token) return <Navigate to="/login" replace />;

  const allowedRoles = [
    UserRoleConstant.ADMIN,
    UserRoleConstant.SALES,
    UserRoleConstant.USER,
  ];

  if (!allowedRoles.includes(user?.role))
    return <Navigate to="/Forbidden" replace />;

  return <AppLayout>{children}</AppLayout>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
