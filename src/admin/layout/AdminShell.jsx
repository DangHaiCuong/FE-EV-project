// src/admin/layout/AdminShell.jsx
import React from "react";
import { Layout, Menu, Button, Dropdown, Avatar, Input, theme, Divider } from "antd";
import {
  AppstoreOutlined, ShopOutlined, TeamOutlined, ThunderboltOutlined, FileProtectOutlined,
  BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined,
  SearchOutlined, DatabaseOutlined, ProfileOutlined, CreditCardOutlined, BarChartOutlined,
  MessageOutlined, DollarOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../app/context/auth.jsx";

const { Header, Sider, Content } = Layout;
const HEADER_H = 56;

export default function AdminShell({ children }) {
  const { token } = theme.useToken();
  const { pathname } = useLocation();
  const { isAuthed, logout, user } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const items = [
    { type: "group", label: "MENU" },

    { key: "/", icon: <AppstoreOutlined />, label: <Link to="/">Bảng điều khiển</Link> },

    // ✅ Provider (đúng route: /providers/*)
    {
      key: "providers",
      icon: <ShopOutlined />,
      label: "Provider",
      children: [
        { key: "/providers/list", label: <Link to="/providers/list">Danh sách</Link> },
        { key: "/providers/approve", label: <Link to="/providers/approve">Duyệt hồ sơ</Link> },
      ],
    },

    // ✅ Customer (đúng route: /customers/*)
    {
      key: "customers",
      icon: <TeamOutlined />,
      label: "Customer",
      children: [
        { key: "/customers/users", label: <Link to="/customers/users">Người dùng</Link> },
      ],
    },

    // Vận hành -> Quản lý dữ liệu
    {
      key: "ops",
      icon: <ThunderboltOutlined />,
      label: "Quản lý dữ liệu",
      children: [
        { key: "/ops/stations", label: <Link to="/ops/stations">Trạm sạc</Link> },
        { key: "/ops/chargers", label: <Link to="/ops/chargers">Bộ sạc</Link> },
        { key: "/ops/ports", label: <Link to="/ops/ports">Cổng sạc</Link> },
        { key: "/ops/status", label: <Link to="/ops/status">Trạng thái</Link> },
      ],
    },

    // ✅ Quản lý gói (đúng route: /packages/*)
    {
      key: "packages",
      icon: <ProfileOutlined />,
      label: "Quản lý gói",
      children: [
        { key: "/packages/plans", label: <Link to="/packages/plans">Gói dịch vụ</Link> },
        { key: "/packages/transactions", label: <Link to="/packages/transactions">Giao dịch</Link> },
      ],
    },

    // Dataset sau Quản lý gói
    { key: "/datasets", icon: <DatabaseOutlined />, label: <Link to="/datasets">Dataset</Link> },

    // Ví ảo -> Payment
    {
      key: "payment",
      icon: <CreditCardOutlined />,
      label: "Payment",
      children: [
        { key: "/payment/overview", label: <Link to="/payment/overview">Tổng quan</Link> },
        { key: "/payment/wallet-customers", label: <Link to="/payment/wallet-customers">Ví Customer</Link> },
        { key: "/payment/wallet-providers", label: <Link to="/payment/wallet-providers">Ví Provider</Link> },
      ],
    },

    // Doanh thu
    {
      key: "revenue",
      icon: <BarChartOutlined />,
      label: "Doanh thu",
      children: [
        { key: "/revenue/overview", label: <Link to="/revenue/overview">Tổng quan</Link> },
        { key: "/revenue/commissions", label: <Link to="/revenue/commissions">Hoa hồng</Link> },
        { key: "/revenue/api", label: <Link to="/revenue/api">Doanh thu API</Link> },
      ],
    },

    { key: "/reports", icon: <FileProtectOutlined />, label: <Link to="/reports">Báo cáo</Link> },

    // SUPPORT
    { type: "group", label: "SUPPORT" },
    { key: "/support/chat", icon: <MessageOutlined />, label: <Link to="/support/chat">Chat</Link> },
    { key: "/support/pricing", icon: <DollarOutlined />, label: <Link to="/support/pricing">Giá & Biểu phí</Link> },
    { key: "/support/policy", icon: <FileProtectOutlined />, label: <Link to="/support/policy">Chính sách</Link> },
  ];

  const profileMenu = {
    items: [
      { key: "me", label: <span>Hồ sơ</span>, icon: <UserOutlined /> },
      { type: "divider" },
      { key: "logout", danger: true, label: "Đăng xuất", icon: <LogoutOutlined />, onClick: logout },
    ],
  };

  const styles = {
    shell: { minHeight: "100vh", background: token.colorBgLayout },
    sider: { borderRight: "1px solid #eee" },
    logo: {
      height: HEADER_H,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 12px",
      borderBottom: "1px solid #eee",
    },
    brand: { fontWeight: 700, whiteSpace: "nowrap" },
    header: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      height: HEADER_H,
      lineHeight: `${HEADER_H}px`,
      background: "#071a2c",
      color: "#fff",
      paddingInline: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    left: { display: "flex", alignItems: "center", gap: 8, flex: "1 1 auto" },
    search: { width: "100%", maxWidth: 560 },
    right: { display: "flex", alignItems: "center", gap: 12 },
    profile: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    meta: { lineHeight: 1.1 },
    content: { padding: 16, background: "#f7f9fc" },
  };

  return (
    <Layout style={styles.shell}>
      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        style={styles.sider}
        breakpoint="lg"
        collapsedWidth={64}
      >
        <div style={styles.logo}>
          <img src="/vite.svg" alt="logo" width={24} height={24} />
          {!collapsed && (<div style={styles.brand}><b>CHARGE</b> HUB <span style={{ fontWeight: 500 }}>ADMIN</span></div>)}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[pathname || "/"]}
          defaultOpenKeys={["providers","customers","ops","packages","payment","revenue"]}
          items={items}
          style={{ borderInlineEnd: "none" }}
        />
      </Sider>

      <Layout>
        <Header style={styles.header}>
          <div style={styles.left}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((v) => !v)}
              style={{ color: "#fff" }}
            />
            <Input allowClear prefix={<SearchOutlined />} placeholder="Search…  ⌘K" style={styles.search} />
          </div>

          <div style={styles.right}>
            <Button type="text" icon={<BellOutlined />} style={{ color: "#fff" }} />
            <Divider type="vertical" style={{ borderInlineColor: "rgba(255,255,255,.18)" }} />
            {isAuthed ? (
              <Dropdown menu={profileMenu} trigger={["click"]}>
                <div style={styles.profile}>
                  <Avatar size={32} icon={<UserOutlined />} />
                  <div style={styles.meta}>
                    <div className="name">{user?.name || "Admin"}</div>
                    <div className="role" style={{ opacity: 0.75 }}>Administrator</div>
                  </div>
                </div>
              </Dropdown>
            ) : (
              <Button onClick={logout} icon={<LogoutOutlined />}>Đăng xuất</Button>
            )}
          </div>
        </Header>

        <Content style={styles.content}>{children ?? <Outlet />}</Content>
      </Layout>
    </Layout>
  );
}
