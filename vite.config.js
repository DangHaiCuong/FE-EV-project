// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // nếu sau này cần đọc env: const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],

    // 1 entry duy nhất: index.html (KHÔNG cấu hình rollupOptions.input)
    // vì src/main.jsx sẽ import app/admin theo VITE_TARGET

    server: {
      // tiện lợi: mở đúng port theo script bạn đang dùng
      // (vite --port ... trong scripts sẽ override nếu khác)
      port: 5173,
      // mở tự động trang root; bạn có thể đổi trong script nếu muốn
      open: '/',
    },

    // build/preview giữ nguyên — thư mục output bạn đã set trong scripts (--outDir)
    build: {
      // có thể thêm target, sourcemap nếu cần
      // sourcemap: mode !== 'production',
    },
  }
})
