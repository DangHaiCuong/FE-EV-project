// =============================
// File: src/admin/ProtectedRoute.jsx
// =============================
import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../app/context/auth.jsx";

/**
 * Chặn các route private khi chưa đăng nhập.
 * - Nếu loading: hiển thị trạng thái.
 * - Nếu đã đăng nhập: render <Outlet/>.
 * - Nếu chưa: điều hướng sang /login và kèm state.from để quay lại sau login.
 */
export default function ProtectedRoute() {
  const { isAuthed, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return <div style={{ padding: 16 }}>Đang kiểm tra phiên đăng nhập…</div>;
  }

  if (isAuthed) {
    return <Outlet />;
  }

  return (
    <Navigate
      to="/login"
      replace
      state={{ from: loc.pathname + loc.search + loc.hash }}
    />
  );
}
