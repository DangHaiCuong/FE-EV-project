// src/app/pages/provider/Orders.jsx
import React from "react";
import { Table, Tag } from "antd";

export default function ProviderOrders() {
  const data = [
    { id: "ODR-1001", customer: "Nguyễn A", total: 450000, status: "pending" },
    { id: "ODR-1002", customer: "Trần B", total: 1290000, status: "paid" },
  ];

  const columns = [
    { title: "Mã đơn", dataIndex: "id" },
    { title: "Khách hàng", dataIndex: "customer" },
    { title: "Tổng (VNĐ)", dataIndex: "total" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => <Tag color={s === "paid" ? "green" : "gold"}>{s}</Tag>,
    },
  ];

  return <Table rowKey="id" dataSource={data} columns={columns} pagination={false} />;
}
