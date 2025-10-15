// src/app/ProviderRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/auth.jsx";

export default function ProviderRoute() {
  const { isAuthed, user } = useAuth();
  const location = useLocation();

  // Chưa đăng nhập → đẩy về /login và giữ đường dẫn hiện tại
  if (!isAuthed) {
    const next = encodeURIComponent(location.pathname + location.search + location.hash);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  // Không phải provider → về trang chủ app
  if (user?.role !== "provider") {
    return <Navigate to="/" replace />;
  }

  // Đúng role → cho đi tiếp các route con
  return <Outlet />;
}
