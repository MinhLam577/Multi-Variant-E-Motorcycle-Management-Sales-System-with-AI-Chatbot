import { Breadcrumb } from "antd";
import React from "react";

interface IAdminBreadCrumbProps {
    description: string;
    items: Array<{ key: number; href: string; title: string }>;
}
const AdminBreadCrumb: React.FC<IAdminBreadCrumbProps> = ({
    description,
    items,
}) => {
    return (
        <div className="flex flex-col justify-start items-start gap-1 w-full">
            <Breadcrumb
                style={{
                    margin: "0.25rem 0 0 0",
                }}
                items={items}
            />
            <p className="text-sm hidden md:block">{description}</p>
        </div>
    );
};

export default AdminBreadCrumb;
