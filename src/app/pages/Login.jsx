// src/app/pages/Login.jsx
import React, { useState } from "react";
import {
  Card, Form, Input, Button, Typography, Divider, Checkbox, Space, message
} from "antd";
import {
  LockOutlined, MailOutlined, GoogleOutlined, GithubOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.jsx"; // đảm bảo đúng đường dẫn & đuôi

const { Title, Text, Link } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const next = new URLSearchParams(location.search).get("next");

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const userPayload = {
        name: values.email?.split("@")[0] || "Người dùng",
        email: values.email,
        role: values.asProvider ? "provider" : "customer",
      };

      const u = await login(userPayload);
      message.success("Đăng nhập thành công");

      if (u?.role === "provider") {
        navigate(next || "/provider", { replace: true });
      } else {
        navigate(next || "/", { replace: true });
      }
    } catch (err) {
      message.error(err?.message || "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCustomer = () => {
    form.setFieldsValue({
      email: "user@example.com",
      password: "12345678",
      remember: true,
      asProvider: false,
    });
  };

  const fillDemoProvider = () => {
    form.setFieldsValue({
      email: "provider@example.com",
      password: "12345678",
      remember: true,
      asProvider: true,
    });
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 96px)",
        display: "grid",
        placeItems: "center",
        background: "#f7f8fb",
      }}
    >
      <Card
        style={{ width: 460, borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,.08)" }}
        // ✅ Antd v5: thay bodyStyle bằng styles.body
        styles={{ body: { padding: 28 } }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={12}>
          <div style={{ textAlign: "center" }}>
            <Title level={3} style={{ margin: 0 }}>Đăng nhập</Title>
            <Text type="secondary">Chào mừng quay lại Charge Hub</Text>
          </div>

          <Form form={form} layout="vertical" style={{ marginTop: 8 }} onFinish={onFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="you@example.com" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ tôi</Checkbox>
              </Form.Item>
              <Form.Item name="asProvider" valuePropName="checked" noStyle>
                <Checkbox>Tôi là Provider</Checkbox>
              </Form.Item>
              <Link>Quên mật khẩu?</Link>
            </div>

            <Space style={{ width: "100%" }}>
              <Button onClick={fillDemoCustomer}>Demo Customer</Button>
              <Button onClick={fillDemoProvider}>Demo Provider</Button>
            </Space>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{ borderRadius: 9999, marginTop: 8 }}
              loading={submitting}
            >
              Đăng nhập
            </Button>

            <Divider plain>hoặc</Divider>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Button icon={<GoogleOutlined />} block>Tiếp tục với Google</Button>
              <Button icon={<GithubOutlined />} block>Tiếp tục với GitHub</Button>
            </Space>

            <div style={{ marginTop: 12, textAlign: "center" }}>
              <Text>Bạn chưa có tài khoản? </Text>
              <Link onClick={() => navigate("/signup")}>Đăng ký</Link>
            </div>
          </Form>
        </Space>
      </Card>
    </div>
  );
}
