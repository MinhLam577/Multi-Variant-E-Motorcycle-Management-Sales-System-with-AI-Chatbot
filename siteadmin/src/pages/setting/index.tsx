import {
    GlobalOutlined,
    SettingOutlined,
    SolutionOutlined,
    UserSwitchOutlined,
} from "@ant-design/icons";
import { Card } from "antd";
import { useNavigate } from "react-router";

export default function Setting() {
    const navigate = useNavigate();
    const settingsItems = [
        {
            title: "Cấu hình tài khoản",
            description: "Cật nhật thông tin tài khoản cá nhân",
            icon: <SettingOutlined />,
            active: true,
            navigate: "/setting/profile",
        },
        {
            title: "Phân quyền",
            description: "Tạo, phân quyền người dùng và quản lý quyền truy cập",
            icon: <SolutionOutlined />,
            active: true,
            navigate: "/setting/permission",
        },
        {
            title: "Vai trò",
            description: "Tạo, phân quyền và quản lý vai trò của người dùng",
            icon: <UserSwitchOutlined />,
            active: true,
            navigate: "/setting/role",
        },
        {
            title: "Địa chỉ và kho hàng",
            description: "Quản lý danh sách địa chỉ và kho hàng",
            icon: <GlobalOutlined />,
            active: true,
            navigate: "/warehouse",
        },
    ];
    return (
        <div style={{ height: "500px" }} className="animate-slideDown">
            <Card style={{ width: "100%", height: "100%" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {settingsItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-4 p-4 rounded-lg border ${
                                item.active
                                    ? "bg-blue-50 border-blue-500"
                                    : "bg-white"
                            } hover:shadow-md cursor-pointer`}
                            onClick={() => navigate(item.navigate)}
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-blue-600 text-2xl">
                                        {item.icon}
                                    </span>
                                    <h4 className="text-base font-semibold text-blue-900">
                                        {item.title}
                                    </h4>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
