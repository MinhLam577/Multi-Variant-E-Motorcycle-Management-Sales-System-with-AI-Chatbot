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
  UserOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Grid, Layout, Menu, theme } from "antd";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { UserRoleConstant } from "../../constants";
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
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { name, user } = useContext(GlobalContext);
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
      return ["1"];
    } else if (path.includes("/dashboard")) {
      return ["1"];
    } else if (path.includes("/profile")) {
      return ["19"];
    } else if (path.includes("/users")) {
      return ["2"];
    } else if (path.includes("/stores")) {
      return ["3"];
    } else if (path.includes("/categories")) {
      return ["7"];
    } else if (path.includes("/news")) {
      return ["8"];
    } else if (path.includes("/products")) {
      return ["5"];
    } else if (path.includes("/e-motorbike")) {
      if (search.includes("/add")) {
        return ["6"];
      } else if (search.includes("/edit")) {
        return ["6"];
      }
      return ["6"];
    } else if (path.includes("/combo_product")) {
      return ["7"];
    } else if (path.includes("/product_units")) {
      return ["8"];
    } else if (path.includes("/orders")) {
      if (search.includes("?status=new")) {
        return ["9", "11"];
      } else if (search.includes("?status=confirmed")) {
        return ["9", "12"];
      } else if (search.includes("?status=delivering")) {
        return ["13"];
      } else if (search.includes("?status=completed")) {
        return ["14"];
      }
      return ["9", "10"];
    } else if (path.includes("/notifications")) {
      return ["15"];
    } else if (path.includes("/vouchers")) {
      return ["16"];
    } else if (path.includes("/warehouse")) {
      return ["17"];
    } else if (path.includes("/statistic")) {
      return ["18"];
    } else if (path.includes("/customer")) {
      return ["19"];
    } else {
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
        collapsible={screens.md}
        collapsed={screens.md ? collapsed : true}
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
