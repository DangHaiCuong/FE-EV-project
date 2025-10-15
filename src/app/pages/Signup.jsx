// src/pages/Signup.jsx
import React, { useState } from "react";
import {
  Card, Steps, Button, Form, Input, Select, Typography, Radio, Space, message, Row, Col
} from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Bình Dương",
  "Đồng Nai",
];

export default function Signup() {
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState(null); // "user" | "provider"
  const [formUser] = Form.useForm();
  const [formProvider] = Form.useForm();
  const navigate = useNavigate();

  const next = async () => {
    if (step === 0) {
      if (!accountType) return message.error("Vui lòng chọn loại tài khoản");
      setStep(1);
    }
  };

  const back = () => {
    if (step === 1) setStep(0);
  };

  const submitUser = async () => {
    try {
      const values = await formUser.validateFields();
      // Fake API
      const payload = {
        role: "user",
        user: {
          fullName: values.fullName,
          email: values.email,
        },
      };
      console.log("SIGNUP_PAYLOAD", payload);
      message.success("Đăng ký User thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (e) {}
  };

  const submitProvider = async () => {
    try {
      const v = await formProvider.validateFields();
      const payload = {
        role: "provider",
        provider_basic: {
          entityType: "company",
          companyName: v.companyName,
          taxId: v.taxId,
          website: v.website || undefined,
          province: v.province,
          address: v.address,
          contact: {
            name: v.contactName,
            email: v.contactEmail,
            phone: v.contactPhone,
          },
        },
      };
      console.log("SIGNUP_PAYLOAD", payload);
      message.success("Đăng ký Provider thành công! Vui lòng chờ duyệt & đăng nhập.");
      navigate("/login");
    } catch (e) {}
  };

  return (
    <div style={{ minHeight: "calc(100vh - 96px)", display: "grid", placeItems: "center", background: "#f7f8fb" }}>
      <Card style={{ width: 880, maxWidth: "95vw", borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,.08)" }} bodyStyle={{ padding: 28 }}>
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <div style={{ textAlign: "center" }}>
            <Title level={3} style={{ margin: 0 }}>Đăng ký tài khoản</Title>
            <Text type="secondary">Chọn loại tài khoản và điền thông tin</Text>
          </div>

          <Steps
            current={step}
            items={[
              { title: "Chọn loại tài khoản" },
              { title: accountType === "provider" ? "Thông tin doanh nghiệp" : "Thông tin người dùng" },
            ]}
          />

          {/* STEP 0: Chọn loại tài khoản */}
          {step === 0 && (
            <div style={{ paddingTop: 8 }}>
              <Radio.Group
                onChange={(e) => setAccountType(e.target.value)}
                value={accountType}
                style={{ width: "100%" }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card
                      onClick={() => setAccountType("user")}
                      hoverable
                      style={{
                        borderColor: accountType === "user" ? "#52c41a" : undefined,
                        borderRadius: 12,
                      }}
                    >
                      <Space direction="vertical">
                        <Title level={5} style={{ margin: 0 }}>Tôi là User</Title>
                        <Text type="secondary">Mua & quản lý dữ liệu đã mua.</Text>
                        <Radio value="user">Chọn User</Radio>
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card
                      onClick={() => setAccountType("provider")}
                      hoverable
                      style={{
                        borderColor: accountType === "provider" ? "#52c41a" : undefined,
                        borderRadius: 12,
                      }}
                    >
                      <Space direction="vertical">
                        <Title level={5} style={{ margin: 0 }}>Tôi là Provider (Doanh nghiệp)</Title>
                        <Text type="secondary">Đăng tải & bán dữ liệu EV. (Chỉ nhận Doanh nghiệp)</Text>
                        <Radio value="provider">Chọn Provider</Radio>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Radio.Group>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                <Button type="primary" onClick={next}>Tiếp tục</Button>
              </div>
            </div>
          )}

          {/* STEP 1: Form theo loại tài khoản */}
          {step === 1 && accountType === "user" && (
            <Form
              form={formUser}
              layout="vertical"
              style={{ marginTop: 8 }}
              initialValues={{ fullName: "", email: "", password: "" }}
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }, { min: 2, message: "Tối thiểu 2 ký tự" }]}
              >
                <Input placeholder="Nguyễn Văn A" size="large" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}
              >
                <Input placeholder="you@example.com" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }, { min: 6, message: "Tối thiểu 6 ký tự" }]}
              >
                <Input.Password placeholder="••••••••" size="large" />
              </Form.Item>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <Button onClick={back}>Quay lại</Button>
                <Button type="primary" onClick={submitUser} id="signup-submit">Đăng ký</Button>
              </div>
            </Form>
          )}

          {step === 1 && accountType === "provider" && (
            <Form
              form={formProvider}
              layout="vertical"
              style={{ marginTop: 8 }}
              initialValues={{
                companyName: "", taxId: "", website: "", province: undefined, address: "",
                contactName: "", contactEmail: "", contactPhone: ""
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item
                    name="companyName"
                    label="Tên doanh nghiệp (theo GPKD)"
                    rules={[{ required: true, message: "Vui lòng nhập tên DN" }, { min: 2, message: "Tối thiểu 2 ký tự" }]}
                  >
                    <Input placeholder="CÔNG TY TNHH EV DATA" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="taxId"
                    label="Mã số thuế"
                    rules={[
                      { required: true, message: "Vui lòng nhập MST" },
                      { pattern: /^[0-9]{8,14}$/, message: "MST 8–14 chữ số" },
                    ]}
                  >
                    <Input placeholder="0123456789" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="website" label="Website (nếu có)">
                    <Input placeholder="https://..." size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="province"
                    label="Tỉnh/Thành"
                    rules={[{ required: true, message: "Chọn Tỉnh/Thành" }]}
                  >
                    <Select placeholder="Chọn" size="large" allowClear>
                      {PROVINCES.map((p) => (
                        <Option key={p} value={p}>{p}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }, { min: 5, message: "Tối thiểu 5 ký tự" }]}
                  >
                    <Input placeholder="Số nhà, đường, phường/xã, quận/huyện" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="contactName"
                    label="Người liên hệ"
                    rules={[{ required: true, message: "Vui lòng nhập tên liên hệ" }, { min: 2, message: "Tối thiểu 2 ký tự" }]}
                  >
                    <Input placeholder="Nguyễn Văn A" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="contactEmail"
                    label="Email liên hệ"
                    rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}
                  >
                    <Input placeholder="contact@example.com" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="contactPhone"
                    label="Điện thoại liên hệ"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }, { pattern: /^\+?[0-9]{9,15}$/, message: "9–15 chữ số, có thể có dấu +" }]}
                  >
                    <Input placeholder="+84xxxxxxxxx" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <Button onClick={back}>Quay lại</Button>
                <Button type="primary" onClick={submitProvider} id="signup-submit">Đăng ký</Button>
              </div>
            </Form>
          )}
        </Space>
      </Card>
    </div>
  );
}
