// src/routes/publicRoutes.ts
import type { RouteObject } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import { ProductPage } from "../pages/product/ProductPage";
import CartPage from "../pages/cart/CartPage";
import ProfilePage from "../pages/profile/ProfilePage";
import { ProductListPage } from "../pages/product/ProductListPage";

export const publicRoutes: RouteObject = {
  path: "/",
  element: <AppLayout />,
  children: [
    { index: true, element: <Home /> },
    { path: "product/:id", element: <ProductPage /> },
    { path: "products", element: <ProductListPage /> },
    { path: "cart", element: <CartPage /> },
    { path: "profile", element: <ProfilePage /> },
  ],
};
