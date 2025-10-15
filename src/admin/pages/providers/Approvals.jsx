// =============================
// File: src/admin/pages/providers/Approvals.jsx
// =============================
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Tag, message, Checkbox, Space } from "antd";
import { AdminApi } from "../../api/adminApi.js";

export default function ProvidersApprovals() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal từ chối + gửi thông báo
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [sendNotify, setSendNotify] = useState(true);
  const [current, setCurrent] = useState(null);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await AdminApi.listProviders("pending");
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      message.error(e?.message || "Không tải được danh sách chờ duyệt");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { reload(); }, []);

  // Duyệt nhanh (không cần lý do)
  const approve = (rec) => {
    Modal.confirm({
      title: "Phê duyệt provider?",
      content: `Xác nhận duyệt hồ sơ của "${rec.name}" (${rec.email}).`,
      okText: "Duyệt",
      okButtonProps: { type: "primary" },
      cancelText: "Huỷ",
      async onOk() {
        await AdminApi.approveProvider(rec.id, true, "");
        message.success("Đã phê duyệt");
        reload();
      },
    });
  };

  // Mở modal từ chối + thông báo
  const openReject = (rec) => {
    setCurrent(rec);
    setReason("");
    setSendNotify(true);
    setRejectOpen(true);
  };

  // Gửi từ chối + (tuỳ chọn) gửi thông báo
  const submitReject = async () => {
    if (!reason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối");
      return;
    }
    setRejecting(true);
    try {
      await AdminApi.approveProvider(current.id, false, reason.trim());
      // Gửi thông báo nếu có API hỗ trợ
      if (sendNotify && typeof AdminApi?.notifyProvider === "function") {
        try {
          await AdminApi.notifyProvider(current.id, {
            title: "Hồ sơ bị từ chối",
            message: reason.trim(),
            type: "rejection",
          });
        } catch (e) {
          message.warning("Đã từ chối, nhưng gửi thông báo chưa thành công.");
        }
      }
      message.success("Đã từ chối hồ sơ");
      setRejectOpen(false);
      reload();
    } catch (e) {
      message.error(e?.message || "Không thể từ chối");
    } finally {
      setRejecting(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 100 },
    { title: "Tên cửa hàng", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (s) => (
        <Tag color={s === "pending" ? "orange" : s === "approved" ? "green" : "red"}>{s}</Tag>
      ),
    },
    {
      title: "Thao tác",
      width: 260,
      render: (_, r) => (
        <Space>
          <Button type="primary" onClick={() => approve(r)}>Duyệt</Button>
          <Button danger onClick={() => openReject(r)}>Từ chối + lý do</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table rowKey="id" loading={loading} columns={columns} dataSource={rows} />

      <Modal
        title={`Từ chối hồ sơ: ${current?.name || ""}`}
        open={rejectOpen}
        onOk={submitReject}
        okText="Từ chối & Gửi"
        confirmLoading={rejecting}
        onCancel={() => setRejectOpen(false)}
      >
        <p>Nhập <b>lý do từ chối</b> để provider biết cần chỉnh sửa gì:</p>
        <Input.TextArea
          rows={4}
          placeholder="Ví dụ: Thiếu giấy phép kinh doanh; Ảnh CMND/CCCD không rõ;..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div style={{ marginTop: 12 }}>
          <Checkbox checked={sendNotify} onChange={(e) => setSendNotify(e.target.checked)}>
            Gửi thông báo lý do từ chối cho provider
          </Checkbox>
        </div>
        <p style={{ marginTop: 8, opacity: 0.8 }}>
        </p>
      </Modal>
    </>
  );
}
