import { Navigate } from "react-router";
import { RoleEnum } from "../constants";
import { useAuth } from "../contexts/AuthProvider";
import AppLayout from "./layout";
import React from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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

export default ProtectedRoute;
