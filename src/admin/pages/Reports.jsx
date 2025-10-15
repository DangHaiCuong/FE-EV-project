// src/admin/pages/Reports.jsx
import React from "react";
import { Card, Row, Col } from "antd";

// Có cả default export và named export để tránh lỗi "does not provide an export named 'default'"
function Reports() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="User growth">Chart placeholder</Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="Provider growth">Chart placeholder</Card>
      </Col>
      <Col xs={24}>
        <Card title="Revenue growth">Chart placeholder</Card>
      </Col>
    </Row>
  );
}

export default Reports;
export { Reports };
