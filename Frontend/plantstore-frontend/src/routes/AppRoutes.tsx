import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { ProductPage } from "../pages/product/ProductPage";
import CartPage from "../pages/cart/CartPage";
import ProfilePage from "../pages/profile/ProfilePage";
import { ProductListPage } from "../pages/product/ProductListPage";
import AdminProductsPage from "../admin/pages/Products";
import OrdersPage from "../pages/orders/OrderPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import OrderSuccessPage from "../pages/orders/OrderSuccessPage";
import RegulationsPage from "../pages/regulations/RegulationsPage";
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/cart" element={<CartPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order/success/:id" element={<OrderSuccessPage />} />
      <Route path="/regulamin" element={<RegulationsPage />} />
    </Routes>
  );
};
