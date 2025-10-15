// src/components/HeaderNav.jsx
import React from "react";
import {
  Layout,
  Button,
  Drawer,
  Menu,
  Dropdown,
  Avatar,
  Space,
  Typography,
  Divider,
  Input,
} from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";

const { Header } = Layout;
const { Text } = Typography;

/**
 * STYLE PRESETS
 * - CONTAINER: khung bọc nội dung cố định max 1200px, canh giữa, padding 16px.
 * - PILL: viên "thuốc" nền trắng bo tròn chứa logo, menu, search/profile.
 * - BTN_H: chiều cao chung cho button/ô input để căn đồng đều.
 */
const CONTAINER = { maxWidth: 1200, margin: "0 auto", padding: "0 16px" };
const PILL = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 10,
  paddingInline: 16,
  background: "#fff",
  borderRadius: 9999,
  boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
};
const BTN_H = 38;

/**
 * Hook: useIsMobile
 * PURPOSE: Xác định xem viewport < breakpoint (mặc định 992px) để chuyển UI sang mobile.
 * RUNS WHEN: mount + mỗi lần window resize.
 * READS: window.innerWidth
 * WRITES: state isMobile
 * SIDE EFFECTS: add/remove event listener resize
 */
function useIsMobile(breakpoint = 992) {
  const get = () =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false;
  const [isMobile, setIsMobile] = React.useState(get);
  React.useEffect(() => {
    const onResize = () => setIsMobile(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

/**
 * Component: HeaderNav
 * PURPOSE: Thanh điều hướng sticky cho khu vực app client (không phải admin).
 * RUNS WHEN: Được render trong App.jsx (trừ route /login, /signup).
 * INPUTS: none (dùng context/router nội bộ).
 * OUTPUTS: Header sticky gồm: logo → menu (desktop) → search + avatar/login (desktop) hoặc Drawer (mobile).
 * READS:
 *  - isMobile (hook), pathname (router), isAuthed/user (auth context)
 * WRITES:
 *  - open (state) để mở/đóng Drawer trong mobile
 * NAVIGATES:
 *  - navigate(to) khi bấm nút menu (desktop) hoặc chọn item trong Drawer (mobile)
 * CALLS: logout() khi chọn Đăng xuất
 */
export default function HeaderNav() {
  const isMobile = useIsMobile(992);          // READS: width → UI mobile/desktop
  const navigate = useNavigate();             // CALLS: điều hướng
  const { pathname } = useLocation();         // READS: path hiện tại để active menu
  const [open, setOpen] = React.useState(false); // WRITES: mở/đóng Drawer mobile

  const { user, isAuthed, logout } = useAuth();  // READS: user/isAuthed; CALLS: logout()

  /**
   * SubComponent: NavBtn
   * PURPOSE: Nút menu dạng pill (desktop)
   * READS: pathname để bôi đậm khi trùng to
   * NAVIGATES: navigate(to) khi click
   */
  const NavBtn = ({ to, children }) => (
    <Button
      shape="round"
      onClick={() => navigate(to)}
      style={{
        background: "transparent",
        border: "none",
        height: BTN_H,
        padding: "0 16px",
        color: pathname === to ? "#1677ff" : "#222",
        fontWeight: pathname === to ? 600 : 500,
        display: "inline-flex",
        alignItems: "center",
      }}
      // NOTE: hiệu ứng hover inline (đơn giản). Có thể chuyển sang CSS :hover cho mượt hơn.
      onMouseEnter={(e) => (e.currentTarget.style.background = "#e6e7e9")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
    </Button>
  );

  // MENU ITEMS (mobile Drawer). key = path để Menu.selectedKeys hoạt động theo pathname.
  const menuItems = [
    { key: "/data", label: "Gói dữ liệu" },
    { key: "/map", label: "Map" },
    { key: "/news", label: "Tin tức" },
    { key: "/support", label: "Hỗ trợ" },
  ];

  /**
   * Dropdown profile (desktop)
   * FLOW:
   *  - "Hồ sơ" → /profile
   *  - "Cài đặt" → /settings
   *  - "Đăng xuất" → logout(); navigate("/")
   */
  const profileMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "Hồ sơ",
        onClick: () => navigate("/profile"),
      },
      {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Cài đặt",
        onClick: () => navigate("/settings"),
      },
      { type: "divider" },
      {
        key: "logout",
        danger: true,
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        onClick: () => {
          logout();
          navigate("/");
        },
      },
    ],
  };

  return (
    <Header
      id="app-header"          // READS by App.jsx để đo header height (paddingTop nội dung)
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "transparent",
        padding: 16,
      }}
    >
      <div style={CONTAINER}>
        {/* PILL: nền trắng bo tròn chứa logo/menu/search/profile */}
        <div style={PILL}>
          {/* LOGO → điều hướng "/" */}
          <NavLink
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingInline: 12,
              textDecoration: "none",
              color: "#111",
              whiteSpace: "nowrap",
            }}
          >
            <img
              src="/logo1.png"
              alt="Charge Hub"
              width={28}
              height={28}
              style={{ display: "block" }}
              onError={(e) => e.currentTarget.remove()} // NOTE: nếu ảnh lỗi → loại bỏ <img>
            />
            <strong style={{ letterSpacing: 2 }}>
              CHARGE <span style={{ color: "#1677ff" }}>HUB</span>
            </strong>
          </NavLink>

          {/* MENU DESKTOP: chỉ hiện khi !isMobile */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: 6,
                borderRadius: 9999,
                background: "#fff",
              }}
            >
              <NavBtn to="/data">Gói dữ liệu</NavBtn>
              <NavBtn to="/map">Map</NavBtn>
              <NavBtn to="/news">Tin tức</NavBtn>
              <NavBtn to="/support">Hỗ trợ</NavBtn>
            </div>
          )}

          {/* FILLER: đẩy phần search/profile sang phải */}
          <div style={{ flex: 1 }} />

          {/* SEARCH + PROFILE (DESKTOP) */}
          {!isMobile ? (
            <Space size={10}>
              {/* Search box (chưa gắn xử lý) */}
              <Input
                allowClear
                placeholder="Tìm kiếm"
                size="large"
                style={{
                  width: 360,
                  height: BTN_H,
                  borderRadius: 9999,
                }}
                // TODO: onPressEnter={(e) => navigate(`/search?q=${encodeURIComponent(e.target.value)}`)}
              />

              {/* Auth action: nếu chưa login → nút Đăng nhập; nếu đã login → avatar + dropdown */}
              {!isAuthed ? (
                <Button
                  type="primary"
                  shape="round"
                  onClick={() => navigate("/login")}
                  style={{ height: BTN_H, paddingInline: 18 }}
                >
                  Đăng nhập
                </Button>
              ) : (
                <Dropdown menu={profileMenu} trigger={["click"]}>
                  <Avatar
                    size={36}
                    src={user?.avatar}
                    icon={<UserOutlined />}
                    style={{
                      cursor: "pointer",
                      border: "2px solid #eaeaea",
                      background: "#fff",
                    }}
                  />
                </Dropdown>
              )}
            </Space>
          ) : (
            // MOBILE: chỉ hiện nút menu → Drawer chứa search + actions + menu
            <>
              <Button
                shape="circle"
                icon={<MenuOutlined />}
                onClick={() => setOpen(true)}
                style={{ border: "none" }}
                aria-label="Mở menu"
              />
              <Drawer
                placement="right"
                open={open}
                onClose={() => setOpen(false)}
                bodyStyle={{ padding: 0 }}
              >
                {/* Drawer content */}
                <div style={{ padding: 16 }}>
                  {/* Search trong Drawer */}
                  <Input.Search
                    placeholder="Tìm kiếm…"
                    allowClear
                    style={{ marginBottom: 12 }}
                    // TODO: onSearch={(val) => { setOpen(false); navigate(`/search?q=${encodeURIComponent(val)}`); }}
                  />

                  {/* Khối auth trong Drawer */}
                  {!isAuthed ? (
                    <Button
                      type="primary"
                      shape="round"
                      block
                      onClick={() => {
                        setOpen(false);
                        navigate("/login");
                      }}
                    >
                      Đăng nhập
                    </Button>
                  ) : (
                    <>
                      <Space align="center">
                        <Avatar size={36} src={user?.avatar} icon={<UserOutlined />} />
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {user?.name || "Người dùng"}
                          </div>
                          <Text type="secondary">{user?.email}</Text>
                        </div>
                      </Space>

                      <Divider style={{ margin: "12px 0" }} />

                      <Button
                        block
                        onClick={() => {
                          setOpen(false);
                          navigate("/profile");
                        }}
                      >
                        Hồ sơ
                      </Button>
                      <Button
                        block
                        onClick={() => {
                          setOpen(false);
                          navigate("/settings");
                        }}
                        style={{ marginTop: 8 }}
                      >
                        Cài đặt
                      </Button>
                      <Button
                        danger
                        block
                        style={{ marginTop: 8 }}
                        onClick={() => {
                          logout();
                          setOpen(false);
                          navigate("/");
                        }}
                      >
                        Đăng xuất
                      </Button>
                    </>
                  )}
                </div>

                {/* MENU LINK (MOBILE) */}
                <Menu
                  mode="inline"
                  selectedKeys={[pathname]} // READS: pathname → highlight mục hiện tại
                  onClick={({ key }) => {
                    navigate(key);     // NAVIGATES: đến path tương ứng
                    setOpen(false);    // WRITES: đóng Drawer
                  }}
                  items={menuItems}
                />
              </Drawer>
            </>
          )}
        </div>
      </div>
    </Header>
  );
}
