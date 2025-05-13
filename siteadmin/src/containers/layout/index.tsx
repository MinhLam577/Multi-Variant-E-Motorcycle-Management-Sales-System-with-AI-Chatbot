import {
    BarChartOutlined,
    CalendarOutlined,
    DashboardOutlined,
    FileDoneOutlined,
    GiftOutlined,
    ImportOutlined,
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
    message,
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
import { displayMessage } from "src/utils";
import { ALL_PERMISSIONS } from "src/constants/permissions";

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
    categories: "Quản lí danh mục sản phẩm",
    categorynews: "Danh mục tin tức",
    orders: "Quản lý đơn hàng",
    add: "Tạo",
    edit: "Sửa",
    vouchers: "Quản lý vouchers",
    material: "Quản lý kho",
    statistic: "Quản lý thống kê",
    warehouse: "Quản lí kho",
    "e-motorbike": "Xe máy điện",
    customer: "Quản lý khách hàng",
    setting: "Cấu hình",
    role: "Role",
    notifications: "Quản lí thông báo",
    import: "Quản lí nhập kho",
    export: "Quản lí xuất kho",
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
    const [messageApi, contextHolder] = message.useMessage();
    const screens = useBreakpoint();
    const Store = useStore();
    const { loginObservable } = useStore();
    const AccountStore = Store.accountObservable;
    const [
        items, // set menu items vào state nếu có
        setMenuItems,
    ] = useState([]);
    //set user role
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await AccountStore.getAccount();
        await loginObservable.getAccountApi(AccountStore.account.email);
    };
    const permissions = AccountStore.account?.permissions || [];
    useEffect(() => {
        if (!permissions?.length) return;
        const items = [];

        const hasPermission = (perm) =>
            permissions.some(
                (item) => item.path === perm.path && item.method === perm.method
            );

        items.push(
            getItem("Tổng quan", "1", <BarChartOutlined />, null, () =>
                navigate("/")
            )
        );

        if (hasPermission(ALL_PERMISSIONS.USERS.GET_PAGINATE)) {
            items.push(
                getItem("Nhân viên", "2", <UserOutlined />, null, () =>
                    navigate("/users")
                )
            );
        }
        if (hasPermission(ALL_PERMISSIONS.CUSTOMERS.GET_PAGINATE)) {
            items.push(
                getItem(
                    "Khách hàng",
                    "19",
                    <UsergroupAddOutlined />,
                    null,
                    () => navigate("/customer")
                )
            );
        }
        if (hasPermission(ALL_PERMISSIONS.ROLES.GET_PAGINATE)) {
            items.push(
                getItem("Sản phẩm", "4", <ShoppingOutlined />, null, () =>
                    navigate("/products")
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.CATEGORIES.GET_PAGINATE)) {
            items.push(
                getItem("Danh mục", "7", <FileDoneOutlined />, null, () =>
                    navigate("/categories")
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.BLOGCATEGORY.GET_PAGINATE)) {
            items.push(
                getItem(
                    "Danh mục tin tức",
                    "8",
                    <CalendarOutlined />,
                    null,
                    () => navigate("/categorynews")
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.ORDERS.GET_PAGINATE)) {
            items.push(
                getItem("Đơn hàng", "9", <OrderedListOutlined />, null, () =>
                    navigate("/orders")
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.ROLES.GET_PAGINATE)) {
            items.push(
                getItem("Thông báo", "15", <NotificationOutlined />, null, () =>
                    navigate("/notifications")
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.VOURCHERS.GET_PAGINATE)) {
            items.push(
                getItem("Voucher", "16", <GiftOutlined />, null, () =>
                    navigate("/vouchers")
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.WAREHOUSE.GET_PAGINATE)) {
            items.push(
                getItem("Kho", "17", <DashboardOutlined />, null, () =>
                    navigate("/warehouse")
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE)) {
            items.push(
                getItem("Cấu hình", "20", <SettingOutlined />, null, () =>
                    navigate("/setting")
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.EXPORT.GET_PAGINATE)) {
            items.push(
                getItem("Xuất kho", "22", <ImportOutlined />, null, () =>
                    navigate("/export")
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.IMPORT.GET_PAGINATE)) {
            items.push(
                getItem("Nhập kho", "23", <ImportOutlined />, null, () =>
                    navigate("/import")
                )
            );
        }
        // set menu items vào state nếu có
        setMenuItems(items);
    }, [permissions]);

    //   const items = [
    //     getItem("Tổng quan", "1", <BarChartOutlined />, null, () => navigate("/")),
    //     getItem("Nhân viên", "2", <UserOutlined />, null, () => navigate("/users")),
    //     getItem("Khách hàng", "19", <UsergroupAddOutlined />, null, () =>
    //       navigate("/customer")
    //     ),
    //     // getItem("Chi nhánh", "3", <ShopOutlined />, null, () =>
    //     //     navigate("/stores")
    //     // ),
    //     getItem("Sản phẩm", "4", <ShoppingOutlined />, null, () =>
    //       navigate("/products")
    //     ),
    //     // getItem("Biến thể", "5", <TruckOutlined />, null, () =>
    //     //     navigate("/combo_product")
    //     // ),
    //     getItem("Danh mục", "7", <FileDoneOutlined />, null, () =>
    //       navigate("/categories")
    //     ),
    //     getItem("Danh mục tin tức", "8", <CalendarOutlined />, null, () =>
    //       navigate("/categorynews")
    //     ),
    //     getItem("Đơn hàng", "9", <OrderedListOutlined />, null, () =>
    //       navigate("/orders")
    //     ),
    //     getItem("Thông báo", "15", <NotificationOutlined />, null, () =>
    //       navigate("/notifications")
    //     ),
    //     //check  1
    //     getItem("Voucher", "16", <GiftOutlined />, null, () =>
    //       navigate("/vouchers")
    //     ),
    //     getItem("Kho", "17", <DashboardOutlined />, null, () =>
    //       navigate("/warehouse")
    //     ),
    //     getItem("Cấu hình", "20", <SettingOutlined />, null, () =>
    //       navigate("/setting")
    //     ),
    //   ];

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
                "/setting": "20",
                "/role": "21",
                "/import": "22",
                "/export": "23",
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
    useEffect(() => {
        const messageReaction = reaction(
            () => ({
                status: store.status,
                showSuccessMsg: store.showSuccessMsg,
                errorMsg: store.errorMsg,
                successMsg: store.successMsg,
            }),
            (current_status) => {
                if (!current_status) return;
                const { status: newStatus, showSuccessMsg: newShowSuccess } =
                    current_status || {};
                displayMessage(messageApi, newStatus, store, newShowSuccess, 5);
            }
        );
        return () => {
            messageReaction();
        };
    }, []);
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
            {contextHolder}
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
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default observer(AppLayout);
