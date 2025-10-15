// =============================
// File: src/admin/pages/customers/Users.jsx
// =============================
import React, { useEffect, useMemo, useState } from "react";
import {
  Table, Tag, Button, Space, Input, Drawer, Descriptions,
  message, Modal, Checkbox, Alert, Tabs, List, Divider, Popconfirm
} from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { AdminApi } from "../../api/adminApi.js";

/** Map FE<->BE status
 * FE: registered | pending | verified | rejected | blocked
 * BE: new | submitted | pending | approved | rejected | blocked
 */
const toFE = (s) => {
  switch ((s || "").toLowerCase()) {
    case "new":        return "registered";
    case "submitted":  return "pending";
    case "pending":    return "pending";
    case "approved":   return "verified";
    case "rejected":   return "rejected";
    case "blocked":    return "blocked";
    case "registered":
    case "verified":
      return s;
    default:
      return "registered";
  }
};
const toBE = (s) => {
  switch ((s || "").toLowerCase()) {
    case "registered": return "new";
    case "pending":    return "pending";
    case "verified":   return "approved";
    case "rejected":   return "rejected";
    case "blocked":    return "blocked";
    default:           return undefined;
  }
};

const statusMeta = (s) => {
  switch (s) {
    case "registered": return { color: "default", label: "Mới tạo" };
    case "pending":    return { color: "orange",  label: "Chờ duyệt" };
    case "verified":   return { color: "green",   label: "Đã định danh" };
    case "rejected":   return { color: "red",     label: "Bị từ chối" };
    case "blocked":    return { color: "pink",    label: "Đã khoá" };
    default:           return { color: "default", label: s || "Mới tạo" };
  }
};
const isWaiting = (s) => toFE(s) === "pending";

