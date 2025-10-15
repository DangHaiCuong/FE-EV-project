// =============================
// File: src/admin/pages/providers/List.jsx
// =============================
import React, { useEffect, useMemo, useState } from "react";
import { Table, Tag, Button, Space, Input, Drawer, Descriptions, message } from "antd";
import { DownloadOutlined, EyeOutlined, ReloadOutlined, CopyOutlined } from "@ant-design/icons";
import { AdminApi } from "../../api/adminApi.js";

/**
 * Page: ProvidersList
 * PURPOSE: Danh sách tất cả provider (xem, lọc, tìm kiếm, xuất CSV).
 * NOTE: Không chứa chức năng phê duyệt. Việc duyệt chỉ nằm ở trang Approvals.
 */
export default function ProvidersList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(); // undefined -> tất cả
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const load = async (statusParam) => {
    setLoading(true);
    try {
      const data = await AdminApi.listProviders(statusParam);
      setRows(Array.isArray(data) ? data : []);
      setStatus(statusParam);
    } catch (e) {
      message.error(e?.message || "Không tải được danh sách provider");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onView = (record) => {
    setCurrent(record);
    setOpen(true);
  };

  const onCopyId = async (id) => {
    try {
      await navigator.clipboard.writeText(String(id));
      message.success("Đã sao chép ID");
    } catch {
      message.error("Không sao chép được ID");
    }
  };

  const exportCsv = () => {
    const header = ["id","name","email","status"];
    const lines = [header.join(",")];
    filtered.forEach(r => {
      const row = [
        r.id ?? "",
        (r.name ?? "").replaceAll(",", " "),
        (r.email ?? "").replaceAll(",", " "),
        r.status ?? "",
      ];
      lines.push(row.join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "providers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return rows.filter(r => {
      const byStatus = !status || r.status === status;
      const byQ =
        !keyword ||
        (String(r.name || "").toLowerCase().includes(keyword)) ||
        (String(r.email || "").toLowerCase().includes(keyword));
      return byStatus && byQ;
    });
  }, [rows, status, q]);

  const columns = [
    { title: "ID", dataIndex: "id", width: 100 },
    { title: "Tên cửa hàng", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (s) => (
        <Tag color={s === "approved" ? "green" : s === "pending" ? "orange" : "red"}>
          {s}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      width: 220,
      render: (_, r) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => onView(r)}>Xem</Button>
          <Button icon={<CopyOutlined />} onClick={() => onCopyId(r.id)}>Sao chép ID</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* Controls */}
      <Space style={{ marginBottom: 12 }} wrap>
        <Input.Search
          style={{ width: 300 }}
          placeholder="Tìm theo tên/email"
          allowClear
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button onClick={() => load()} type={!status ? "primary" : "default"}>Tất cả</Button>
        <Button onClick={() => load("pending")} type={status === "pending" ? "primary" : "default"}>Chờ duyệt</Button>
        <Button onClick={() => load("approved")} type={status === "approved" ? "primary" : "default"}>Đã duyệt</Button>
        <Button onClick={() => load("rejected")} type={status === "rejected" ? "primary" : "default"}>Đã từ chối</Button>
        <Button icon={<ReloadOutlined />} onClick={() => load(status)}>Tải lại</Button>
        <Button icon={<DownloadOutlined />} onClick={exportCsv}>Xuất CSV</Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filtered}
      />

      <Drawer
        width={520}
        title={`Provider #${current?.id || ""}`}
        open={open}
        onClose={() => setOpen(false)}
        destroyOnClose
      >
        {current && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Tên">{current.name || "-"}</Descriptions.Item>
            <Descriptions.Item label="Email">{current.email || "-"}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={current.status === "approved" ? "green" : current.status === "pending" ? "orange" : "red"}>
                {current.status}
              </Tag>
            </Descriptions.Item>
            {"company" in current && (
              <Descriptions.Item label="Công ty">{current.company || "-"}</Descriptions.Item>
            )}
            {"phone" in current && (
              <Descriptions.Item label="SĐT">{current.phone || "-"}</Descriptions.Item>
            )}
            {"address" in current && (
              <Descriptions.Item label="Địa chỉ">{current.address || "-"}</Descriptions.Item>
            )}
            {"docs" in current && (
              <Descriptions.Item label="Tài liệu">
                {Array.isArray(current.docs) ? current.docs.join(", ") : (current.docs || "-")}
              </Descriptions.Item>
            )}
            {"createdAt" in current && (
              <Descriptions.Item label="Ngày tạo">{String(current.createdAt).replace("T"," ").slice(0,19)}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>
    </>
  );
}
