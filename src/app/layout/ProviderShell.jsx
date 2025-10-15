// src/app/layout/ProviderShell.jsx
import React from "react";
import { Layout, Menu, Button, theme } from "antd";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  DollarOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/auth.jsx";

const { Header, Sider, Content } = Layout;

export default function ProviderShell() {
  const { token: tk } = theme.useToken();
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const items = [
    { key: "/provider/dashboard", icon: <HomeOutlined />, label: <Link to="dashboard">Tổng quan</Link> },
    { key: "/provider/orders", icon: <ShoppingCartOutlined />, label: <Link to="orders">Đơn hàng</Link> },
    { key: "/provider/products", icon: <AppstoreOutlined />, label: <Link to="products">Sản phẩm</Link> },
    { key: "/provider/payouts", icon: <DollarOutlined />, label: <Link to="payouts">Thanh toán</Link> },
    { key: "/provider/settings", icon: <SettingOutlined />, label: <Link to="settings">Cài đặt</Link> },
  ];

  const selectedKey = items.find(i => pathname.startsWith(i.key))?.key ?? "/provider/dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={240} breakpoint="lg">
        <div style={{ color: "#fff", padding: 16, fontWeight: 700, fontSize: 18 }}>
          Provider Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#071a2c",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 16,
          }}
        >
          <div style={{ fontWeight: 600 }}>Xin chào, {user?.name || user?.email}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {/* ĐÃ BỎ nút "Về trang khách" */}
            <Button
              icon={<LogoutOutlined />}
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              Đăng xuất
            </Button>
          </div>
        </Header>

        <Content style={{ padding: 16, background: tk.colorBgLayout }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
