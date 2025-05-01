import {
    BarChartOutlined,
    CalendarOutlined,
    DashboardOutlined,
    FileDoneOutlined,
    GiftOutlined,
    NotificationOutlined,
    OrderedListOutlined,
    ProductOutlined,
    SettingOutlined,
    ShopOutlined,
    ShoppingOutlined,
    TruckOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Breadcrumb,
    ConfigProvider,
    Grid,
    Layout,
    Menu,
    Spin,
    theme,
} from "antd";
import PropTypes from "prop-types";
import { use, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Logo from "../../components/Logo";
import { GlobalContext } from "../../contexts/global";
import HeaderComponent from "./header";
import "./index.css";
import { makeAutoObservable, reaction } from "mobx";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
import { Profile2User } from "iconsax-react";

const { Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;

function getItem(label, key, icon, children, onClick = () => {}) {
    return {
        key,
        icon,
        children,
        label,
        onClick,
    };
}

const BreadcrumbLabel = {
    dashboard: "Tổng quan",
    profile: "Thông tin người dùng",
    users: "Quản lý Người dùng",
    products: "Quản lý sản phẩm",
    categories: "Danh mục sản phẩm",
    categoriesnews: "Thông tin/tin tức",
    orders: "Quản lý đơn hàng",
    add: "Tạo",
    edit: "Sửa",
    vouchers: "Quản lý vouchers",
    material: "Quản lý kho",
    statistic: "Quản lý thống kê",
    warehouse: "Kho",
    "e-motorbike": "Xe máy điện",
    customer: "Quản lý khách hàng",
    setting: "Cấu hình",
    role: "Role",
};

export const getBreadcrumbItems = (path: string) => {
    if (typeof path !== "string") {
        return [];
    }

    // Loại bỏ dấu / ở đầu và cuối, tách thành mảng
    const arr = path
        .replace(/^\/|\/$/g, "")
        .split("/")
        .map((value) => value.trim())
        .filter((value) => value !== "");

    // T pursed breadcrumb
    let currentPath = "";
    const breadcrumbDataList = arr.map((value, index) => {
        currentPath += (currentPath ? "/" : "") + value;
        return {
            key: index + 1,
            href: "/" + currentPath,
            title:
                BreadcrumbLabel && BreadcrumbLabel[value]
                    ? BreadcrumbLabel[value]
                    : value || "Unknown",
        };
    });

    // Mặc định dashboard
    return breadcrumbDataList.length === 0
        ? [
              {
                  key: 1,
                  href: "/",
                  title:
                      BreadcrumbLabel && BreadcrumbLabel["dashboard"]
                          ? BreadcrumbLabel["dashboard"]
                          : "Dashboard",
              },
          ]
        : breadcrumbDataList;
};

const AppLayout = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { children } = props;
    const [collapsed, setCollapsed] = useState(false);
    const store = useStore();

    const { name } = useContext(GlobalContext) as { name: string };
    const screens = useBreakpoint();

    //set user role
    const items = [
        getItem("Tổng quan", "1", <BarChartOutlined />, null, () =>
            navigate("/")
        ),
        getItem("Nhân viên", "2", <UserOutlined />, null, () =>
            navigate("/users")
        ),
        getItem("Khách hàng", "19", <UsergroupAddOutlined />, null, () =>
            navigate("/customer")
        ),
        getItem("Chi nhánh", "3", <ShopOutlined />, null, () =>
            navigate("/stores")
        ),
        getItem("Sản phẩm", "4", <ShoppingOutlined />, null, () =>
            navigate("/products")
        ),
        getItem("Biến thể", "5", <TruckOutlined />, null, () =>
            navigate("/combo_product")
        ),
        getItem("Danh mục", "7", <FileDoneOutlined />, null, () =>
            navigate("/categories")
        ),
        getItem("Danh mục tin tức", "8", <CalendarOutlined />, null, () =>
            navigate("/categorynews")
        ),
        getItem("Đơn hàng", "9", <OrderedListOutlined />, null, () =>
            navigate("/orders")
        ),
        getItem("Thông báo", "15", <NotificationOutlined />, null, () =>
            navigate("/notifications")
        ),
        getItem("Voucher", "16", <GiftOutlined />, null, () =>
            navigate("/vouchers")
        ),
        getItem("Kho", "17", <DashboardOutlined />, null, () =>
            navigate("/warehouse")
        ),
        getItem("Cấu hình", "20", <SettingOutlined />, null, () =>
            navigate("/setting")
        ),
    ];

    const getSideMenuSelectedKeys = () => {
        const path = location.pathname;
        const search = location.search;
        if (typeof path !== "string") {
            return ["100"];
        } else {
            const menuKeys = {
                "/dashboard": "1",
                "/profile": "19",
                "/users": "2",
                "/stores": "3",
                "/categories": "7",
                "/categorynews": "8",
                "/products": "4",
                "/combo_product": "7",
                "/orders": "9",
                "/notifications": "15",
                "/vouchers": "16",
                "/warehouse": "17",
                "/customer": "19",
                "/role": "21",
            };
            for (let key of Object.keys(menuKeys)) {
                if (path.startsWith(key)) {
                    if (Array.isArray(menuKeys[key])) {
                        if (
                            search.startsWith(menuKeys[key][0]) ||
                            search.startsWith(menuKeys[key][1])
                        ) {
                            return menuKeys[key];
                        }
                    } else {
                        return [menuKeys[key]];
                    }
                }
            }
            return ["1"];
        }
    };

    return (
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        siderBg: "var(--sideBar-background-color)",
                        triggerBg: "var(--sideBar-background-color)",
                    },
                },
            }}
        >
            <Layout
                style={{
                    minHeight: "100vh",
                }}
            >
                <Spin
                    spinning={store.loading}
                    size="large"
                    tip="Loading..."
                    fullscreen
                />
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    width={256}
                    className={collapsed ? "sider-collapsed" : "sider-expanded"}
                    breakpoint="lg"
                    collapsedWidth={80}
                >
                    <div className="w-full h-16 flex justify-center flex-col items-center cursor-pointer bg-[var(--sideBar-logo-background-color)]">
                        <Logo
                            handleClick={() => navigate("/")}
                            collapsed={screens.md ? collapsed : true}
                        />
                    </div>
                    <Menu
                        defaultSelectedKeys={["1"]}
                        selectedKeys={getSideMenuSelectedKeys()}
                        items={items}
                        mode="inline"
                    />
                </Sider>
                <Layout>
                    <HeaderComponent />
                    <Content className="mx-6 !bg-[#f3f4f6]">
                        <div>{children}</div>
                    </Content>
                    <Footer
                        style={{
                            textAlign: "center",
                        }}
                    >
                        Ô tô hồng sơn ©2024 Created by Openserce
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node,
};
export default observer(AppLayout);
