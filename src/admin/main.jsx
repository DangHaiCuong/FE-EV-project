// =============================
// File: src/admin/main.jsx
// =============================
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/reset.css";
import "../index.css";

import { AuthProvider } from "../app/context/auth.jsx";
import AdminApp from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AdminApp />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
