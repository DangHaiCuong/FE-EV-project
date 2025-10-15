// src/app/App.jsx
import React from "react";
import { Layout } from "antd";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import HeaderNav from "./components/HeaderNav.jsx";
import { useAuth } from "./context/auth.jsx";

import Home from "./pages/Home.jsx";
import Data from "./pages/Data.jsx";
import MapPage from "./pages/Map.jsx";
import News from "./pages/News.jsx";
import Support from "./pages/Support.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";

import ProviderRoute from "./ProviderRoute.jsx";
import ProviderShell from "./layout/ProviderShell.jsx";
import ProviderDashboard from "./pages/provider/Dashboard.jsx";
import ProviderOrders from "./pages/provider/Orders.jsx";
// Khi tạo thêm thì mở:
// import ProviderProducts from "./pages/provider/Products.jsx";
// import ProviderPayouts from "./pages/provider/Payouts.jsx";
// import ProviderSettings from "./pages/provider/Settings.jsx";

const { Content } = Layout;
const HEADER_HEIGHT = 72; // chỉnh số này nếu header cao/thấp khác

function RequireAuth({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { pathname } = useLocation();
  const isAuthRoute = /^\/(login|signup)\/?$/.test(pathname);
  const isProviderRoute = pathname.startsWith("/provider");

  // Chỉ hiển thị HeaderNav ở các trang bình thường (không auth, không provider)
  const showHeader = !isAuthRoute && !isProviderRoute;

  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      {showHeader && <HeaderNav />}

      <Content
        style={{
          background: "transparent",
          paddingTop: showHeader ? HEADER_HEIGHT + 8 : 0, // không padding ở provider
        }}
      >
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<Data />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/news" element={<News />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private (user) */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          {/* Provider area */}
          <Route element={<ProviderRoute />}>
            <Route path="/provider" element={<ProviderShell />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ProviderDashboard />} />
              <Route path="orders" element={<ProviderOrders />} />
              {/*
              <Route path="products" element={<ProviderProducts />} />
              <Route path="payouts" element={<ProviderPayouts />} />
              <Route path="settings" element={<ProviderSettings />} />
              */}
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>
    </Layout>
  );
}
