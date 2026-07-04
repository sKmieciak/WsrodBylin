// AppRoutes.tsx
import { useRoutes } from "react-router-dom";
import { adminRoutes } from "../admin/AdminRoutes";

// Importuj trasy dla klienta
import Home from "../pages/Home";
import { ProductPage } from "../pages/product/ProductPage";
import CartPage from "../pages/cart/CartPage";
import ProfilePage from "../pages/profile/ProfilePage";
import { ProductListPage } from "../pages/product/ProductListPage";
import OrdersPage from "../pages/orders/OrderPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import OrderSuccessPage from "../pages/orders/OrderSuccessPage";
import RegulationsPage from "../pages/regulations/RegulationsPage";
import ContactPage from "../pages/contact/ContactPage";
import PromotionsPage from "../pages/promotions/PromotionPage";
import NotFoundPage from "../pages/NotFoundPage";

export const AppRoutes = () => {
  const routes = useRoutes([
    // 🔓 PUBLIC
    { path: "/", element: <Home /> },
    { path: "/products", element: <ProductListPage /> },
    { path: "/product/:id", element: <ProductPage /> },
    { path: "/cart", element: <CartPage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/orders", element: <OrdersPage /> },
    { path: "/checkout", element: <CheckoutPage /> },
    { path: "/order/success/:id", element: <OrderSuccessPage /> },
    { path: "/regulamin", element: <RegulationsPage /> },
    { path: "/kontakt", element: <ContactPage /> },
    { path: "/promocje", element: <PromotionsPage /> },

    // 🔐 ADMIN (wstrzyknięte jako gotowy blok)
    adminRoutes,

    { path: "*", element: <NotFoundPage /> },
  ]);

  return routes;
};