export default function Users() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(); // FE status filter
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  // Reject modal
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [sendNotify, setSendNotify] = useState(true);

  // Block modal
  const [blockOpen, setBlockOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [blockNotify, setBlockNotify] = useState(true);

  // Sessions & Security
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Notifications
  const [channels, setChannels] = useState(["email"]);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [sending, setSending] = useState(false);
  const [notifHistory, setNotifHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const load = async (feStatus) => {
    setLoading(true);
    try {
      const beStatus = toBE(feStatus);
      const data = await AdminApi.listUsers(beStatus);
      const normalized = (Array.isArray(data) ? data : []).map((u) => ({
        ...u,
        status: toFE(u.status),
        role: "customer",
      }));

      // DEV ONLY: gieo 1 user pending nếu chưa có để test nút duyệt/từ chối trong Drawer
      if (import.meta.env.DEV && normalized.length && !normalized.some(u => u.status === "pending")) {
        const idx = normalized.findIndex(u => u.status === "registered" || !u.status);
        const i = idx >= 0 ? idx : 0;
        normalized[i] = { ...normalized[i], status: "pending" };
      }

      setRows(normalized);
      setStatus(feStatus);
    } catch (e) {
      message.error(e?.message || "Không tải được danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return rows.filter((r) => {
      const byStatus = !status || r.status === status;
      const byQ =
        !keyword ||
        String(r.name || "").toLowerCase().includes(keyword) ||
        String(r.email || "").toLowerCase().includes(keyword);
      return byStatus && byQ;
    });
  }, [rows, status, q]);

  const refreshDetail = async (id) => {
    try {
      const full = await AdminApi.getUser(id);
      const merged = { ...detail, ...full, status: toFE(full?.status ?? detail?.status) };
      setDetail(merged);
    } catch {}
  };

  const loadSessions = async (id) => {
    setLoadingSessions(true);
    try {
      const list = await AdminApi.listSessions(id);
      setSessions(Array.isArray(list) ? list : []);
    } catch {
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadNotifHistory = async (id) => {
    setLoadingHistory(true);
    try {
      const list = await AdminApi.getNotificationHistory(id);
      setNotifHistory(Array.isArray(list) ? list : []);
    } catch {
      setNotifHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openDetail = async (r) => {
    try {
      const full = await AdminApi.getUser(r.id);
      const merged = { ...r, ...full, status: toFE(full?.status ?? r.status) };
      setDetail(merged);
      setOpen(true);
      loadSessions(merged.id);
      loadNotifHistory(merged.id);
    } catch {
      setDetail(r);
      setOpen(true);
      loadSessions(r.id);
      loadNotifHistory(r.id);
    }
  };

  // KYC approve / reject (ở trong Drawer)
  const verifyKYC = async (id = detail?.id) => {
    try {
      await AdminApi.verifyUserKYC(id, true, "");
      message.success("Đã xác nhận định danh");
      setRejectOpen(false);
      await refreshDetail(id);
      await load(status);
    } catch (e) {
      message.error(e?.message || "Không thể xác nhận");
    }
  };
  const openReject = () => {
    setReason("");
    setSendNotify(true);
    setRejectOpen(true);
  };
  const submitReject = async () => {
    if (!reason.trim()) return message.warning("Vui lòng nhập lý do từ chối");
    setRejecting(true);
    try {
      await AdminApi.verifyUserKYC(detail.id, false, reason.trim());
      if (sendNotify && typeof AdminApi?.notifyUser === "function") {
        try {
          await AdminApi.notifyUser(detail.id, {
            channels: ["inapp"],
            title: "Tài khoản chưa đạt yêu cầu định danh",
            message: reason.trim(),
            type: "rejection",
          });
        } catch {}
      }
      message.success("Đã từ chối định danh");
      setRejectOpen(false);
      await refreshDetail(detail.id);
      await load(status);
    } catch (e) {
      message.error(e?.message || "Không thể từ chối");
    } finally {
      setRejecting(false);
    }
  };

  // Block / Unblock
  const doBlock = async () => {
    if (!blockReason.trim()) return message.warning("Vui lòng nhập lý do khoá");
    setBlocking(true);
    try {
      await AdminApi.blockUser(detail.id, blockReason.trim());
      if (blockNotify && typeof AdminApi?.notifyUser === "function") {
        try {
          await AdminApi.notifyUser(detail.id, {
            channels: ["inapp"],
            title: "Tài khoản đã bị khoá",
            message: blockReason.trim(),
            type: "blocked",
          });
        } catch {}
      }
      message.success("Đã khoá tài khoản");
      setBlockOpen(false);
      await refreshDetail(detail.id);
      await load(status);
    } catch (e) {
      message.error(e?.message || "Không thể khoá tài khoản");
    } finally {
      setBlocking(false);
    }
  };
  const doUnblock = async () => {
    try {
      await AdminApi.unblockUser(detail.id);
      message.success("Đã mở khoá tài khoản");
      await refreshDetail(detail.id);
      await load(status);
    } catch (e) {
      message.error(e?.message || "Không thể mở khoá");
    }
  };

  // Security & sessions
  const resetPasswordNext = async () => {
    try {
      await AdminApi.resetPasswordNextLogin(detail.id);
      message.success("Đã buộc đổi mật khẩu lần đăng nhập sau");
    } catch (e) {
      message.error(e?.message || "Không thực hiện được");
    }
  };
  const reset2FA = async () => {
    try {
      await AdminApi.reset2FA(detail.id);
      message.success("Đã reset 2FA");
    } catch (e) {
      message.error(e?.message || "Không reset được 2FA");
    }
  };
  const revokeAll = async () => {
    try {
      await AdminApi.revokeAllSessions(detail.id);
      message.success("Đã thu hồi tất cả phiên");
      loadSessions(detail.id);
    } catch (e) {
      message.error(e?.message || "Không thu hồi được phiên");
    }
  };
  const revokeOne = async (sid) => {
    try {
      await AdminApi.revokeSession(detail.id, sid);
      message.success("Đã thu hồi phiên");
      loadSessions(detail.id);
    } catch (e) {
      message.error(e?.message || "Không thu hồi được phiên");
    }
  };

  // Notify one user
  const sendNotif = async () => {
    if (!notifTitle.trim() || !notifBody.trim()) {
      return message.warning("Nhập tiêu đề và nội dung");
    }
    setSending(true);
    try {
      await AdminApi.notifyUser(detail.id, {
        channels,
        title: notifTitle.trim(),
        message: notifBody.trim(),
        type: "manual",
      });
      message.success("Đã gửi thông báo");
      setNotifTitle("");
      setNotifBody("");
      loadNotifHistory(detail.id);
    } catch (e) {
      message.error(e?.message || "Không gửi được thông báo");
    } finally {
      setSending(false);
    }
  };

  // ====== COLUMNS (đã bỏ nút Duyệt/Từ chối khỏi bảng; chỉ còn trong Drawer) ======
  const columns = [
    { title: "ID", dataIndex: "id", width: 100 },
    { title: "Họ tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Vai trò",
      dataIndex: "role",
      width: 110,
      render: () => <Tag color="blue">customer</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 140,
      render: (s) => {
        const m = statusMeta(s);
        return <Tag color={m.color}>{m.label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      width: 240,
      render: (_, r) => (
        <Space wrap>
          <Button icon={<EyeOutlined />} onClick={() => openDetail(r)}>Xem</Button>
          {r.status !== "blocked" ? (
            <Button
              onClick={() => {
                setDetail(r);
                setBlockReason("");
                setBlockNotify(true);
                setBlockOpen(true);
              }}
            >
              Khoá
            </Button>
          ) : (
            <Popconfirm title="Mở khoá tài khoản này?" onConfirm={doUnblock}>
              <Button>Mở khoá</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];
  // ===============================================================================

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
        <Button onClick={() => load()}             type={!status ? "primary" : "default"}>Tất cả</Button>
        <Button onClick={() => load("registered")} type={status === "registered" ? "primary" : "default"}>Mới tạo</Button>
        <Button onClick={() => load("pending")}    type={status === "pending"    ? "primary" : "default"}>Chờ duyệt</Button>
        <Button onClick={() => load("verified")}   type={status === "verified"   ? "primary" : "default"}>Đã định danh</Button>
        <Button onClick={() => load("rejected")}   type={status === "rejected"   ? "primary" : "default"}>Bị từ chối</Button>
        <Button onClick={() => load("blocked")}    type={status === "blocked"    ? "primary" : "default"}>Đã khoá</Button>
        <Button icon={<ReloadOutlined />} onClick={() => load(status)}>Tải lại</Button>
      </Space>

      <Table rowKey="id" loading={loading} columns={columns} dataSource={filtered} />

      {/* Drawer */}
      <Drawer
        width={700}
        title={`Chi tiết người dùng: ${detail?.name || ""}`}
        open={open}
        onClose={() => setOpen(false)}
        destroyOnClose
        extra={
          <Space>
            {detail?.status !== "blocked" ? (
              <Button onClick={() => { setBlockReason(""); setBlockNotify(true); setBlockOpen(true); }}>
                Khoá
              </Button>
            ) : (
              <Popconfirm title="Mở khoá tài khoản này?" onConfirm={doUnblock}>
                <Button>Mở khoá</Button>
              </Popconfirm>
            )}
            {isWaiting(detail?.status) && (
              <>
                <Button type="primary" onClick={() => verifyKYC(detail.id)}>Duyệt</Button>
                <Button danger onClick={openReject}>Từ chối</Button>
              </>
            )}
          </Space>
        }
      >
        {detail && (
          <Tabs
            defaultActiveKey="info"
            items={[
              {
                key: "info",
                label: "Thông tin",
                children: (
                  <>
                    {detail.status === "registered" && (
                      <Alert type="info" showIcon message="Người dùng chưa gửi thông tin định danh." style={{ marginBottom: 12 }} />
                    )}
                    {detail.status === "rejected" && detail.note && (
                      <Alert type="warning" showIcon message="Lý do từ chối gần nhất" description={detail.note} style={{ marginBottom: 12 }} />
                    )}
                    <Descriptions column={2} bordered size="small">
                      <Descriptions.Item label="ID">{detail.id}</Descriptions.Item>
                      <Descriptions.Item label="Email">{detail.email || "-"}</Descriptions.Item>
                      <Descriptions.Item label="Họ tên" span={2}>{detail.name || "-"}</Descriptions.Item>
                      <Descriptions.Item label="Vai trò"><Tag color="blue">customer</Tag></Descriptions.Item>
                      <Descriptions.Item label="Trạng thái">
                        {(() => { const m = statusMeta(detail.status); return <Tag color={m.color}>{m.label}</Tag>; })()}
                      </Descriptions.Item>
                      {"phone" in detail && <Descriptions.Item label="SĐT">{detail.phone || "-"}</Descriptions.Item>}
                      {"address" in detail && <Descriptions.Item label="Địa chỉ" span={2}>{detail.address || "-"}</Descriptions.Item>}
                      {"idNumber" in detail && <Descriptions.Item label="Số định danh">{detail.idNumber || "-"}</Descriptions.Item>}
                      {"createdAt" in detail && <Descriptions.Item label="Ngày tạo">{String(detail.createdAt).replace("T"," ").slice(0,19)}</Descriptions.Item>}
                      {"kycImages" in detail && (
                        <Descriptions.Item label="Tài liệu KYC" span={2}>
                          {Array.isArray(detail.kycImages) ? detail.kycImages.join(", ") : (detail.kycImages || "-")}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </>
                ),
              },
              {
                key: "security",
                label: "Bảo mật & Phiên",
                children: (
                  <>
                    <Space wrap>
                      <Button onClick={resetPasswordNext}>Buộc đổi mật khẩu</Button>
                      <Button onClick={reset2FA}>Reset 2FA</Button>
                      <Popconfirm title="Thu hồi tất cả phiên đang đăng nhập?" onConfirm={revokeAll}>
                        <Button danger>Thu hồi tất cả phiên</Button>
                      </Popconfirm>
                    </Space>
                    <Divider />
                    <Table
                      size="small"
                      rowKey="id"
                      loading={loadingSessions}
                      dataSource={sessions}
                      columns={[
                        { title: "Thiết bị", dataIndex: "device", width: 160 },
                        { title: "IP", dataIndex: "ip", width: 120 },
                        { title: "User-Agent", dataIndex: "ua" },
                        { title: "Lần cuối", dataIndex: "lastSeen", width: 170, render: v => String(v).replace("T"," ").slice(0,19) },
                        {
                          title: "Thao tác",
                          width: 120,
                          render: (_, s) => (
                            <Popconfirm title="Thu hồi phiên này?" onConfirm={() => revokeOne(s.id)}>
                              <Button size="small">Thu hồi</Button>
                            </Popconfirm>
                          ),
                        },
                      ]}
                    />
                  </>
                ),
              },
              {
                key: "notify",
                label: "Gửi thông báo",
                children: (
                  <>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Checkbox.Group
                        options={[
                          { label: "Email", value: "email" },
                          { label: "FCM", value: "fcm" },
                          { label: "Zalo", value: "zalo" },
                          { label: "In-app", value: "inapp" },
                        ]}
                        value={channels}
                        onChange={setChannels}
                      />
                      <Input placeholder="Tiêu đề" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} />
                      <Input.TextArea rows={4} placeholder="Nội dung" value={notifBody} onChange={(e) => setNotifBody(e.target.value)} />
                      <Button type="primary" loading={sending} onClick={sendNotif}>Gửi thông báo</Button>
                    </Space>
                    <Divider />
                    <List
                      header="Lịch sử gửi"
                      loading={loadingHistory}
                      dataSource={notifHistory}
                      renderItem={(n) => (
                        <List.Item>
                          <Space direction="vertical" size={0}>
                            <b>{n.title}</b>
                            <span style={{ opacity: .8 }}>{n.channels?.join(", ") || "-"}</span>
                            <span style={{ fontSize: 12, opacity: .6 }}>{String(n.createdAt).replace("T"," ").slice(0,19)}</span>
                            <div>{n.message}</div>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </>
                ),
              },
            ]}
          />
        )}
      </Drawer>

      {/* Modal từ chối */}
      <Modal
        title={`Từ chối định danh: ${detail?.name || ""}`}
        open={rejectOpen}
        onOk={submitReject}
        okText="Từ chối & Gửi"
        confirmLoading={rejecting}
        onCancel={() => setRejectOpen(false)}
      >
        <p>Nhập <b>Lý do từ chối</b> để người dùng biết cần chỉnh sửa gì:</p>
        <Input.TextArea
          rows={4}
          placeholder="Ví dụ: Ảnh giấy tờ mờ; thông tin không trùng khớp;..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div style={{ marginTop: 12 }}>
          <Checkbox checked={sendNotify} onChange={(e) => setSendNotify(e.target.checked)}>
            Gửi thông báo lý do từ chối cho người dùng
          </Checkbox>
        </div>
      </Modal>

      {/* Modal khoá */}
      <Modal
        title={`Khoá tài khoản: ${detail?.name || ""}`}
        open={blockOpen}
        onOk={doBlock}
        okText="Khoá & Gửi"
        confirmLoading={blocking}
        onCancel={() => setBlockOpen(false)}
      >
        <p>Nhập <b>Lý do khoá</b> (sẽ gửi cho người dùng nếu bật “Gửi thông báo”):</p>
        <Input.TextArea
          rows={3}
          placeholder="Ví dụ: Nghi ngờ gian lận; vi phạm điều khoản;..."
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
        />
        <div style={{ marginTop: 12 }}>
          <Checkbox checked={blockNotify} onChange={(e) => setBlockNotify(e.target.checked)}>
            Gửi thông báo cho người dùng
          </Checkbox>
        </div>
      </Modal>
    </>
  );
}
