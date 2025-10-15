// =============================
// File: src/admin/api/adminApi.js
// =============================

/**
 * PURPOSE: Cung cấp các hàm API giả lập (mock) cho khu vực admin.
 * RUNS WHEN: Được import từ các trang như Users/Providers/Approvals/Wallet.
 * STORAGE: Dùng biến trong bộ nhớ (mất dữ liệu khi reload trang).
 * LATENCY: Mỗi call chờ ~300ms để mô phỏng network.
 *
 * CÁCH DÙNG (ví dụ):
 *   const rows = await AdminApi.listUsers("an");   // READS: USERS
 *   await AdminApi.toggleUser("U001", false);      // WRITES: USERS[*].enabled
 *   await AdminApi.approveProvider("P002", true);  // WRITES: PROVIDERS[*].status="approved"
 *   const sum = await AdminApi.walletSummary();    // READS: TXS → RETURNS { totalBalance, inflow, outflow }
 */

// -----------------------------
// Helpers & mock data
// -----------------------------
function wait(ms = 300) {
  return new Promise((r) => setTimeout(r, ms));
}

/** @typedef {{ id:string, name:string, email:string, phone?:string, role:'user'|'provider'|'admin', enabled:boolean, createdAt:string }} User */
/** @typedef {{ id:string, name:string, email:string, phone?:string, status:'pending'|'approved'|'rejected', docs?:string, note?:string }} Provider */
/** @typedef {{ id:string, createdAt:string, type:'in'|'out', amount:number, note?:string }} WalletTx */

// MOCK: người dùng
let USERS /** @type {User[]} */ = [
  { id: "U001", name: "Nguyễn An",  email: "an@example.com",   phone: "0901 234 567", role: "user",     enabled: true,  createdAt: "2025-09-01" },
  { id: "U002", name: "Trần Bình",  email: "binh@example.com", phone: "0902 222 333", role: "user",     enabled: false, createdAt: "2025-09-05" },
  { id: "U003", name: "Lê Chi",     email: "chi@example.com",  phone: "0903 999 111", role: "provider", enabled: true,  createdAt: "2025-09-12" },
];

// MOCK: nhà cung cấp
let PROVIDERS /** @type {Provider[]} */ = [
  { id: "P001", name: "Cửa hàng A", email: "a@shop.com", phone: "0911 111 111", status: "approved", docs: "#" },
  { id: "P002", name: "Cửa hàng B", email: "b@shop.com", phone: "0912 222 222", status: "pending",  docs: "#" },
  { id: "P003", name: "Cửa hàng C", email: "c@shop.com", phone: "0913 333 333", status: "rejected", docs: "#" },
];

// MOCK: giao dịch ví (30 ngày gần đây + thêm vài bản ghi cũ)
let TXS /** @type {WalletTx[]} */ = [
  { id: "T20250915-001", createdAt: "2025-09-15 09:20", type: "in",  amount:  500000, note: "Nạp ví" },
  { id: "T20250919-002", createdAt: "2025-09-19 14:05", type: "out", amount: -230000, note: "Thanh toán đối soát" },
  { id: "T20250925-003", createdAt: "2025-09-25 08:10", type: "in",  amount:  900000, note: "Nạp ví" },
  { id: "T20251002-004", createdAt: "2025-10-02 18:33", type: "out", amount: -120000, note: "Hoàn tiền" },
  { id: "T20251005-005", createdAt: "2025-10-05 10:12", type: "in",  amount: 1500000, note: "Doanh thu đơn hàng" },
  { id: "T20250820-006", createdAt: "2025-08-20 11:00", type: "in",  amount:  200000, note: "Cũ hơn 30 ngày" },
];

