import {
    BarChartOutlined,
    CalendarOutlined,
    ClusterOutlined,
    DashboardOutlined,
    ExportOutlined,
    FileDoneOutlined,
    GiftOutlined,
    ImportOutlined,
    OrderedListOutlined,
    PhoneOutlined,
    SettingOutlined,
    ShoppingOutlined,
    SolutionOutlined,
    UsergroupAddOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    ConfigProvider,
    Drawer,
    Grid,
    Layout,
    Menu,
    message,
    Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Logo from "../../components/Logo";
import HeaderComponent from "./header";
import "./index.css";
import { makeAutoObservable, reaction } from "mobx";
import { useStore } from "src/stores";
import { observer } from "mobx-react-lite";
import { displayMessage } from "src/utils";
import { ALL_PERMISSIONS } from "src/constants/permissions";

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

export function getSideMenuItem(
    label,
    key,
    icon,
    children,
    onClick = () => {}
) {
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
    users: "Quản lý Người dùng",
    products: "Quản lý sản phẩm",
    categories: "Quản lí danh mục sản phẩm",
    categorynews: "Danh mục tin tức",
    orders: "Quản lý đơn hàng",
    variants: "Quản lý biến thể",
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
    brands: "Quản lí nhãn hàng cung cấp",
    contact: "Liên hệ",
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

class AppLayoutStore {
    items = [];
    openDrawer: boolean = false;
    collapsed: boolean = false;
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setItems(items) {
        this.items = items;
    }
    setOpenDrawer(open: boolean) {
        this.openDrawer = open;
    }

    setCollapsed(collapsed: boolean) {
        this.collapsed = collapsed;
    }
}

export const appLayoutStore = new AppLayoutStore();

const AppLayout = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const { children } = props;
    // const [collapsed, setCollapsed] = useState(false);
    const store = useStore();
    const [messageApi, contextHolder] = message.useMessage();
    const Store = useStore();
    const { loginObservable } = useStore();
    const AccountStore = Store.accountObservable;

    const fetchData = async () => {
        await AccountStore.getAccount();
        await loginObservable.getAccountApi(AccountStore.account.email);
    };
    useEffect(() => {
        fetchData();
        const permissions = AccountStore.permissions || [];
        // if (!permissions?.length) return;
        const items = [];

        const hasPermission = (perm) =>
            permissions.some(
                (item) => item.path === perm.path && item.method === perm.method
            );

        if (hasPermission(ALL_PERMISSIONS.DASHBOARD.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Tổng quan",
                    "1",
                    <BarChartOutlined />,
                    null,
                    () => {
                        navigate("/");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.USER.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Nhân viên",
                    "2",
                    <UserOutlined />,
                    null,
                    () => {
                        navigate("/users");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.CUSTOMERS.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Khách hàng",
                    "19",
                    <UsergroupAddOutlined />,
                    null,
                    () => {
                        navigate("/customer");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }
        if (hasPermission(ALL_PERMISSIONS.PRODUCTS.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Sản phẩm",
                    "4",
                    <ShoppingOutlined />,
                    null,
                    () => {
                        navigate("/products");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.SKUS.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Biến thể",
                    "24",
                    <ClusterOutlined />,
                    null,
                    () => {
                        navigate("/variants");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.CATEGORIES.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Danh mục sản phẩm",
                    "7",
                    <FileDoneOutlined />,
                    null,
                    () => {
                        navigate("/categories");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.BLOGCATEGORY.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Danh mục tin tức",
                    "8",
                    <CalendarOutlined />,
                    null,
                    () => {
                        navigate("/categorynews");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.ORDERS.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Đơn hàng",
                    "9",
                    <OrderedListOutlined />,
                    null,
                    () => {
                        navigate("/orders");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.VOURCHERS.GET_PAGINATE)) {
            items.push(
                getSideMenuItem("Voucher", "16", <GiftOutlined />, null, () => {
                    navigate("/vouchers");
                    appLayoutStore.setOpenDrawer(false);
                })
            );
        }

        if (hasPermission(ALL_PERMISSIONS.WAREHOUSE.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Kho",
                    "17",
                    <DashboardOutlined />,
                    null,
                    () => {
                        navigate("/warehouse");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.BRANDS.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Nhãn hàng cung cấp",
                    "25",
                    <SolutionOutlined />,
                    null,
                    () => {
                        navigate("/brands");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.IMPORT.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Nhập kho",
                    "22",
                    <ImportOutlined />,
                    null,
                    () => {
                        navigate("/import");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.EXPORT.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Xuất kho",
                    "23",
                    <ExportOutlined />,
                    null,
                    () => {
                        navigate("/export");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }
        if (hasPermission(ALL_PERMISSIONS.CONTACT.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Liên hệ",
                    "30",
                    <PhoneOutlined />,
                    null,
                    () => {
                        navigate("/contact");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        if (hasPermission(ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE)) {
            items.push(
                getSideMenuItem(
                    "Cấu hình",
                    "20",
                    <SettingOutlined />,
                    null,
                    () => {
                        navigate("/setting");
                        appLayoutStore.setOpenDrawer(false);
                    }
                )
            );
        }

        appLayoutStore.setItems(items);
    }, []);

    const getSideMenuSelectedKeys = () => {
        const path = location.pathname;
        const search = location.search;
        if (typeof path !== "string") {
            return ["100"];
        } else {
            const menuKeys = {
                "/dashboard": "1",
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
                "/variants": "24",
                "/brands": "25",
                "/contact": "30",
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
                {screens.md ? (
                    <Sider
                        collapsed={appLayoutStore.collapsed}
                        onCollapse={(value) =>
                            appLayoutStore.setCollapsed(value)
                        }
                        width={256}
                        className={
                            appLayoutStore.collapsed
                                ? "sider-collapsed"
                                : "sider-expanded"
                        }
                        breakpoint="md"
                        collapsedWidth={0}
                        onBreakpoint={(broken) => {
                            appLayoutStore.setOpenDrawer(broken);
                            appLayoutStore.setCollapsed(broken);
                        }}
                    >
                        <div className="w-full h-16 flex justify-center flex-col items-center cursor-pointer bg-[var(--sideBar-logo-background-color)]">
                            <Logo
                                handleClick={() => navigate("/")}
                                collapsed={
                                    screens.md ? appLayoutStore.collapsed : true
                                }
                            />
                        </div>
                        <Menu
                            defaultSelectedKeys={["1"]}
                            selectedKeys={getSideMenuSelectedKeys()}
                            items={appLayoutStore.items}
                            mode="inline"
                        />
                    </Sider>
                ) : (
                    <Drawer
                        title={
                            <div className="flex justify-center items-center">
                                <Logo
                                    handleClick={() => navigate("/")}
                                    collapsed={appLayoutStore.collapsed}
                                />
                            </div>
                        }
                        placement="left"
                        open={appLayoutStore.openDrawer}
                        closeIcon={null}
                        destroyOnClose={true}
                        onClose={() => {
                            appLayoutStore.setOpenDrawer(false);
                        }}
                        width={256}
                        className="!bg-[var(--sideBar-background-color)]"
                    >
                        <Menu
                            defaultSelectedKeys={["1"]}
                            selectedKeys={getSideMenuSelectedKeys()}
                            items={appLayoutStore.items}
                            mode="inline"
                            className="!bg-[var(--sideBar-background-color)]"
                        />
                    </Drawer>
                )}
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
