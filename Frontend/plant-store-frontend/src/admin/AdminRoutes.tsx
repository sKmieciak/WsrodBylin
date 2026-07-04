// src/admin/adminRoutes.tsx
import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminPromotions = lazy(() => import("./pages/AdminPromotions"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminUsers = lazy(() => import("./components/Users/AdminUsers"));
const AdminReviews = lazy(() => import("./components/Review/AdminReviews"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminAuditLog = lazy(() => import("./pages/AdminAuditLog"));

const AdminSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Ładowanie...</div>}>
    {children}
  </Suspense>
);

export const adminRoutes: RouteObject = {
  path: "/admin",
  element: <AdminLayout />,
  children: [
    { index: true, element: <AdminSuspense><AdminDashboard /></AdminSuspense> },
    { path: "products", element: <AdminSuspense><AdminProducts /></AdminSuspense> },
    { path: "orders", element: <AdminSuspense><AdminOrders /></AdminSuspense> },
    { path: "promotions", element: <AdminSuspense><AdminPromotions /></AdminSuspense> },
    { path: "users", element: <AdminSuspense><AdminUsers /></AdminSuspense> },
    { path: "reviews", element: <AdminSuspense><AdminReviews /></AdminSuspense> },
    { path: "settings", element: <AdminSuspense><AdminSettings /></AdminSuspense> },
    { path: "audit", element: <AdminSuspense><AdminAuditLog /></AdminSuspense> },
  ],
};
