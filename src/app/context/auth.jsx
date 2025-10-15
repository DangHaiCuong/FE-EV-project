// src/context/auth.jsx
import React from "react";

/** Dùng lại key cũ để không làm mất session hiện tại (admin_token/admin_user) */
const LS_TOKEN = "admin_token";
const LS_USER  = "admin_user";

function safeGetJSON(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function safeSetJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function getAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const AuthCtx = React.createContext(null);
export const useAuth = () => React.useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [token, setToken] = React.useState(null);
  const [user,  setUser]  = React.useState(null); // { id, email, name, role }
  const [loading, setLoading] = React.useState(true);

  // Khởi tạo từ localStorage
  React.useEffect(() => {
    const t = localStorage.getItem(LS_TOKEN);
    const u = safeGetJSON(LS_USER);
    setToken(t || null);
    setUser(u || null);
    setLoading(false);
  }, []);

  const isAuthed = !!token && !!user;

  /** Ghi state + localStorage */
  const persist = React.useCallback((t, u) => {
    if (!t || !u) throw new Error("Thiếu token hoặc user");
    localStorage.setItem(LS_TOKEN, t);
    safeSetJSON(LS_USER, u);
    setToken(t);
    setUser(u);
    return u;
  }, []);

  /** Đăng nhập:
   * - login(email, password): gọi API POST /api/auth/login (nếu lỗi → fallback demo)
   * - login(payload): payload có thể là { token, ...user }
   * Luôn trả về object user để trang Login điều hướng theo role.
   */
  const login = React.useCallback(async (a, b) => {
    // Trường hợp truyền payload trực tiếp
    if (typeof a === "object" && a) {
      const { token: tk, ...u } = a;
      const token = tk || `demo_${Date.now()}`;
      // đảm bảo có role để UI định tuyến (mặc định customer)
      const userObj = { role: "customer", ...u };
      return persist(token, userObj);
    }

    // Trường hợp email/password
    if (typeof a === "string" && typeof b === "string") {
      const email = a, password = b;
      if (email.length < 3 || password.length < 3) {
        throw new Error("Thông tin đăng nhập chưa hợp lệ");
      }

      // Thử gọi API thật
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "Đăng nhập thất bại");

        const { token: tk, user: u } = json || {};
        if (!tk || !u) throw new Error("Thiếu token hoặc user");
        // đảm bảo có role
        const userObj = { role: "customer", ...u };
        return persist(tk, userObj);
      } catch (err) {
        // Fallback DEMO để bạn test nhanh khi BE chưa sẵn
        const demoUser = {
          id: 1,
          email,
          name: "Demo Provider",
          role: "provider", // cho phép test luồng /provider
        };
        const demoToken = `demo_${Date.now()}`;
        return persist(demoToken, demoUser);
      }
    }

    throw new Error("login(...) sai tham số");
  }, [persist]);

  /** Đăng xuất */
  const logout = React.useCallback(() => {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
    setToken(null);
    setUser(null);
  }, []);

  /** Cập nhật 1 phần thông tin user (không đổi token) */
  const updateUser = React.useCallback((patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...(patch || {}) };
      safeSetJSON(LS_USER, next);
      return next;
    });
  }, []);

  /** (Tuỳ chọn) làm mới thông tin tài khoản từ API */
  const refreshUser = React.useCallback(async () => {
    if (!token) return null;
    try {
      const res = await fetch("/api/me", { headers: { ...getAuthHeaders(token) } });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Không lấy được thông tin người dùng");
      // giữ nguyên token, cập nhật user
      const next = { role: "customer", ...(json?.user || {}) };
      safeSetJSON(LS_USER, next);
      setUser(next);
      return next;
    } catch {
      return null;
    }
  }, [token]);

  // Đồng bộ đa tab
  React.useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem(LS_TOKEN));
      setUser(safeGetJSON(LS_USER));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = React.useMemo(
    () => ({
      token,
      user,
      isAuthed,
      loading,
      login,
      logout,
      updateUser,
      refreshUser,
      // helpers theo role
      isProvider: user?.role === "provider",
      isAdmin: user?.role === "admin",
      isCustomer: user?.role === "customer",
    }),
    [token, user, isAuthed, loading, login, logout, updateUser, refreshUser]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
