// src/pages/provider/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table } from "antd";

export default function ProviderDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0 });
  const [latestOrders, setLatestOrders] = useState([]);

  useEffect(() => {
    setStats({ revenue: 128000000, orders: 32, products: 14 });
    setLatestOrders([
      { id: "ODR-1001", customer: "Nguyễn A", total: 450000, status: "pending" },
      { id: "ODR-1002", customer: "Trần B", total: 1290000, status: "paid" },
    ]);
  }, []);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Row gutter={16}>
        <Col xs={24} md={8}><Card><Statistic title="Doanh thu (VNĐ)" value={stats.revenue} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Đơn hàng" value={stats.orders} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="Sản phẩm" value={stats.products} /></Card></Col>
      </Row>

      <Card title="Đơn hàng gần đây">
        <Table
          rowKey="id"
          dataSource={latestOrders}
          pagination={false}
          columns={[
            { title: "Mã", dataIndex: "id" },
            { title: "Khách", dataIndex: "customer" },
            { title: "Tổng (VNĐ)", dataIndex: "total" },
            { title: "Trạng thái", dataIndex: "status" },
          ]}
        />
      </Card>
    </div>
  );
}
