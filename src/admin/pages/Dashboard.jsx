import React from "react";
import { Card, Row, Col, Statistic, Typography } from "antd";

const { Title } = Typography;

export default function AdminDashboard() {
  const stats = [
    { title: "Doanh thu (tháng)", value: 128_500_000, suffix: "₫" },
    { title: "Người dùng mới", value: 238 },
    { title: "Lượt mua", value: 712 },
    { title: "Tỉ lệ chuyển đổi", value: 3.8, suffix: "%" },
  ];
  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>Admin Dashboard</Title>
      <Row gutter={[16,16]}>
        {stats.map(s=>(
          <Col xs={24} sm={12} md={12} lg={6} key={s.title}>
            <Card><Statistic title={s.title} value={s.value} suffix={s.suffix} precision={s.suffix==="%"?1:0}/></Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
