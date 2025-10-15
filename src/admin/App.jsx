// =============================
// File: src/admin/App.jsx (RESCUE – fixed paths)
// =============================
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminShell from "./layout/AdminShell.jsx";
import AdminLogin from "./pages/Login.jsx";
import AdminDashboard from "./pages/Dashboard.jsx";
import ProvidersList from "./pages/providers/List.jsx";
import ProvidersApprovals from "./pages/providers/Approvals.jsx";
import Users from "./pages/customers/Users.jsx";

// Placeholder card
const Card = ({ title }) => (
  <div style={{ background: "#fff", padding: 16, borderRadius: 12 }}>
    <h2>{title}</h2>
    <p>Placeholder — trang tải OK. Thay bằng component thật của bạn sau.</p>
  </div>
);
const P = (t) => <Card title={t} />;

export default function AdminApp() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<AdminLogin />} />

      {/* PRIVATE */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminShell />}>
          {/* Dashboard */}
          <Route index element={<AdminDashboard />} />

          {/* Providers / Customers */}
          <Route path="providers/list" element={<ProvidersList />} />     {/* FIX */}
          <Route path="providers/approve" element={<ProvidersApprovals />} /> {/* FIX */}
          <Route path="customers/users" element={<Users />} />   {/* FIX */}

          {/* Packages */}
          <Route path="packages/plans" element={P("Quản lý gói • Gói dịch vụ")} />       {/* FIX */}
          <Route path="packages/transactions" element={P("Quản lý gói • Giao dịch")} />  {/* FIX */}

          {/* Datasets */}
          <Route path="datasets" element={P("Dataset")} />

          {/* Payment */}
          <Route path="payment/overview" element={P("Payment • Tổng quan")} />
          <Route path="payment/wallet-customers" element={P("Payment • Ví Customer")} />
          <Route path="payment/wallet-providers" element={P("Payment • Ví Provider")} />

          {/* Doanh thu */}
          <Route path="revenue/overview" element={P("Doanh thu • Tổng quan")} />
          <Route path="revenue/commissions" element={P("Doanh thu • Hoa hồng")} />
          <Route path="revenue/api" element={P("Doanh thu • API")} />

          {/* Quản lý dữ liệu (Ops) */}
          <Route path="ops/stations" element={P("Quản lý dữ liệu • Trạm sạc")} />
          <Route path="ops/chargers" element={P("Quản lý dữ liệu • Bộ sạc")} />
          <Route path="ops/ports" element={P("Quản lý dữ liệu • Cổng sạc")} />
          <Route path="ops/status" element={P("Quản lý dữ liệu • Trạng thái")} />

          {/* Báo cáo & Support */}
          <Route path="reports" element={P("Báo cáo")} />
          <Route path="support/chat" element={P("Support • Chat")} />
          <Route path="support/pricing" element={P("Support • Giá & Biểu phí")} />
          <Route path="support/policy" element={P("Support • Chính sách")} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
