import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { WareHouseDetailMode } from "./constants";
import Loading from "./containers/Loading";
import ProtectedRoute from "./containers/ProtectedRoute";
import AuthProvider from "./contexts/AuthProvider";
import Page404 from "./pages/404";
import Forbidden from "./pages/Forbidden";
import Policy from "./pages/Policy";
import Profile from "./pages/Profile";
import Categories from "./pages/categories";
import CategoriesDetail, {
  CategoriesDetailMode,
} from "./pages/categories/CategoriesDetail";
import Customer from "./pages/customers";
import Dashboard from "./pages/dashboard";
import EMotorbike from "./pages/e_motorbike";
import EMotorbikeDetail from "./pages/e_motorbike/detail";
import Login from "./pages/login";
import News from "./pages/news";
import NewsDetail, { NewsDetailMode } from "./pages/news/NewsDetail";
import Notification from "./pages/notifications";
import Orders from "./pages/orders";
import OrderDetail, { OrderDetailMode } from "./pages/orders/OrderDetail";
import { ProductUnitsDetailMode } from "./pages/product_units/ProductUnitsDetail";
import Products from "./pages/products";
import ProductsDetail, {
  ProductsDetailMode,
} from "./pages/products/ProductsDetail";
import Statistic from "./pages/statistic";
import Stores from "./pages/stores";
import StoresDetail, { StoresDetailMode } from "./pages/stores/StoresDetail";
import User from "./pages/users";
import DeleteUser from "./pages/users/DeleteUser";
import UserDetail from "./pages/users/UserDetail";
import Vouchers from "./pages/vouchers";
import VoucherDetail from "./pages/vouchers/VoucherDetail";
import WareHouses from "./pages/warehouses";
import WareHouseDetail from "./pages/warehouses/WareHouseDetail";
import { StoreProvider } from "./stores";
import GlobalProvider from "./contexts/global";
function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AuthProvider>
          <GlobalProvider>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/Forbidden" element={<Forbidden />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/statistic"
                  element={
                    <ProtectedRoute>
                      <Statistic />
                    </ProtectedRoute>
                  }
                />

                <Route path="/warehouse">
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <WareHouses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="add"
                    element={
                      <ProtectedRoute>
                        <WareHouseDetail mode={WareHouseDetailMode.Add} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path=":id"
                    element={
                      <ProtectedRoute>
                        <WareHouseDetail mode={WareHouseDetailMode.View} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path=":id/edit"
                    element={
                      <ProtectedRoute>
                        <WareHouseDetail mode={WareHouseDetailMode.Edit} />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                <Route
                  path="user"
                  element={
                    <ProtectedRoute>
                      <User />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="customer"
                  element={
                    <ProtectedRoute>
                      <Customer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notification />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vouchers"
                  element={
                    <ProtectedRoute>
                      <Vouchers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vouchers/add"
                  element={
                    <ProtectedRoute>
                      <VoucherDetail mode={ProductUnitsDetailMode.Add} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vouchers/:id"
                  element={
                    <ProtectedRoute>
                      <VoucherDetail mode={ProductUnitsDetailMode.View} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vouchers/:id/edit"
                  element={
                    <ProtectedRoute>
                      <VoucherDetail mode={ProductUnitsDetailMode.Edit} />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/stores"
                  element={
                    <ProtectedRoute>
                      <Stores />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stores/add"
                  element={
                    <ProtectedRoute>
                      <StoresDetail mode={StoresDetailMode.Add} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stores/:id"
                  element={
                    <ProtectedRoute>
                      <StoresDetail mode={StoresDetailMode.View} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stores/:id/edit"
                  element={
                    <ProtectedRoute>
                      <StoresDetail mode={StoresDetailMode.Edit} />
                    </ProtectedRoute>
                  }
                />
                <Route path="users">
                  <Route
                    index
                    element={
                      <ProtectedRoute>
                        <User />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="add"
                    element={
                      <ProtectedRoute>
                        <UserDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path=":id"
                    element={
                      <ProtectedRoute>
                        <UserDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path=":id/edit"
                    element={
                      <ProtectedRoute>
                        <UserDetail />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <Products />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/add"
                  element={
                    <ProtectedRoute>
                      <ProductsDetail mode={ProductsDetailMode.Add} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <ProtectedRoute>
                      <ProductsDetail mode={ProductsDetailMode.View} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/:id/edit"
                  element={
                    <ProtectedRoute>
                      <ProductsDetail mode={ProductsDetailMode.Edit} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <ProtectedRoute>
                      <Categories />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categories/add"
                  element={
                    <ProtectedRoute>
                      <CategoriesDetail mode={CategoriesDetailMode.Add} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categories/:id"
                  element={
                    <ProtectedRoute>
                      <CategoriesDetail mode={CategoriesDetailMode.View} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categories/:id/edit"
                  element={
                    <ProtectedRoute>
                      <CategoriesDetail mode={CategoriesDetailMode.Edit} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/news"
                  element={
                    <ProtectedRoute>
                      <News />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/news/add"
                  element={
                    <ProtectedRoute>
                      <NewsDetail mode={NewsDetailMode.Add} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/news/:id"
                  element={
                    <ProtectedRoute>
                      <NewsDetail mode={NewsDetailMode.View} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/news/:id/edit"
                  element={
                    <ProtectedRoute>
                      <NewsDetail mode={NewsDetailMode.Edit} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetail mode={OrderDetailMode.View} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id/edit"
                  element={
                    <ProtectedRoute>
                      <OrderDetail mode={OrderDetailMode.Edit} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/yeu-cau-xoa-tai-khoan"
                  element={<DeleteUser mode={OrderDetailMode.Edit} />}
                />

                <Route
                  path="/e-motorbike"
                  element={
                    <ProtectedRoute>
                      <EMotorbike />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/e-motorbike/add"
                  element={
                    <ProtectedRoute>
                      <EMotorbikeDetail mode={ProductUnitsDetailMode.Add} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/e-motorbike/:id"
                  element={
                    <ProtectedRoute>
                      <EMotorbikeDetail mode={ProductUnitsDetailMode.View} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/e-motorbike/:id/edit"
                  element={
                    <ProtectedRoute>
                      <EMotorbikeDetail mode={ProductUnitsDetailMode.Edit} />
                    </ProtectedRoute>
                  }
                />

                <Route path="/:404" element={<Page404 />} />
              </Routes>
            </Suspense>
          </GlobalProvider>
        </AuthProvider>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