// -----------------------------
// API surface
// -----------------------------
export const AdminApi = {
  // ===== Users =====

  /**
   * listUsers
   * PURPOSE: Lấy danh sách người dùng; nếu có `q` thì lọc theo tên/email/SĐT.
   * INPUTS: q?:string (từ khoá tìm)
   * READS: USERS
   * RETURNS: Promise<User[]>
   */
  async listUsers(q) {
    await wait();
    if (!q) return USERS;
    const k = q.toLowerCase().trim();
    return USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(k) ||
        u.email.toLowerCase().includes(k) ||
        (u.phone || "").includes(k)
    );
  },

  /**
   * toggleUser
   * PURPOSE: Bật/tắt tài khoản người dùng.
   * INPUTS: id:string, enabled:boolean
   * WRITES: USERS[*].enabled
   * RETURNS: { ok:true }
   * ERRORS: throw Error nếu không tìm thấy id
   */
  async toggleUser(id, enabled) {
    await wait();
    let found = false;
    USERS = USERS.map((u) => {
      if (u.id === id) {
        found = true;
        return { ...u, enabled };
      }
      return u;
    });
    if (!found) throw new Error("User không tồn tại");
    return { ok: true };
  },

  /**
   * updateUserRole
   * PURPOSE: Cập nhật vai trò người dùng.
   * INPUTS: id:string, role:'user'|'provider'|'admin'
   * WRITES: USERS[*].role
   * RETURNS: { ok:true }
   * ERRORS: throw Error nếu không tìm thấy id
   */
  async updateUserRole(id, role) {
    await wait();
    let found = false;
    USERS = USERS.map((u) => {
      if (u.id === id) {
        found = true;
        return { ...u, role };
      }
      return u;
    });
    if (!found) throw new Error("User không tồn tại");
    return { ok: true };
  },

  /**
   * getUser
   * PURPOSE: Lấy chi tiết 1 người dùng theo id.
   * INPUTS: id:string
   * READS: USERS
   * RETURNS: Promise<User|undefined>
   */
  async getUser(id) {
    await wait();
    return USERS.find((u) => u.id === id);
  },

  // ===== Providers =====

  /**
   * listProviders
   * PURPOSE: Lấy danh sách provider; nếu có `status` thì chỉ lọc theo trạng thái.
   * INPUTS: status?:'pending'|'approved'|'rejected'
   * READS: PROVIDERS
   * RETURNS: Promise<Provider[]>
   */
  async listProviders(status) {
    await wait();
    return status ? PROVIDERS.filter((p) => p.status === status) : PROVIDERS;
  },

  /**
   * approveProvider
   * PURPOSE: Duyệt / Từ chối 1 provider.
   * INPUTS: id:string, approved:boolean, note?:string
   * WRITES: PROVIDERS[*].status = 'approved'|'rejected'; PROVIDERS[*].note = note
   * RETURNS: { ok:true }
   * ERRORS: throw Error nếu không tìm thấy id
   */
  async approveProvider(id, approved, note) {
    await wait();
    let found = false;
    PROVIDERS = PROVIDERS.map((p) => {
      if (p.id === id) {
        found = true;
        return { ...p, status: approved ? "approved" : "rejected", note };
      }
      return p;
    });
    if (!found) throw new Error("Provider không tồn tại");
    return { ok: true };
  },

  // ===== Wallet =====

  /**
   * walletSummary
   * PURPOSE: Tính toán số dư tổng & dòng tiền 30 ngày gần nhất (inflow/outflow).
   * INPUTS: none
   * READS: TXS
   * RETURNS: Promise<{ totalBalance:number, inflow:number, outflow:number }>
   * NOTES:
   *  - totalBalance: tổng cộng tất cả giao dịch (kể cả >30 ngày).
   *  - inflow/outflow: chỉ tính trong 30 ngày gần đây (type 'in' tăng, 'out' âm).
   */
  async walletSummary() {
    await wait();
    // Tổng số dư toàn bộ
    const totalBalance = TXS.reduce((acc, t) => acc + t.amount, 0);

    // 30 ngày gần đây
    const now = new Date();
    const d30 = new Date(now);
    d30.setDate(now.getDate() - 30);

    let inflow = 0;
    let outflow = 0;
    for (const t of TXS) {
      const tDate = new Date(t.createdAt);
      if (!isNaN(+tDate) && tDate >= d30) {
        if (t.type === "in") inflow += Math.abs(t.amount);
        else outflow += Math.abs(t.amount);
      }
    }
    return { totalBalance, inflow, outflow };
  },

  /**
   * walletTransactions
   * PURPOSE: Trả về danh sách giao dịch ví (mới → cũ).
   * INPUTS: none
   * READS: TXS
   * RETURNS: Promise<WalletTx[]>
   */
  async walletTransactions() {
    await wait();
    // clone & sort desc by createdAt
    return [...TXS].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
};
