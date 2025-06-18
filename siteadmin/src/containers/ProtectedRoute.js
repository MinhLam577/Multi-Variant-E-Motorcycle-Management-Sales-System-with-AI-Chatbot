import PropTypes from "prop-types";
import { Navigate } from "react-router";
import { RoleEnum, UserRoleConstant } from "../constants";
import { useAuth } from "../contexts/AuthProvider";
import AppLayout from "./layout";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user?.access_token) return <Navigate to="/login" replace />;

    const allowedRoles = [
        RoleEnum.ADMIN,
        RoleEnum.STAFF,
        RoleEnum.WAREHOUSE_MANAGER,
        RoleEnum.DELIVERY_STAFF,
    ];

    if (!allowedRoles.includes(user?.Roles))
        return <Navigate to="/Forbidden" replace />;

    return <AppLayout>{children}</AppLayout>;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
