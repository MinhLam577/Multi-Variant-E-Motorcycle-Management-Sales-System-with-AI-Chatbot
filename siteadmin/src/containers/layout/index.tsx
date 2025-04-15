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
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, ConfigProvider, Grid, Layout, Menu, theme } from 'antd';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Logo from '../../components/Logo';
import { GlobalContext } from '../../contexts/global';
import HeaderComponent from './header';
import './index.css';

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
  dashboard: 'Tổng quan',
  profile: 'Thông tin người dùng',
  users: 'Quản lý Người dùng',
  products: 'Quản lý Sản phẩm',
  categories: 'Danh mục sản phẩm',
  categoriesnews: 'Thông tin/tin tức',
  orders: 'Quản lý Đơn hàng',
  add: 'Tạo',
  edit: 'Sửa',
  vouchers: 'Quản lý vouchers',
  material: 'Quản lý kho',
  statistic: 'Quản lý thống kê',
  warehouse: 'Kho',
  'e-motorbike': 'Xe máy điện',
  customer: 'Quản lý khách hàng',
  setting: 'Cấu hình',
  role: 'Role',
};

export const getBreadcrumbItems = (path: string) => {
  if (typeof path !== 'string') {
    return [];
  }

  let arr = path
    .split('/')
    .map((value) => value.trim())
    .filter((value) => value !== '');
  let breadcrumbDataList = arr.map((value, index) => {
    let routeArr = arr.slice(0, index + 1);

    return {
      key: index + 1,
      href: '/' + routeArr.join('/'),
      title: BreadcrumbLabel[value] ? BreadcrumbLabel[value] : name,
    };
  });

  // set default to user page
  breadcrumbDataList =
    breadcrumbDataList.length === 0
      ? [
          {
            key: 1,
            href: '/',
            title: BreadcrumbLabel['dashboard'],
          },
        ]
      : breadcrumbDataList;

  return breadcrumbDataList;
};

const AppLayout = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);

  const { name } = useContext(GlobalContext) as { name: string };
  const screens = useBreakpoint();

  //set user role
  const items = [
    getItem('Tổng quan', '1', <ProductOutlined />, null, () => navigate('/')),
    getItem('Nhân viên', '2', <UserOutlined />, null, () => navigate('/users')),
    getItem('Chi nhánh', '3', <ShopOutlined />, null, () =>
      navigate('/stores')
    ),
    getItem('Sản phẩm', '4', <ShoppingOutlined />, [
      getItem('Ô tô tải', '5', <TruckOutlined />, null, () =>
        navigate('/products')
      ),
      getItem('Xe máy điện', '6', <TruckOutlined />, null, () =>
        navigate('/e-motorbike')
      ),
    ]),
    getItem('Danh mục', '7', <FileDoneOutlined />, null, () =>
      navigate('/categories')
    ),
    getItem('Danh mục tin tức', '8', <CalendarOutlined />, null, () =>
      navigate('/categorynews')
    ),
    getItem('Đơn hàng', '9', <OrderedListOutlined />, null, () =>
      navigate('/orders')
    ),
    getItem('Thông báo', '15', <NotificationOutlined />, null, () =>
      navigate('/notifications')
    ),
    getItem('Voucher', '16', <GiftOutlined />, null, () =>
      navigate('/vouchers')
    ),
    getItem('Kho', '17', <DashboardOutlined />, null, () =>
      navigate('/warehouse')
    ),
    getItem('Thống kê', '18', <BarChartOutlined />, null, () =>
      navigate('/statistic')
    ),
    getItem('Khách hàng', '19', <UserOutlined />, null, () =>
      navigate('/customer')
    ),
    getItem('Cấu hình', '20', <SettingOutlined />, null, () =>
      navigate('/setting')
    ),
  ];

  const getBreadcrumbItems = (path) => {
    if (typeof path !== 'string') {
      return [];
    }

    let arr = path
      .split('/')
      .map((value) => value.trim())
      .filter((value) => value !== '');
    let breadcrumbDataList = arr.map((value, index) => {
      let routeArr = arr.slice(0, index + 1);

      return {
        key: index + 1,
        href: '/' + routeArr.join('/'),
        title: BreadcrumbLabel[value] ? BreadcrumbLabel[value] : name,
      };
    });

    // set default to user page
    breadcrumbDataList =
      breadcrumbDataList.length === 0
        ? [
            {
              key: 1,
              href: '/',
              title: BreadcrumbLabel['dashboard'],
            },
          ]
        : breadcrumbDataList;

    return breadcrumbDataList;
  };

  const getSideMenuSelectedKeys = () => {
    const path = location.pathname;
    const search = location.search;
    if (typeof path !== 'string') {
      return ['100'];
    } else {
      const menuKeys = {
        '/dashboard': '1',
        '/profile': '19',
        '/users': '2',
        '/stores': '3',
        '/categories': '7',
        '/categorynews': '8',
        '/products': '5',
        '/e-motorbike': '6',
        '/combo_product': '7',
        '/orders': '9',
        '/notifications': '15',
        '/vouchers': '16',
        '/warehouse': '17',
        '/statistic': '18',
        '/customer': '19',
        '/role': '21',
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
      return ['1'];
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: 'var(--sideBar-background-color)',
            triggerBg: 'var(--sideBar-background-color)',
          },
        },
      }}
    >
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={screens.md ? 256 : 256}
          className={collapsed ? 'sider-collapsed' : 'sider-expanded'}
        >
          <div className="w-full h-16 flex justify-center flex-col items-center cursor-pointer bg-[var(--sideBar-logo-background-color)]">
            <Logo
              handleClick={() => navigate('/')}
              collapsed={screens.md ? collapsed : true}
            />
          </div>
          <Menu
            defaultSelectedKeys={['1']}
            selectedKeys={getSideMenuSelectedKeys()}
            items={items}
            mode="inline"
          />
        </Sider>
        <Layout>
          <HeaderComponent />
          <Content style={{ margin: '0 1rem' }}>
            <div style={{ paddingRight: '16px' }}>{children}</div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Ô tô hồng sơn ©2024 Created by Openverse
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};
export default AppLayout;
