// src/app/main.jsx
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntApp, theme } from "antd";
import viVN from "antd/locale/vi_VN";
import "antd/dist/reset.css";
import "../index.css"; // CSS global của app nằm ở src/index.css

import App from "./App.jsx";
import { AuthProvider } from "./context/auth.jsx";

function Root() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // optional: lắng nghe custom event để toggle theme
  useEffect(() => {
    const handler = () => setIsDark((v) => !v);
    window.addEventListener("toggle-theme", handler);
    return () => window.removeEventListener("toggle-theme", handler);
  }, []);

  const antdTheme = useMemo(
    () => ({
      token: { borderRadius: 10, colorPrimary: "#1677ff" },
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }),
    [isDark]
  );

  return (
    <BrowserRouter>
      <ConfigProvider locale={viVN} theme={antdTheme}>
        <AntApp>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
