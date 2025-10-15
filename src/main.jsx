// src/main.jsx
const target = import.meta.env.VITE_TARGET || "app";
document.title = target === "admin" ? "Charge Hub — Admin" : "Charge Hub";
console.log("BOOT target =", target);

(async () => {
  try {
    if (target === "admin") {
      await import("./admin/main.jsx");
    } else {
      await import("./app/main.jsx");
    }
  } catch (err) {
    console.error("Boot import failed:", err);
    const rootEl = document.getElementById("root");
    if (rootEl) {
      rootEl.innerHTML = `
        <div style="padding:16px;border:1px solid #fecaca;background:#fef2f2;color:#991b1b;border-radius:8px">
          <b>Không thể nạp bundle ${target}.</b><br/>
          Kiểm tra lại đường dẫn import, tên file (.jsx), và lỗi trong console.
        </div>
      `;
    }
  }
})();
