import PropTypes from "prop-types";
import { Navigate } from "react-router";
import { UserRoleConstant } from "../constants";
import { useAuth } from "../contexts/AuthProvider";
import AppLayout from "./layout";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user?.access_token) return <Navigate to="/login" replace />;

    const allowedRoles = [
        UserRoleConstant.admin,
        UserRoleConstant.Staff,
        UserRoleConstant.warehouse_manager,
        UserRoleConstant.delivery_staff,
    ];

    if (!allowedRoles.includes(user?.Roles))
        return <Navigate to="/Forbidden" replace />;

    return <AppLayout>{children}</AppLayout>;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
