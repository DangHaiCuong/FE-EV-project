// src/pages/Profile.jsx
import React from "react";
import {
  Layout, Menu, Card, Row, Col, Typography, Button, Tag, Space, Divider
} from "antd";
import {
  AppstoreOutlined, DatabaseOutlined, ShoppingCartOutlined,
  WalletOutlined, MessageOutlined, UserOutlined, QuestionCircleOutlined
} from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

// ---- small components ----
function StatCard({ title, value, icon }) {
  return (
    <Card style={{ borderRadius: 12 }}>
      <Space size={10} align="center">
        {icon}
        <div>
          <Text type="secondary">{title}</Text>
          <Title level={3} style={{ margin: 0 }}>{value}</Title>
        </div>
      </Space>
    </Card>
  );
}

function DatasetCard({ name, city, price, tags = [] }) {
  return (
    <Card style={{ borderRadius: 12, height: "100%" }}>
      <Title level={5} style={{ marginBottom: 8 }}>{name}</Title>
      <Space size={[6, 6]} wrap>
        {tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
        {city && <Tag color="blue">{city}</Tag>}
      </Space>
      <div style={{ marginTop: 12 }}>
        <Text type="secondary">Giá:</Text>{" "}
        <Title level={4} style={{ display: "inline", margin: 0 }}>₫ {price}</Title>
      </div>
      <Button type="primary" style={{ marginTop: 12, borderRadius: 9999 }}>
        Thêm vào giỏ
      </Button>
    </Card>
  );
}

export default function Profile() {
  // dữ liệu demo
  const stats = [
    { title: "Số dư ví", value: "₫ 510.000", icon: <WalletOutlined /> },
    { title: "Dataset đã mua", value: 12, icon: <DatabaseOutlined /> },
    { title: "Đơn hàng chờ xử lý", value: 1, icon: <ShoppingCartOutlined /> },
    { title: "Nhà cung cấp theo dõi", value: 5, icon: <AppstoreOutlined /> },
  ];

  const recommends = [
    { name: "Trạng thái theo thời gian thực - Quận 1", city: "HCM", price: "490.000", tags: ["Realtime", "AC/DC"] },
    { name: "Lịch sử phiên sạc 30 ngày - Đà Nẵng", city: "Đà Nẵng", price: "350.000", tags: ["Lịch sử", "AC"] },
    { name: "Công suất giờ cao điểm - Hà Nội", city: "HN", price: "520.000", tags: ["Công suất", "DC"] },
  ];

  return (
    <Layout style={{ background: "transparent" }}>
      {/* Sider */}
      <Sider
        width={240}
        style={{ background: "transparent", padding: 12 }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Card style={{ borderRadius: 12, padding: 0 }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["overview"]}
            items={[
              { key: "overview", icon: <AppstoreOutlined />, label: "Tổng quan" },
              { key: "datasets", icon: <DatabaseOutlined />, label: "Kho dữ liệu" },
              { key: "orders", icon: <ShoppingCartOutlined />, label: "Đơn hàng" },
              { key: "wallet", icon: <WalletOutlined />, label: "Ví" },
              { key: "messages", icon: <MessageOutlined />, label: "Tin nhắn" },
              { key: "profile", icon: <UserOutlined />, label: "Hồ sơ" },
              { type: "divider" },
              { key: "support", icon: <QuestionCircleOutlined />, label: "Trung tâm trợ giúp" },
            ]}
          />
        </Card>
      </Sider>

      {/* Content */}
      <Layout style={{ background: "transparent" }}>
        <Content style={{ padding: 12 }}>
          {/* Hàng thống kê */}
          <Row gutter={[12, 12]}>
            {stats.map((s, i) => (
              <Col key={i} xs={24} md={12} lg={6}>
                <StatCard {...s} />
              </Col>
            ))}
          </Row>

          {/* Gợi ý cho bạn + Trạng thái */}
          <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
            <Col xs={24} lg={18}>
              <Card style={{ borderRadius: 12 }}>
                <Title level={4} style={{ marginBottom: 4 }}>Gợi ý cho bạn</Title>
                <Text type="secondary">Dataset phổ biến</Text>
                <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                  {recommends.map((d, i) => (
                    <Col key={i} xs={24} md={12} lg={8}>
                      <DatasetCard {...d} />
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={6}>
              <Card style={{ borderRadius: 12, height: "100%" }}>
                <Title level={4} style={{ marginBottom: 8 }}>Trạng thái</Title>
                <Text type="secondary">Tài khoản & thông báo</Text>
                <Divider style={{ margin: "12px 0" }} />
                <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.9 }}>
                  <li>Email đã xác minh</li>
                  <li>2FA: Chưa bật</li>
                  <li>1 tin nhắn mới</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
