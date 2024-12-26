import { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ApolloProviderGlobal from "./containers/ApolloProviderGlobal";
import GlobalProvider from "./contexts/global";
import Loading from "./containers/Loading";
import ProtectedRoute from "./containers/ProtectedRoute";
import Forbidden from "./pages/Forbidden";
import Page404 from "./pages/404";
import Login from "./pages/Login";
import User from "./pages/users";
import Profile from "./pages/Profile";
import News from "./pages/news";
import NewsDetail, { NewsDetailMode } from "./pages/news/NewsDetail";
import Categories from "./pages/categories";
import Products from "./pages/products";
import CategoriesDetail, {
  CategoriesDetailMode,
} from "./pages/categories/CategoriesDetail";
import ProductsDetail, {
  ProductsDetailMode,
} from "./pages/products/ProductsDetail";
import Orders from "./pages/orders";
import OrderDetail, { OrderDetailMode } from "./pages/orders/OrderDetail";
import UserDetail from "./pages/users/UserDetail";
import Notification from "./pages/notifications";
import Stores from "./pages/stores";
import StoresDetail, { StoresDetailMode } from "./pages/stores/StoresDetail";
import ProductUnits from "./pages/product_units";
import ProductUnitsDetail, {
  ProductUnitsDetailMode,
} from "./pages/product_units/ProductUnitsDetail";
import ProductsCombo from "./pages/products_combo";
import ProductsComboDetail from "./pages/products_combo/ProductsComboDetail";
import Vouchers from "./pages/vouchers";
import VoucherDetail from "./pages/vouchers/VoucherDetail";
import Policy from "./pages/Policy";
import DeleteUser from "./pages/users/DeleteUser";
import Material from "./pages/material";
import Statistic from "./pages/statistic";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <ApolloProviderGlobal>
      <GlobalProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/Forbidden" element={<Forbidden />} />
              <Route
                path="/dashboard"
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
              <Route
                path="/material"
                element={
                  <ProtectedRoute>
                    <Material />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <User />
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
                path="/combo_product"
                element={
                  <ProtectedRoute>
                    <ProductsCombo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/combo_product/add"
                element={
                  <ProtectedRoute>
                    <ProductsComboDetail mode={ProductUnitsDetailMode.Add} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/combo_product/:id"
                element={
                  <ProtectedRoute>
                    <ProductsComboDetail mode={ProductUnitsDetailMode.View} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/combo_product/:id/edit"
                element={
                  <ProtectedRoute>
                    <ProductsComboDetail mode={ProductUnitsDetailMode.Edit} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product_units"
                element={
                  <ProtectedRoute>
                    <ProductUnits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product_units/add"
                element={
                  <ProtectedRoute>
                    <ProductUnitsDetail mode={ProductUnitsDetailMode.Add} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product_units/:id"
                element={
                  <ProtectedRoute>
                    <ProductUnitsDetail mode={ProductUnitsDetailMode.View} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product_units/:id/edit"
                element={
                  <ProtectedRoute>
                    <ProductUnitsDetail mode={ProductUnitsDetailMode.Edit} />
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
              <Route path="/:404" element={<Page404 />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </GlobalProvider>
    </ApolloProviderGlobal>
  );
}

export default App;
