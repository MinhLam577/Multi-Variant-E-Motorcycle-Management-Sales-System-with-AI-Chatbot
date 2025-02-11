import {
  BarChartOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  GiftOutlined,
  NotificationOutlined,
  OrderedListOutlined,
  ProductOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Grid, Layout, Menu } from "antd";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Logo from "../../components/Logo";
import { GlobalContext } from "../../contexts/global";
import HeaderComponent from "./header";

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
  products: "Quản lý Sản phẩm",
  categories: "Danh mục sản phẩm",
  news: "Thông tin/tin tức/khuyến mãi",
  orders: "Quản lý Đơn hàng",
  add: "Tạo",
  edit: "Sửa",
  vouchers: "Quản lý vouchers",
  material: "Quản lý kho",
  statistic: "Quản lý thống kê",
  warehouse: "Kho",
  "e-motorbike": "Xe máy điện",
  customer: "Quản lý khách hàng",
};

const AppLayout = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);

  const { name } = useContext(GlobalContext);
  const screens = useBreakpoint();

  //set user role
  const items = [
    getItem("Tổng quan", "1", <ProductOutlined />, null, () => navigate("/")),
    getItem("Nhân viên", "2", <UserOutlined />, null, () => navigate("/users")),
    getItem("Chi nhánh", "3", <ShopOutlined />, null, () =>
      navigate("/stores")
    ),
    getItem("Sản phẩm", "4", <ShoppingOutlined />, [
      getItem("Ô tô tải", "5", <TruckOutlined />, null, () =>
        navigate("/products")
      ),
      getItem("Xe máy điện", "6", <TruckOutlined />, null, () =>
        navigate("/e-motorbike")
      ),
    ]),
    getItem("Danh mục", "7", <FileDoneOutlined />, null, () =>
      navigate("/categories")
    ),
    getItem("Tin tức", "8", <CalendarOutlined />, null, () =>
      navigate("/news")
    ),
    getItem("Đơn hàng", "9", <OrderedListOutlined />, [
      getItem("Tất cả", "10", null, null, () => navigate("/orders")),
      getItem("Mới", "11", null, null, () => navigate("/orders?status=new")),
      getItem("Đã đóng gói", "12", null, null, () =>
        navigate("/orders?status=confirmed")
      ),
      getItem("Đã giao DVVC", "13", null, null, () =>
        navigate("/orders?status=delivering")
      ),
      getItem("Hoàn thành", "14", null, null, () =>
        navigate("/orders?status=completed")
      ),
    ]),
    getItem("Thông báo", "15", <NotificationOutlined />, null, () =>
      navigate("/notifications")
    ),
    getItem("Voucher", "16", <GiftOutlined />, null, () =>
      navigate("/vouchers")
    ),
    getItem("Kho", "17", <DashboardOutlined />, null, () =>
      navigate("/warehouse")
    ),
    getItem("Thống kê", "18", <BarChartOutlined />, null, () =>
      navigate("/statistic")
    ),
    getItem("Khách hàng", "19", <UserOutlined />, null, () =>
      navigate("/customer")
    ),
  ];

  const getBreadcrumbItems = (path) => {
    if (typeof path !== "string") {
      return [];
    }

    let arr = path
      .split("/")
      .map((value) => value.trim())
      .filter((value) => value !== "");
    let breadcrumbDataList = arr.map((value, index) => {
      let routeArr = arr.slice(0, index + 1);

      return {
        key: index + 1,
        href: "/" + routeArr.join("/"),
        title: BreadcrumbLabel[value] ? BreadcrumbLabel[value] : name,
      };
    });

    // set default to user page
    breadcrumbDataList =
      breadcrumbDataList.length === 0
        ? [
            {
              key: 1,
              href: "/",
              title: BreadcrumbLabel["dashboard"],
            },
          ]
        : breadcrumbDataList;

    return breadcrumbDataList;
  };

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
        "/news": "8",
        "/products": "5",
        "/e-motorbike": "6",
        "/combo_product": "7",
        "/orders": {
          "?status=new": ["9", "11"],
          "?status=confirmed": ["9", "12"],
          "?status=delivering": ["13"],
          "?status=completed": ["14"],
        },
        "/notifications": "15",
        "/vouchers": "16",
        "/warehouse": "17",
        "/statistic": "18",
        "/customer": "19",
      };
      for (let key in menuKeys) {
        if (path.includes(key)) {
          if (Array.isArray(menuKeys[key])) {
            if (
              search.includes(menuKeys[key][0]) ||
              search.includes(menuKeys[key][1])
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
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        xs={2}
        md={6}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="my-10">
          <div className="w-full flex justify-center flex-col items-center px-2 cursor-pointer">
            <Logo
              handleClick={() => navigate("/")}
              collapsed={screens.md ? collapsed : true}
            />
          </div>
        </div>

        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          selectedKeys={getSideMenuSelectedKeys()}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <HeaderComponent />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[...getBreadcrumbItems(location.pathname)]}
          />

          <div style={{ paddingRight: "16px" }}>{children}</div>
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
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};
export default AppLayout;
