// src/admin/adminRoutes.tsx
import type { RouteObject } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Products from "../admin/pages/Products";
// import Orders from "./pages/Orders";
// import Categories from "./pages/Categories";
// import Users from "./pages/Users";
// import Reviews from "./pages/Reviews";

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { path: "products", element: <Products /> },
    // { path: "orders", element: <Orders /> },
    // { path: "categories", element: <Categories /> },
    // { path: "users", element: <Users /> },
    // { path: "reviews", element: <Reviews /> },
  ],
};
