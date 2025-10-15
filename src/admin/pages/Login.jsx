// =============================
// File: src/admin/pages/Login.jsx
// =============================
// (Giữ nguyên import gốc; thêm vài cải tiến nhỏ)
import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../app/context/auth.jsx";

const { Title } = Typography;

/**
 * Page: AdminLogin
 * PURPOSE: Thu thập thông tin đăng nhập và gọi login(); điều hướng về trang trước đó.
 * INPUTS: username, password từ Form.
 * OUTPUTS: message thành công/thất bại; điều hướng sang "from" hoặc "/".
 */
export default function AdminLogin() {
  const { isAuthed, login } = useAuth(); // READS: trạng thái & hàm login từ context
  const nav = useNavigate();
  const loc = useLocation();
  const [loading, setLoading] = useState(false);

  // Đích cần quay lại (được ProtectedRoute đính trong state.from)
  const from = loc.state?.from;
  const safeFrom = !from || from.startsWith("/login") ? "/" : from;

  // Nếu đã đăng nhập mà vẫn vào /login → đưa về trang cũ luôn
  useEffect(() => {
    if (isAuthed) {
      nav(safeFrom, { replace: true });
    }
  }, [isAuthed, safeFrom, nav]);

  // HANDLER: submit form đăng nhập
  const onFinish = async ({ username, password }) => {
    setLoading(true);
    try {
      // Tuỳ context: login có thể ném lỗi khi sai, hoặc trả về boolean
      const ok = await login(username, password);
      if (ok === false) {
        message.error("Đăng nhập không thành công. Vui lòng kiểm tra lại.");
        return;
      }
      message.success("Đăng nhập thành công");
      nav(safeFrom, { replace: true });
    } catch (e) {
      message.error(e?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f6f8fb",
      }}
    >
      <Card style={{ width: 360 }}>
        <Title level={4} style={{ textAlign: "center", marginBottom: 16 }}>
          Admin Login
        </Title>

        <Form layout="vertical" onFinish={onFinish} autoComplete="on">
          <Form.Item
            label="Tài khoản"
            name="username"
            rules={[{ required: true, message: "Nhập tài khoản" }]}
          >
            <Input autoFocus autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Nhập mật khẩu" }]}
          >
            <Input.Password autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}
