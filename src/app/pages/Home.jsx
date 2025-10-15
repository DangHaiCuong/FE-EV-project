// src/pages/Home.jsx
import { Row, Col, Typography, Space, Button } from "antd";

const { Title, Paragraph } = Typography;

// Chữ gradient
function Gradient({ children }) {
  return (
    <span
      style={{
        background: "linear-gradient(90deg, #6d4aff 0%, #4f7dff 45%, #00cdeb 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div>
      {/* HERO (giống Paren, căn giữa) */}
      <section style={{ background: "#f7f8fb" }}>
        <div className="container" style={{ paddingTop: 72, paddingBottom: 56 }}>
          <Row justify="center">
            <Col xs={24} md={22} lg={20} xl={18}>
              <Title
                level={1}
                style={{
                  margin: 0,
                  textAlign: "center",
                  fontWeight: 800,
                  lineHeight: 1.08,
                  fontSize: "clamp(32px, 6.2vw, 64px)",
                  letterSpacing: ".2px",
                }}
              >
                Kết nối nhà cung cấp và
                <br />
                <Gradient>người dùng qua dữ liệu EV toàn diện</Gradient>
              </Title>

              <Paragraph
                style={{
                  marginTop: 14,
                  marginInline: "auto",
                  maxWidth: 780,
                  textAlign: "center",
                  color: "#667085",
                  fontSize: "clamp(14px, 1.8vw, 16px)",
                }}
              >
                Nền tảng dữ liệu EV giúp kết nối nhà cung cấp, người dùng và quản lý minh bạch
                để thúc đẩy phát triển bền vững.
              </Paragraph>

              <Space
                wrap
                style={{
                  marginTop: 18,
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                  width: "100%",
                }}
              >
                <Button type="primary" size="large" shape="round">
                  Khám phá Leaderboard
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </section>

      {/* (ĐÃ BỎ PHẦN METRICS GRID) */}
    </div>
  );
}
